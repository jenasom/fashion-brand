import {
  User,
  Product,
  Category,
  Collection,
  Cart,
  Order,
  Course,
  Enrollment,
  ClassSession,
  Instructor,
  TutoringBooking,
  Certificate,
  Notification,
  AuditLog
} from '../types/index';

const API_BASE = '/api';
export const sessionToken = { get: () => sessionStorage.getItem('atelier_session'), set: (token: string) => sessionStorage.setItem('atelier_session', token), clear: () => sessionStorage.removeItem('atelier_session') };
async function request(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  const token = sessionToken.get();
  if (token) headers.set('Authorization', 'Bearer ' + token);
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.error || (response.status === 404 ? 'The login service is unavailable on this deployment. Please try again after the deployment finishes.' : 'The request failed (HTTP ' + response.status + '). Please try again.')); }
  return response;
}

export const api = {
  async logout() { await request(API_BASE + '/logout', { method: 'POST' }); sessionToken.clear(); },
  async getDashboard(role: string): Promise<import('../types/index').DashboardData> { return (await request(API_BASE + '/dashboard/' + role)).json(); },
  async updateTeachingClass(id: string, status: 'COMPLETED' | 'CANCELLED') { return (await request(API_BASE + '/dashboard/classes/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })).json(); },
  // Auth & User
  async getCurrentUser(token?: string): Promise<{ user: User }> {
    const res = await request(`${API_BASE}/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.json();
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await request(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async switchPersona(userId: string): Promise<{ user: User; token: string }> {
    const res = await request(`${API_BASE}/switch-persona`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Products & Catalog
  async getProducts(params?: { categoryId?: string; collectionId?: string; search?: string; sort?: string }): Promise<{ products: Product[] }> {
    const query = new URLSearchParams();
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    if (params?.collectionId) query.set('collectionId', params.collectionId);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);

    const res = await request(`${API_BASE}/products?${query.toString()}`);
    return res.json();
  },

  async getProductBySlug(slug: string): Promise<{ product: Product; reviews: any[] }> {
    const res = await request(`${API_BASE}/products/${slug}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    const res = await request(`${API_BASE}/categories`);
    return res.json();
  },

  async getCollections(): Promise<{ collections: Collection[] }> {
    const res = await request(`${API_BASE}/collections`);
    return res.json();
  },

  // Cart
  async getCart(cartId: string): Promise<{ cart: Cart }> {
    const res = await request(`${API_BASE}/cart/${cartId}`);
    return res.json();
  },

  async addToCart(cartId: string, productId: string, variantId: string, quantity: number): Promise<{ cart: Cart }> {
    const res = await request(`${API_BASE}/cart/${cartId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, variantId, quantity })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add item to cart');
    return data;
  },

  async updateCartItem(cartId: string, itemId: string, quantity: number): Promise<{ cart: Cart }> {
    const res = await request(`${API_BASE}/cart/${cartId}/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return res.json();
  },

  async removeCartItem(cartId: string, itemId: string): Promise<{ cart: Cart }> {
    const res = await request(`${API_BASE}/cart/${cartId}/items/${itemId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Orders & Checkout
  async createOrder(payload: any): Promise<{ order: Order }> {
    const res = await request(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Checkout failed');
    return data;
  },

  async getOrder(orderId: string): Promise<{ order: Order }> {
    const res = await request(`${API_BASE}/orders/${orderId}`);
    return res.json();
  },

  async getUserOrders(userId: string): Promise<{ orders: Order[] }> {
    const res = await request(`${API_BASE}/orders/user/${userId}`);
    return res.json();
  },

  // Payments
  async initializePayment(payload: { amount: number; email: string; metadata: any }): Promise<{ authorizationUrl: string; reference: string }> {
    const res = await request(`${API_BASE}/payments/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async verifyPayment(reference: string, metadata: any): Promise<any> {
    const res = await request(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, metadata })
    });
    return res.json();
  },

  // Academy
  async getCourses(): Promise<{ courses: Course[] }> {
    const res = await request(`${API_BASE}/academy/courses`);
    return res.json();
  },

  async getCourseBySlug(slug: string): Promise<{ course: Course; reviews: any[] }> {
    const res = await request(`${API_BASE}/academy/courses/${slug}`);
    return res.json();
  },

  async getUserEnrollments(userId: string): Promise<{ enrollments: Enrollment[] }> {
    const res = await request(`${API_BASE}/academy/student/enrollments/${userId}`);
    return res.json();
  },

  async getCourseProgress(courseId: string, userId: string): Promise<{ course: Course; enrollment: Enrollment; lessonProgress: Record<string, boolean> }> {
    const res = await request(`${API_BASE}/academy/student/courses/${courseId}/progress/${userId}`);
    return res.json();
  },

  async markLessonProgress(lessonId: string, userId: string, courseId: string, isCompleted: boolean): Promise<{ enrollment: Enrollment; certificate?: Certificate }> {
    const res = await request(`${API_BASE}/academy/student/lessons/${lessonId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId, isCompleted })
    });
    return res.json();
  },

  async enrollInCourse(courseId: string, userId: string): Promise<{ enrollment: Enrollment }> {
    const res = await request(`${API_BASE}/academy/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  async getClasses(): Promise<{ classes: ClassSession[] }> {
    const res = await request(`${API_BASE}/academy/classes`);
    return res.json();
  },

  async registerForClass(classId: string, userId: string): Promise<{ success: boolean; session?: ClassSession }> {
    const res = await request(`${API_BASE}/academy/classes/${classId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Tutoring
  async getInstructors(): Promise<{ instructors: Instructor[] }> {
    const res = await request(`${API_BASE}/tutoring/instructors`);
    return res.json();
  },

  async getStudentBookings(studentId: string): Promise<{ bookings: TutoringBooking[] }> {
    const res = await request(`${API_BASE}/tutoring/bookings/student/${studentId}`);
    return res.json();
  },

  async bookTutoring(payload: { studentId: string; instructorId: string; date: string; startTime: string; endTime: string; topic: string; notes?: string }): Promise<{ booking: TutoringBooking }> {
    const res = await request(`${API_BASE}/tutoring/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to book slot');
    return data;
  },

  // Certificates
  async verifyCertificate(code: string): Promise<{ certificate: Certificate }> {
    const res = await request(`${API_BASE}/certificates/verify/${code}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid certificate');
    return data;
  },

  async getUserCertificates(userId: string): Promise<{ certificates: Certificate[] }> {
    const res = await request(`${API_BASE}/certificates/user/${userId}`);
    return res.json();
  },

  // Notifications
  async getNotifications(userId: string): Promise<{ notifications: Notification[] }> {
    const res = await request(`${API_BASE}/notifications/${userId}`);
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await request(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
  },

  // Admin
  async getAdminMetrics(): Promise<{ metrics: any }> {
    const res = await request(`${API_BASE}/admin/metrics`);
    return res.json();
  },

  async getAdminProducts(): Promise<{ products: Product[] }> {
    const res = await request(`${API_BASE}/admin/products`);
    return res.json();
  },

  async createAdminProduct(product: Partial<Product>): Promise<{ product: Product }> {
    const res = await request(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return res.json();
  },

  async updateAdminProduct(id: string, updates: Partial<Product>): Promise<{ product: Product }> {
    const res = await request(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteAdminProduct(id: string): Promise<{ success: boolean }> {
    const res = await request(`${API_BASE}/admin/products/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async updateInventoryStock(productId: string, variantId: string, stock: number): Promise<any> {
    const res = await request(`${API_BASE}/admin/inventory`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, variantId, stock })
    });
    return res.json();
  },

  async updateOrderStatus(orderId: string, status: string, note?: string): Promise<{ order: Order }> {
    const res = await request(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note })
    });
    return res.json();
  },

  async getAdminOrders(): Promise<{ orders: Order[] }> {
    const res = await request(`${API_BASE}/admin/orders`);
    return res.json();
  },

  async getAdminAuditLogs(): Promise<{ logs: AuditLog[] }> {
    const res = await request(`${API_BASE}/admin/audit-logs`);
    return res.json();
  }
};
