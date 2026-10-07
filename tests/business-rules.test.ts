import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../server/db/store';
import { paymentService } from '../server/services/paymentService';

describe('Atelier & Académie Business Logic Engine', () => {
  beforeEach(() => {
    // Reset cart
    store.clearCart('test_cart_1');
  });

  describe('Inventory & Atomic Stock Reservation', () => {
    it('should successfully reserve stock when quantity is available', async () => {
      const res = await store.reserveVariantStock('var_1_camel_s', 2);
      expect(res.success).toBe(true);

      // Clean up reservation
      await store.releaseVariantStock('var_1_camel_s', 2);
    });

    it('should prevent overselling when requested quantity exceeds available stock', async () => {
      const res = await store.reserveVariantStock('var_1_camel_s', 9999);
      expect(res.success).toBe(false);
      expect(res.error).toContain('left in stock');
    });

    it('should permanently deduct stock upon order commitment', async () => {
      const prod = store.getProductById('prod_1')!;
      const variant = prod.variants.find((v) => v.id === 'var_1_camel_s')!;
      const initialStock = variant.stock;

      await store.reserveVariantStock('var_1_camel_s', 1);
      await store.commitVariantStockPurchase('var_1_camel_s', 1);

      expect(variant.stock).toBe(initialStock - 1);
    });
  });

  describe('Cart & Server-Side Pricing Recalculation', () => {
    it('should calculate accurate subtotal, tax, and complimentary shipping over $500', () => {
      // Add The Sovereignty Wool Trench ($890)
      const cart = store.addItemToCart('test_cart_1', 'prod_1', 'var_1_camel_s', 1);
      expect(cart.subtotal).toBe(890);
      expect(cart.shipping).toBe(0); // Free shipping over $500
      expect(cart.tax).toBeCloseTo(890 * 0.08, 1);
      expect(cart.total).toBe(cart.subtotal + cart.tax + cart.shipping);
    });

    it('should charge standard shipping for orders under $500', () => {
      // Add Artisan Studio Tote ($490)
      const cart = store.addItemToCart('test_cart_2', 'prod_4', 'var_4_cognac', 1);
      expect(cart.subtotal).toBe(490);
      expect(cart.shipping).toBe(25);
      expect(cart.total).toBe(cart.subtotal + cart.tax + 25);
    });
  });

  describe('Order State Transitions & Auditing', () => {
    it('should create order in PENDING state and update to PAID upon verification', () => {
      const order = store.createOrder({
        userId: 'usr_student_1',
        customerEmail: 'student@atelierofficial.com',
        customerName: 'Claire Chen',
        customerPhone: '+1 555-0199',
        shippingAddress: {
          id: 'addr_1',
          fullName: 'Claire Chen',
          street: '14 Fashion Ave',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA'
        },
        items: [
          {
            productId: 'prod_1',
            variantId: 'var_1_camel_s',
            name: 'The Sovereignty Double-Breasted Wool Trench',
            sku: 'AT-TRN-CAM-S',
            size: 'S',
            color: 'Bespoke Camel',
            quantity: 1,
            unitPrice: 890,
            imageUrl: ''
          }
        ],
        subtotal: 890,
        shippingCost: 0,
        tax: 71.2,
        total: 961.2,
        status: 'PENDING',
        paymentMethod: 'paystack'
      });

      expect(order.status).toBe('PENDING');
      expect(order.orderNumber).toMatch(/^AT-2026-\d{6}$/);

      const updated = store.updateOrderStatus(order.id, 'PAID', 'usr_admin_1', 'Verified payment via Paystack');
      expect(updated?.status).toBe('PAID');
      expect(updated?.timeline.length).toBe(2);
    });
  });

  describe('Tutoring Anti-Double-Booking Protection', () => {
    it('should successfully book an open slot for an instructor', async () => {
      const result = await store.createTutoringBooking({
        studentId: 'usr_student_1',
        instructorId: 'inst_1',
        date: '2026-11-10',
        startTime: '10:00',
        endTime: '11:00',
        topic: 'Bodice Sloper Dart Manipulation'
      });

      expect(result.success).toBe(true);
      expect(result.booking?.status).toBe('CONFIRMED');
    });

    it('should reject overlapping booking attempt for the same instructor at the same date/time', async () => {
      // First booking
      await store.createTutoringBooking({
        studentId: 'usr_student_1',
        instructorId: 'inst_2',
        date: '2026-11-12',
        startTime: '14:00',
        endTime: '15:00',
        topic: 'Savile Row Canvas Shaping'
      });

      // Attempting double booking
      const duplicate = await store.createTutoringBooking({
        studentId: 'usr_admin_1',
        instructorId: 'inst_2',
        date: '2026-11-12',
        startTime: '14:00',
        endTime: '15:00',
        topic: 'Trouser Balance Fitting'
      });

      expect(duplicate.success).toBe(false);
      expect(duplicate.error).toContain('already has a confirmed session at this time');
    });
  });

  describe('Academy Progress & Automatic Certificate Issuance', () => {
    it('should track lesson completion and issue verifiable certificate when 100% completed', () => {
      const courseId = 'course_bespoke_tailoring';
      const userId = 'usr_student_1';

      // Course has 1 lesson in seed: les_t1_1
      const progressResult = store.recordLessonProgress(userId, courseId, 'les_t1_1', true);

      expect(progressResult.enrollment.progressPercent).toBe(100);
      expect(progressResult.enrollment.isCompleted).toBe(true);
      expect(progressResult.certificate).toBeDefined();
      expect(progressResult.certificate?.certificateCode).toContain('CERT-2026-');

      // Verify certificate can be retrieved by anyone
      const verified = store.getCertificateByCode(progressResult.certificate!.certificateCode);
      expect(verified).toBeDefined();
      expect(verified?.studentName).toBe('Claire Chen');
    });
  });

  describe('Payment Provider Abstraction & Idempotency', () => {
    it('should idempotently handle payment finalization', async () => {
      const testRef = `ref_test_${Date.now()}`;
      const first = await paymentService.finalizePayment(testRef, {
        type: 'COURSE_ENROLLMENT',
        targetId: 'course_haute_couture_draping',
        userId: 'usr_student_1'
      });

      expect(first.success).toBe(true);

      // Calling again with the same reference should not duplicate action
      const second = await paymentService.finalizePayment(testRef, {
        type: 'COURSE_ENROLLMENT',
        targetId: 'course_haute_couture_draping',
        userId: 'usr_student_1'
      });

      expect(second.success).toBe(true);
      expect(second.message).toBe('Already processed');
    });
  });
});
