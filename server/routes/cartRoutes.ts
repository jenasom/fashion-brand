import { Router, Request, Response } from 'express';
import { store } from '../db/store';

export const cartRouter = Router();

cartRouter.get('/cart/:cartId', (req: Request, res: Response): void => {
  const { cartId } = req.params;
  const cart = store.getCart(cartId);
  res.json({ cart });
});

cartRouter.post('/cart/:cartId/items', async (req: Request, res: Response): Promise<void> => {
  const { cartId } = req.params;
  const { productId, variantId, quantity } = req.body;

  if (!productId || !variantId || !quantity) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  // Stock check
  const product = store.getProductById(productId);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) {
    res.status(404).json({ error: 'Variant not found' });
    return;
  }

  const available = variant.stock - variant.reservedStock;
  if (available < quantity) {
    res.status(400).json({ error: `Insufficient stock. Only ${available} available.` });
    return;
  }

  try {
    const cart = store.addItemToCart(cartId, productId, variantId, Number(quantity));
    res.json({ cart });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

cartRouter.patch('/cart/:cartId/items/:itemId', (req: Request, res: Response): void => {
  const { cartId, itemId } = req.params;
  const { quantity } = req.body;

  const cart = store.updateCartItem(cartId, itemId, Number(quantity));
  res.json({ cart });
});

cartRouter.delete('/cart/:cartId/items/:itemId', (req: Request, res: Response): void => {
  const { cartId, itemId } = req.params;
  const cart = store.removeCartItem(cartId, itemId);
  res.json({ cart });
});

cartRouter.post('/cart/:cartId/clear', (req: Request, res: Response): void => {
  const { cartId } = req.params;
  store.clearCart(cartId);
  res.json({ success: true });
});
