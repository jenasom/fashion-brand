import express from 'express';
import { authRouter } from './routes/authRoutes';
import { productRouter } from './routes/productRoutes';
import { cartRouter } from './routes/cartRoutes';
import { orderRouter } from './routes/orderRoutes';
import { paymentRouter } from './routes/paymentRoutes';
import { academyRouter } from './routes/academyRoutes';
import { tutoringRouter } from './routes/tutoringRoutes';
import { certificateRouter } from './routes/certificateRoutes';
import { adminRouter } from './routes/adminRoutes';
import { notificationRouter } from './routes/notificationRoutes';


export function createApiApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', authRouter);
  app.use('/api', productRouter);
  app.use('/api', cartRouter);
  app.use('/api', orderRouter);
  app.use('/api', paymentRouter);
  app.use('/api', academyRouter);
  app.use('/api', tutoringRouter);
  app.use('/api', certificateRouter);
  app.use('/api', adminRouter);
  app.use('/api', notificationRouter);


  app.get('/api/health', (_req, res) => res.json({ status: 'healthy', platform: 'ATELIER & ACADEMIE' }));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
  return app;
}
