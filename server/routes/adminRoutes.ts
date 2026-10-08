import { Router, Request, Response } from 'express';
import { requireRole } from './authRoutes.js';
import { store } from '../db/store.js';
import { Product, Course, ClassSession } from '../../src/types/index.js';

export const adminRouter = Router();

// Middleware: ensure caller is authorized
adminRouter.use('/admin', requireRole('ADMIN'));

adminRouter.get('/admin/metrics', (_req: Request, res: Response): void => {
  const metrics = store.getAdminMetrics();
  res.json({ metrics });
});

// Products CRUD
adminRouter.get('/admin/products', (_req: Request, res: Response): void => {
  const products = store.getAllProductsAdmin();
  res.json({ products });
});

adminRouter.post('/admin/products', (req: Request, res: Response): void => {
  const productData = req.body as Product;
  if (!productData.name || !productData.price) {
    res.status(400).json({ error: 'Name and price are required' });
    return;
  }

  const id = `prod_${Date.now()}`;
  const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const newProduct: Product = {
    ...productData,
    id,
    slug,
    createdAt: new Date().toISOString()
  };

  store.saveProduct(newProduct);
  store.logAudit({
    actorId: 'usr_admin_1',
    actorName: 'Admin',
    action: 'PRODUCT_CREATED',
    entityType: 'PRODUCT',
    entityId: id,
    changes: { name: newProduct.name, price: newProduct.price }
  });

  res.json({ product: newProduct });
});

adminRouter.put('/admin/products/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const existing = store.getProductById(id);
  if (!existing) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const updated: Product = {
    ...existing,
    ...req.body,
    id
  };

  store.saveProduct(updated);
  store.logAudit({
    actorId: 'usr_admin_1',
    actorName: 'Admin',
    action: 'PRODUCT_UPDATED',
    entityType: 'PRODUCT',
    entityId: id,
    changes: req.body
  });

  res.json({ product: updated });
});

adminRouter.delete('/admin/products/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const deleted = store.deleteProduct(id);
  if (!deleted) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  store.logAudit({
    actorId: 'usr_admin_1',
    actorName: 'Admin',
    action: 'PRODUCT_DELETED',
    entityType: 'PRODUCT',
    entityId: id,
    changes: { deleted: true }
  });

  res.json({ success: true });
});

// Quick Stock Adjustment
adminRouter.patch('/admin/inventory', (req: Request, res: Response): void => {
  const { productId, variantId, stock } = req.body;
  if (!productId || !variantId || stock === undefined) {
    res.status(400).json({ error: 'Missing parameters' });
    return;
  }

  const variant = store.updateVariantStock(productId, variantId, Number(stock));
  if (!variant) {
    res.status(404).json({ error: 'Product or variant not found' });
    return;
  }

  store.logAudit({
    actorId: 'usr_admin_1',
    actorName: 'Admin',
    action: 'INVENTORY_ADJUSTED',
    entityType: 'INVENTORY',
    entityId: variantId,
    changes: { newStock: stock }
  });

  res.json({ variant });
});

// Orders
adminRouter.get('/admin/orders', (_req: Request, res: Response): void => {
  const orders = store.getAllOrdersAdmin();
  res.json({ orders });
});

// Courses
adminRouter.get('/admin/courses', (_req: Request, res: Response): void => {
  const courses = store.getAllCoursesAdmin();
  res.json({ courses });
});

adminRouter.post('/admin/courses', (req: Request, res: Response): void => {
  const courseData = req.body as Course;
  const id = `course_${Date.now()}`;
  const newCourse: Course = {
    ...courseData,
    id,
    slug: courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    modules: courseData.modules || [],
    enrolledCount: 0,
    rating: 5.0
  };

  store.saveCourse(newCourse);
  res.json({ course: newCourse });
});

// Classes
adminRouter.get('/admin/classes', (_req: Request, res: Response): void => {
  const classes = store.getUpcomingClasses();
  res.json({ classes });
});

adminRouter.post('/admin/classes', (req: Request, res: Response): void => {
  const classData = req.body as ClassSession;
  const id = `class_${Date.now()}`;
  const newClass: ClassSession = {
    ...classData,
    id,
    enrolledCount: 0,
    enrolledUserIds: []
  };

  store.saveClass(newClass);
  res.json({ session: newClass });
});

// Audit Logs
adminRouter.get('/admin/audit-logs', (_req: Request, res: Response): void => {
  const logs = store.getAuditLogs();
  res.json({ logs });
});
