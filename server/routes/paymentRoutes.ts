import { Router, Request, Response } from 'express';
import { paymentService } from '../services/paymentService.js';

export const paymentRouter = Router();

paymentRouter.post('/payments/initialize', async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency, email, metadata, callbackUrl } = req.body;

    if (!amount || !email || !metadata || !metadata.type || !metadata.targetId) {
      res.status(400).json({ error: 'Missing required payment parameters' });
      return;
    }

    const reference = `pstk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const session = await paymentService.createPaymentSession({
      amount: Number(amount),
      currency: currency || 'USD',
      email,
      reference,
      metadata,
      callbackUrl
    });

    res.json(session);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

paymentRouter.post('/payments/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { reference, metadata } = req.body;

    if (!reference || !metadata) {
      res.status(400).json({ error: 'Reference and metadata are required' });
      return;
    }

    const result = await paymentService.finalizePayment(reference, metadata);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

paymentRouter.post('/payments/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    const webhookResult = await (paymentService as any).provider.handleWebhook(signature, req.body);

    if (webhookResult.handled && webhookResult.reference) {
      const payloadMeta = req.body?.data?.metadata;
      if (payloadMeta) {
        await paymentService.finalizePayment(webhookResult.reference, payloadMeta);
      }
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
