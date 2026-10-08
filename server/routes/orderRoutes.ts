import { requireOwner } from './authRoutes.js';
import { Router, Request, Response } from 'express';
import { requireRole, sessionUser } from './authRoutes.js';
import { store } from '../db/store.js';
import { OrderStatus } from '../../src/types/index.js';

export const orderRouter = Router();

orderRouter.post('/orders', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userId,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      cartId,
      paymentMethod
    } = req.body;

    if (!customerEmail || !customerName || !shippingAddress || !cartId) {
      res.status(400).json({ error: 'Missing mandatory checkout information' });
      return;
    }

    const cart = store.getCart(cartId);
    if (!cart.items || cart.items.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return;
    }

    // Step 1: Atomically reserve stock for each variant
    for (const item of cart.items) {
      const reservation = await store.reserveVariantStock(item.variantId, item.quantity);
      if (!reservation.success) {
        res.status(400).json({ error: reservation.error });
        return;
      }
    }

    // Step 2: Create Order
    const orderItems = cart.items.map((i) => ({
      productId: i.productId,
      variantId: i.variantId,
      name: i.product.name,
      sku: i.variant.sku,
      size: i.variant.size,
      color: i.variant.color,
      quantity: i.quantity,
      unitPrice: i.variant.price,
      imageUrl: i.product.image
    }));

    const order = store.createOrder({
      userId,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      items: orderItems,
      subtotal: cart.subtotal,
      shippingCost: cart.shipping,
      tax: cart.tax,
      total: cart.total,
      status: 'PENDING',
      paymentMethod: paymentMethod || 'paystack'
    });

    // Clear cart after creating order
    store.clearCart(cartId);

    res.json({ order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

orderRouter.get('/orders/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const order = store.getOrderById(id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  const viewer = sessionUser(req);
  if (!viewer) { res.status(401).json({ error: 'Please sign in.' }); return; }
  if (order.userId !== viewer.id && !viewer.roles.includes('ADMIN')) { res.status(403).json({ error: 'This order belongs to another account.' }); return; }
  res.json({ order });
});

orderRouter.get('/orders/user/:userId', requireOwner('userId'), (req: Request, res: Response): void => {
  const { userId } = req.params;
  const orders = store.getOrdersByUser(userId);
  res.json({ orders });
});

orderRouter.patch('/orders/:id/status', requireRole('ADMIN'), (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status, note, actorId } = req.body;

  if (!['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
    res.status(400).json({ error: 'Status is required' });
    return;
  }

  const updated = store.updateOrderStatus(id, status as OrderStatus, sessionUser(req)!.id, note);
  if (!updated) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.json({ order: updated });
});
