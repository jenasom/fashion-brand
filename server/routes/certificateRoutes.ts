import { requireOwner } from './authRoutes';
import { Router, Request, Response } from 'express';
import { store } from '../db/store';

export const certificateRouter = Router();

certificateRouter.get('/certificates/verify/:code', (req: Request, res: Response): void => {
  const { code } = req.params;
  const cert = store.getCertificateByCode(code);
  if (!cert) {
    res.status(404).json({ error: 'Certificate code invalid or not found in official registry' });
    return;
  }
  res.json({ certificate: cert });
});

certificateRouter.get('/certificates/user/:userId', requireOwner('userId'), (req: Request, res: Response): void => {
  const { userId } = req.params;
  const certificates = store.getUserCertificates(userId);
  res.json({ certificates });
});
