import { requireOwner } from './authRoutes';
import { Router, Request, Response } from 'express';
import { store } from '../db/store';

export const notificationRouter = Router();

notificationRouter.get('/notifications/:userId', requireOwner('userId'), (req: Request, res: Response): void => {
  const { userId } = req.params;
  const notifications = store.getUserNotifications(userId);
  res.json({ notifications });
});

notificationRouter.post('/notifications/:id/read', (req: Request, res: Response): void => {
  const { id } = req.params;
  store.markNotificationAsRead(id);
  res.json({ success: true });
});
