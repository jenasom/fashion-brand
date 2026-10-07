import {
  User,
  Category,
  Collection,
  Product,
  ProductVariant,
  Cart,
  CartItem,
  Order,
  OrderStatus,
  Course,
  Enrollment,
  LessonProgress,
  Instructor,
  ClassSession,
  TutoringBooking,
  Certificate,
  Review,
  Notification,
  AuditLog
} from '../../src/types/index';
import {
  SEED_USERS,
  SEED_CATEGORIES,
  SEED_COLLECTIONS,
  SEED_PRODUCTS,
  SEED_INSTRUCTORS,
  SEED_COURSES,
  SEED_CLASSES,
  SEED_CERTIFICATES,
  SEED_REVIEWS
} from './seedData';

class Store {
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private collections: Map<string, Collection> = new Map();
  private products: Map<string, Product> = new Map();
  private carts: Map<string, Cart> = new Map();
  private orders: Map<string, Order> = new Map();
  private courses: Map<string, Course> = new Map();
  private enrollments: Map<string, Enrollment> = new Map();
  private lessonProgress: Map<string, LessonProgress> = new Map(); // key: `${userId}_${lessonId}`
  private instructors: Map<string, Instructor> = new Map();
  private classes: Map<string, ClassSession> = new Map();
  private bookings: Map<string, TutoringBooking> = new Map();
  private certificates: Map<string, Certificate> = new Map();
  private reviews: Review[] = [];
  private notifications: Notification[] = [];
  private auditLogs: AuditLog[] = [];

  // Mutex lock for concurrency-safe booking and inventory
  private lock = Promise.resolve();

  constructor() {
    this.seed();
  }

  private seed() {
    SEED_USERS.forEach((u) => this.users.set(u.id, { ...u }));
    SEED_CATEGORIES.forEach((c) => this.categories.set(c.id, { ...c }));
    SEED_COLLECTIONS.forEach((c) => this.collections.set(c.id, { ...c }));
    SEED_PRODUCTS.forEach((p) => this.products.set(p.id, JSON.parse(JSON.stringify(p))));
    SEED_INSTRUCTORS.forEach((i) => this.instructors.set(i.id, { ...i }));
    SEED_COURSES.forEach((c) => this.courses.set(c.id, JSON.parse(JSON.stringify(c))));
    SEED_CLASSES.forEach((c) => this.classes.set(c.id, JSON.parse(JSON.stringify(c))));
    SEED_CERTIFICATES.forEach((c) => this.certificates.set(c.certificateCode, { ...c }));
    this.reviews = [...SEED_REVIEWS];

    // Seed default student enrollment
    const studentEnrollment: Enrollment = {
      id: 'enr_student_1',
      userId: 'usr_student_1',
      courseId: 'course_pattern_drafting',
      courseTitle: 'Architectural Pattern Drafting & Bespoke Fit',
      courseThumbnail: '/assets/garments/geometric-maze-maxi.jpg',
      enrolledAt: '2026-02-15T09:00:00Z',
      progressPercent: 100,
      isCompleted: true,
      completedAt: '2026-03-15T10:00:00Z',
      certificateId: 'CERT-2026-ATELIER-01',
      lastLessonId: 'les_2_2'
    };
    this.enrollments.set(`${studentEnrollment.userId}_${studentEnrollment.courseId}`, studentEnrollment);

    // Initial audit log
    this.auditLogs.push({
      id: 'log_seed',
      actorId: 'usr_admin_1',
      actorName: 'Elena Rostova (System)',
      action: 'INITIALIZE_ECOSYSTEM',
      entityType: 'PRODUCT',
      entityId: 'SYSTEM',
      changes: { status: 'Atelier ready' },
      timestamp: new Date().toISOString()
    });
  }

  // --- USERS & AUTH ---
  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  // --- CATALOG (PRODUCTS, CATEGORIES, COLLECTIONS) ---
  getAllProducts(options?: { categoryId?: string; collectionId?: string; search?: string; sort?: string }): Product[] {
    let list = Array.from(this.products.values()).filter((p) => p.isPublished);

    if (options?.categoryId) {
      list = list.filter((p) => p.categoryId === options.categoryId);
    }
    if (options?.collectionId) {
      list = list.filter((p) => p.collectionId === options.collectionId);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q));
    }
    if (options?.sort) {
      if (options.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      if (options.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      if (options.sort === 'rating') list.sort((a, b) => b.averageRating - a.averageRating);
      if (options.sort === 'newest') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }

  getAllProductsAdmin(): Product[] {
    return Array.from(this.products.values());
  }

  getProductById(id: string): Product | undefined {
    return this.products.get(id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return Array.from(this.products.values()).find((p) => p.slug === slug);
  }

  saveProduct(product: Product): Product {
    this.products.set(product.id, product);
    return product;
  }

  deleteProduct(id: string): boolean {
    return this.products.delete(id);
  }

  getCategories(): Category[] {
    return Array.from(this.categories.values());
  }

  getCollections(): Collection[] {
    return Array.from(this.collections.values());
  }

  // --- INVENTORY MANAGEMENT & CONCURRENCY ---
  async reserveVariantStock(variantId: string, quantity: number): Promise<{ success: boolean; error?: string }> {
    for (const prod of this.products.values()) {
      const variant = prod.variants.find((v) => v.id === variantId);
      if (variant) {
        const available = variant.stock - variant.reservedStock;
        if (available < quantity) {
          return { success: false, error: `Only ${available} item(s) left in stock for ${variant.title}` };
        }
        variant.reservedStock += quantity;
        return { success: true };
      }
    }
    return { success: false, error: 'Product variant not found' };
  }

  async releaseVariantStock(variantId: string, quantity: number): Promise<void> {
    for (const prod of this.products.values()) {
      const variant = prod.variants.find((v) => v.id === variantId);
      if (variant) {
        variant.reservedStock = Math.max(0, variant.reservedStock - quantity);
        return;
      }
    }
  }

  async commitVariantStockPurchase(variantId: string, quantity: number): Promise<void> {
    for (const prod of this.products.values()) {
      const variant = prod.variants.find((v) => v.id === variantId);
      if (variant) {
        variant.reservedStock = Math.max(0, variant.reservedStock - quantity);
        variant.stock = Math.max(0, variant.stock - quantity);
        return;
      }
    }
  }

  updateVariantStock(productId: string, variantId: string, newStock: number): ProductVariant | undefined {
    const product = this.products.get(productId);
    if (!product) return undefined;
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return undefined;
    variant.stock = newStock;
    return variant;
  }

  // --- CARTS ---
  getCart(cartId: string): Cart {
    let cart = this.carts.get(cartId);
    if (!cart) {
      cart = {
        id: cartId,
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0
      };
      this.carts.set(cartId, cart);
    }
    this.recalculateCart(cart);
    return cart;
  }

  private recalculateCart(cart: Cart) {
    let subtotal = 0;
    cart.items.forEach((item) => {
      // Re-verify unit price from server state
      const product = this.products.get(item.productId);
      if (product) {
        item.product.price = product.price;
        item.variant.price = product.price;
      }
      subtotal += item.variant.price * item.quantity;
    });

    cart.subtotal = subtotal;
    cart.tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    cart.shipping = subtotal > 500 || subtotal === 0 ? 0 : 25; // Complimentary over $500
    cart.total = Math.round((cart.subtotal + cart.tax + cart.shipping) * 100) / 100;
  }

  addItemToCart(cartId: string, productId: string, variantId: string, quantity: number): Cart {
    const cart = this.getCart(cartId);
    const product = this.products.get(productId);
    if (!product) throw new Error('Product not found');
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) throw new Error('Variant not found');

    const existingIndex = cart.items.findIndex((i) => i.variantId === variantId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: `ci_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId,
        variantId,
        product: {
          name: product.name,
          slug: product.slug,
          image: product.images[0] || '',
          price: product.price
        },
        variant: {
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          price: variant.price
        },
        quantity
      });
    }
    this.recalculateCart(cart);
    return cart;
  }

  updateCartItem(cartId: string, itemId: string, quantity: number): Cart {
    const cart = this.getCart(cartId);
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else {
      const item = cart.items.find((i) => i.id === itemId);
      if (item) item.quantity = quantity;
    }
    this.recalculateCart(cart);
    return cart;
  }

  removeCartItem(cartId: string, itemId: string): Cart {
    const cart = this.getCart(cartId);
    cart.items = cart.items.filter((i) => i.id !== itemId);
    this.recalculateCart(cart);
    return cart;
  }

  clearCart(cartId: string): void {
    const cart = this.carts.get(cartId);
    if (cart) {
      cart.items = [];
      this.recalculateCart(cart);
    }
  }

  // --- ORDERS ---
  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'timeline' | 'createdAt'>): Order {
    const id = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const orderNumber = `AT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      timeline: [
        {
          status: orderData.status,
          note: 'Order created and registered in atelier ledger.',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    this.orders.set(id, newOrder);

    this.logAudit({
      actorId: orderData.userId || 'guest',
      actorName: orderData.customerName,
      action: 'ORDER_CREATED',
      entityType: 'ORDER',
      entityId: id,
      changes: { orderNumber, total: orderData.total, status: orderData.status }
    });

    return newOrder;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  getOrdersByUser(userId: string): Order[] {
    return Array.from(this.orders.values()).filter((o) => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllOrdersAdmin(): Order[] {
    return Array.from(this.orders.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus, actorId: string, note?: string): Order | undefined {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    const oldStatus = order.status;
    order.status = newStatus;
    order.timeline.push({
      status: newStatus,
      note: note || `Status updated from ${oldStatus} to ${newStatus}`,
      timestamp: new Date().toISOString()
    });

    this.logAudit({
      actorId,
      actorName: 'Admin / Fulfillment',
      action: 'ORDER_STATUS_UPDATED',
      entityType: 'ORDER',
      entityId: orderId,
      changes: { from: oldStatus, to: newStatus, note }
    });

    return order;
  }

  // --- ACADEMY & COURSES ---
  getAllCourses(): Course[] {
    return Array.from(this.courses.values()).filter((c) => c.isPublished);
  }

  getAllCoursesAdmin(): Course[] {
    return Array.from(this.courses.values());
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.get(id);
  }

  getCourseBySlug(slug: string): Course | undefined {
    return Array.from(this.courses.values()).find((c) => c.slug === slug);
  }

  saveCourse(course: Course): Course {
    this.courses.set(course.id, course);
    return course;
  }

  // Enrollments
  getEnrollment(userId: string, courseId: string): Enrollment | undefined {
    return this.enrollments.get(`${userId}_${courseId}`);
  }

  getUserEnrollments(userId: string): Enrollment[] {
    return Array.from(this.enrollments.values()).filter((e) => e.userId === userId);
  }

  enrollUser(userId: string, courseId: string): Enrollment {
    const key = `${userId}_${courseId}`;
    const existing = this.enrollments.get(key);
    if (existing) return existing;

    const course = this.courses.get(courseId);
    if (!course) throw new Error('Course not found');

    const enrollment: Enrollment = {
      id: `enr_${Date.now()}`,
      userId,
      courseId,
      courseTitle: course.title,
      courseThumbnail: course.thumbnail,
      enrolledAt: new Date().toISOString(),
      progressPercent: 0,
      isCompleted: false,
      lastLessonId: course.modules[0]?.lessons[0]?.id
    };

    this.enrollments.set(key, enrollment);
    course.enrolledCount += 1;

    // Send notification
    this.createNotification({
      userId,
      type: 'ENROLLMENT',
      title: 'Academy Enrollment Confirmed',
      message: `You are officially enrolled in "${course.title}". Welcome to the atelier!`,
      link: `/student/courses/${course.id}`
    });

    return enrollment;
  }

  recordLessonProgress(userId: string, courseId: string, lessonId: string, isCompleted: boolean): { enrollment: Enrollment; certificate?: Certificate } {
    const course = this.courses.get(courseId);
    if (!course) throw new Error('Course not found');

    const enrollmentKey = `${userId}_${courseId}`;
    let enrollment = this.enrollments.get(enrollmentKey);
    if (!enrollment) {
      enrollment = this.enrollUser(userId, courseId);
    }

    const progressKey = `${userId}_${lessonId}`;
    this.lessonProgress.set(progressKey, {
      id: `lp_${Date.now()}`,
      userId,
      courseId,
      lessonId,
      isCompleted,
      completedAt: new Date().toISOString()
    });

    enrollment.lastLessonId = lessonId;

    // Calculate total lessons and completed count
    let totalLessons = 0;
    let completedLessons = 0;
    course.modules.forEach((mod) => {
      mod.lessons.forEach((les) => {
        totalLessons += 1;
        const prog = this.lessonProgress.get(`${userId}_${les.id}`);
        if (prog?.isCompleted) completedLessons += 1;
      });
    });

    enrollment.progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    let cert: Certificate | undefined = undefined;
    if (enrollment.progressPercent >= 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date().toISOString();

      // Mint verifiable certificate
      const user = this.getUserById(userId);
      const certCode = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      cert = {
        id: `cert_${Date.now()}`,
        certificateCode: certCode,
        userId,
        studentName: user ? user.name : 'Atelier Student',
        courseId,
        courseTitle: course.title,
        instructorName: course.instructorName,
        instructorTitle: 'Master Instructor & Fellow',
        issueDate: new Date().toISOString().split('T')[0],
        grade: 'Distinction',
        verificationUrl: `/certificates/${certCode}`
      };
      this.certificates.set(certCode, cert);
      enrollment.certificateId = certCode;

      this.createNotification({
        userId,
        type: 'CERTIFICATE',
        title: 'Masterclass Certificate Issued!',
        message: `Congratulations! You have completed "${course.title}". Your official credential is ready.`,
        link: `/certificates/${certCode}`
      });
    }

    return { enrollment, certificate: cert };
  }

  isLessonCompleted(userId: string, lessonId: string): boolean {
    return !!this.lessonProgress.get(`${userId}_${lessonId}`)?.isCompleted;
  }

  // --- CLASSES ---
  getUpcomingClasses(): ClassSession[] {
    return Array.from(this.classes.values()).filter((c) => c.status === 'SCHEDULED').sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime());
  }

  getClassById(id: string): ClassSession | undefined {
    return this.classes.get(id);
  }

  saveClass(session: ClassSession): ClassSession {
    this.classes.set(session.id, session);
    return session;
  }

  registerForClass(userId: string, classId: string): { success: boolean; error?: string; session?: ClassSession } {
    const session = this.classes.get(classId);
    if (!session) return { success: false, error: 'Class not found' };
    if (session.enrolledUserIds.includes(userId)) return { success: true, session };
    if (session.enrolledCount >= session.capacity) return { success: false, error: 'Class is at maximum capacity' };

    session.enrolledUserIds.push(userId);
    session.enrolledCount += 1;

    this.createNotification({
      userId,
      type: 'CLASS',
      title: 'Class Seat Reserved',
      message: `You are booked for "${session.title}" on ${session.date} at ${session.startTime}.`,
      link: '/student'
    });

    return { success: true, session };
  }

  // --- TUTORING & MENTORSHIP ---
  getInstructors(): Instructor[] {
    return Array.from(this.instructors.values());
  }

  getInstructorById(id: string): Instructor | undefined {
    return this.instructors.get(id);
  }

  getBookings(): TutoringBooking[] {
    return Array.from(this.bookings.values()).sort((a, b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime());
  }

  getBookingsByStudent(studentId: string): TutoringBooking[] {
    return Array.from(this.bookings.values()).filter((b) => b.studentId === studentId);
  }

  getBookingsByInstructor(instructorId: string): TutoringBooking[] {
    return Array.from(this.bookings.values()).filter((b) => b.instructorId === instructorId);
  }

  // Atomic conflict-free booking check
  async createTutoringBooking(params: {
    studentId: string;
    instructorId: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
    notes?: string;
  }): Promise<{ success: boolean; booking?: TutoringBooking; error?: string }> {
    // Acquire mutex lock
    let releaseLock: () => void = () => {};
    const waitLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    const prevLock = this.lock;
    this.lock = this.lock.then(() => waitLock);
    await prevLock;

    try {
      const instructor = this.instructors.get(params.instructorId);
      if (!instructor) return { success: false, error: 'Instructor not found' };

      const student = this.getUserById(params.studentId);
      if (!student) return { success: false, error: 'Student not found' };

      // Double-booking collision check
      const collision = Array.from(this.bookings.values()).find((b) => {
        return (
          b.instructorId === params.instructorId &&
          b.date === params.date &&
          b.status === 'CONFIRMED' &&
          !(b.endTime <= params.startTime || b.startTime >= params.endTime)
        );
      });

      if (collision) {
        return {
          success: false,
          error: `Madame / Monsieur ${instructor.name} already has a confirmed session at this time. Please select another slot.`
        };
      }

      const bookingId = `book_${Date.now()}`;
      const newBooking: TutoringBooking = {
        id: bookingId,
        studentId: params.studentId,
        studentName: student.name,
        studentEmail: student.email,
        instructorId: params.instructorId,
        instructorName: instructor.name,
        date: params.date,
        startTime: params.startTime,
        endTime: params.endTime,
        durationMinutes: 60,
        topic: params.topic,
        notes: params.notes,
        price: instructor.hourlyRate,
        meetingUrl: 'https://meet.google.com/ate-mentor-live',
        status: 'CONFIRMED',
        createdAt: new Date().toISOString()
      };

      this.bookings.set(bookingId, newBooking);

      this.createNotification({
        userId: params.studentId,
        type: 'TUTORING',
        title: 'Mentorship Confirmed',
        message: `Your session with ${instructor.name} on ${params.date} at ${params.startTime} is confirmed.`,
        link: '/student'
      });

      this.logAudit({
        actorId: params.studentId,
        actorName: student.name,
        action: 'TUTORING_BOOKED',
        entityType: 'BOOKING',
        entityId: bookingId,
        changes: { instructor: instructor.name, date: params.date, slot: params.startTime }
      });

      return { success: true, booking: newBooking };
    } finally {
      releaseLock();
    }
  }

  // --- CERTIFICATES ---
  getCertificateByCode(code: string): Certificate | undefined {
    return this.certificates.get(code.toUpperCase());
  }

  getUserCertificates(userId: string): Certificate[] {
    return Array.from(this.certificates.values()).filter((c) => c.userId === userId);
  }

  // --- REVIEWS ---
  getReviewsByProduct(productId: string): Review[] {
    return this.reviews.filter((r) => r.productId === productId);
  }

  getReviewsByCourse(courseId: string): Review[] {
    return this.reviews.filter((r) => r.courseId === courseId);
  }

  addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const newRev: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.reviews.push(newRev);
    return newRev;
  }

  // --- NOTIFICATIONS ---
  createNotification(data: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Notification {
    const notif: Notification = {
      ...data,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    return notif;
  }

  getUserNotifications(userId: string): Notification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  markNotificationAsRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.isRead = true;
  }

  // --- AUDIT LOGS ---
  logAudit(data: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const log: AuditLog = {
      ...data,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
  }

  getAuditLogs(): AuditLog[] {
    return this.auditLogs.slice(0, 100);
  }

  // --- ADMIN METRICS ---
  getAdminMetrics() {
    const orders = Array.from(this.orders.values());
    const totalRevenue = orders.reduce((sum, o) => (o.status !== 'CANCELLED' && o.status !== 'REFUNDED' ? sum + o.total : sum), 0);
    const totalOrders = orders.length;

    let lowStockCount = 0;
    this.products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.stock - v.reservedStock <= 4) lowStockCount += 1;
      });
    });

    const totalStudents = Array.from(this.users.values()).filter((u) => u.roles.includes('STUDENT')).length;
    const totalEnrollments = this.enrollments.size;
    const upcomingClassesCount = this.getUpcomingClasses().length;
    const activeBookingsCount = this.getBookings().filter((b) => b.status === 'CONFIRMED').length;

    return {
      totalRevenue,
      totalOrders,
      lowStockCount,
      totalStudents,
      totalEnrollments,
      upcomingClassesCount,
      activeBookingsCount,
      recentOrders: orders.slice(0, 5)
    };
  }
}

export const store = new Store();
