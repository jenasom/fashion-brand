import { Router, Request, Response } from 'express';
import { store } from '../db/store.js';

export const productRouter = Router();

productRouter.get('/products', (req: Request, res: Response): void => {
  const { categoryId, collectionId, search, sort } = req.query;
  const products = store.getAllProducts({
    categoryId: categoryId as string,
    collectionId: collectionId as string,
    search: search as string,
    sort: sort as string
  });
  res.json({ products });
});

productRouter.get('/products/:slug', (req: Request, res: Response): void => {
  const { slug } = req.params;
  const product = store.getProductBySlug(slug);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const reviews = store.getReviewsByProduct(product.id);
  res.json({ product, reviews });
});

productRouter.get('/categories', (_req: Request, res: Response): void => {
  const categories = store.getCategories();
  res.json({ categories });
});

productRouter.get('/collections', (_req: Request, res: Response): void => {
  const collections = store.getCollections();
  res.json({ collections });
});

productRouter.get('/collections/:slug', (req: Request, res: Response): void => {
  const { slug } = req.params;
  const collection = store.getCollections().find((c) => c.slug === slug);
  if (!collection) {
    res.status(404).json({ error: 'Collection not found' });
    return;
  }
  const products = store.getAllProducts({ collectionId: collection.id });
  res.json({ collection, products });
});

productRouter.post('/products/:id/reviews', (req: Request, res: Response): void => {
  const { id } = req.params;
  const { userId, userName, rating, title, comment } = req.body;

  if (!rating || !comment) {
    res.status(400).json({ error: 'Rating and comment are required' });
    return;
  }

  const review = store.addReview({
    userId: userId || 'usr_anon',
    userName: userName || 'Atelier Client',
    productId: id,
    rating: Number(rating),
    title: title || 'Garment Review',
    comment,
    verifiedPurchase: true
  });

  res.json({ review });
});
