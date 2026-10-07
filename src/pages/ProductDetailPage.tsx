import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, Review } from '../types/index';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw, Star, Check } from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { addToCart, isInWishlist, toggleWishlist, user, showToast } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // New review form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        setProduct(res.product);
        setReviews(res.reviews || []);
        if (res.product.images.length > 0) {
          setSelectedImage(res.product.images[0]);
        }
        if (res.product.variants.length > 0) {
          setSelectedVariant(res.product.variants[0]);
        }
      } catch (err) {
        console.warn('Failed to load product', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <p className="font-serif text-xl text-[#7A7469] animate-pulse">Consulting atelier archive...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1A1A1A]">Garment Not Found</h2>
        <p className="text-xs text-[#7A7469]">This piece may have sold out or been archived.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider font-semibold"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const availableStock = selectedVariant ? Math.max(0, selectedVariant.stock - selectedVariant.reservedStock) : 0;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, selectedVariant.id, quantity);
    } catch {
      // Error handled in AppContext
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'usr_guest',
          userName: user?.name || 'Atelier Patron',
          rating: reviewRating,
          title: reviewTitle || 'Atelier Feedback',
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (data.review) {
        setReviews([data.review, ...reviews]);
        setReviewComment('');
        setReviewTitle('');
        showToast('Thank you. Your critique has been submitted to the atelier archive.');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/shop')}
        className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#7A7469] hover:text-[#1A1A1A] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Catalog
      </button>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="aspect-[2/3] w-full overflow-hidden bg-[#F0EDE6] border border-[#E8E3D8] relative">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-all duration-300"
            />
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 overflow-hidden border transition-all ${
                    selectedImage === img ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A]' : 'border-[#E0DAD0] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Purchase Column (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-2 border-b border-[#E8E3D8] pb-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C2A676] font-semibold block">
              Atelier Bespoke Edition
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-light leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-[#7A7469] italic">{product.tagline}</p>

            <div className="flex items-center justify-between pt-3">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-normal text-[#1A1A1A] tabular-nums">
                  ${product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-[#8C8476] line-through tabular-nums">
                    ${product.compareAtPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-[#7A7469]">
                <Star className="w-3.5 h-3.5 fill-[#C2A676] text-[#C2A676]" />
                <span className="font-medium text-[#1A1A1A]">{product.averageRating.toFixed(1)}</span>
                <span>({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 text-xs sm:text-sm text-[#554F44] leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Variant Selector */}
          <div className="space-y-5 border-y border-[#E8E3D8] py-6">
            {/* Color Selection */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#7A7469] font-medium block mb-2">
                Colorway: <span className="text-[#1A1A1A] font-semibold">{selectedVariant?.color}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(product.variants.map((v) => v.color))).map((color) => {
                  const matchingVariant = product.variants.find((v) => v.color === color);
                  const isSelected = selectedVariant?.color === color;
                  return (
                    <button
                      key={color}
                      onClick={() => matchingVariant && setSelectedVariant(matchingVariant)}
                      className={`px-3 py-1.5 text-xs rounded-xs border transition-colors flex items-center gap-2 ${
                        isSelected
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                          : 'border-[#D8D2C5] bg-[#FAF9F5] text-[#333] hover:bg-[#F0EDE6]'
                      }`}
                    >
                      {matchingVariant?.colorHex && (
                        <span
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: matchingVariant.colorHex }}
                        />
                      )}
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] uppercase tracking-wider text-[#7A7469] font-medium">
                  Size: <span className="text-[#1A1A1A] font-semibold">{selectedVariant?.size}</span>
                </label>
                <span className="text-[11px] text-[#8C8476] underline cursor-pointer">
                  Bespoke Sizing Chart
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.variants
                  .filter((v) => !selectedVariant || v.color === selectedVariant.color)
                  .map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const stockRemaining = variant.stock - variant.reservedStock;
                    const isSoldOut = stockRemaining <= 0;

                    return (
                      <button
                        key={variant.id}
                        disabled={isSoldOut}
                        onClick={() => setSelectedVariant(variant)}
                        className={`py-2 text-xs font-semibold uppercase tracking-wider border transition-colors relative ${
                          isSelected
                            ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                            : isSoldOut
                            ? 'border-[#E5E0D5] bg-[#F2EEE4] text-[#AAA] cursor-not-allowed line-through'
                            : 'border-[#D8D2C5] bg-[#FAF9F5] text-[#1A1A1A] hover:border-[#1A1A1A]'
                        }`}
                      >
                        {variant.size}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Stock Level Feedback */}
            <div className="text-xs">
              {availableStock > 0 ? (
                <div className="text-[#5B7E51] font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {availableStock <= 3
                      ? `Atelier Alert: Only ${availableStock} pieces remaining in stock`
                      : `${availableStock} pieces available in Milan Atelier`}
                  </span>
                </div>
              ) : (
                <div className="text-[#991B1B] font-medium">
                  Sold out for this variant. Contact concierge for custom bespoke tailoring.
                </div>
              )}
            </div>

            {/* Quantity and Add to Bag */}
            <div className="flex gap-3 pt-2">
              <div className="flex items-center border border-[#D8D2C5] rounded bg-[#FAF9F5]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-xs hover:bg-[#EBE6DC] text-[#4A453E]"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                  className="px-3 py-2 text-xs hover:bg-[#EBE6DC] text-[#4A453E] disabled:opacity-30"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || availableStock === 0}
                className="flex-1 py-3 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md disabled:bg-[#888]"
              >
                <ShoppingBag className="w-4 h-4" />
                {isAdding ? 'Securing Stock...' : availableStock > 0 ? 'Place in Wardrobe Bag' : 'Sold Out'}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-3 border border-[#D8D2C5] hover:border-[#1A1A1A] rounded bg-[#FAF9F5] text-[#1A1A1A] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWished ? 'fill-[#C2A676] text-[#C2A676]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#666055] pt-2">
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-[#C2A676] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#1A1A1A]">Complimentary Delivery</strong>
                <span>Orders over $500</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C2A676] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#1A1A1A]">Serialized Garment</strong>
                <span>Numbered artisan run</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 text-[#C2A676] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#1A1A1A]">Bespoke Exchange</strong>
                <span>30-day atelier guarantee</span>
              </div>
            </div>
          </div>

          {/* Garment Details & Care */}
          <div className="space-y-4 pt-4 border-t border-[#E8E3D8]">
            <div>
              <h4 className="font-serif text-lg text-[#1A1A1A] mb-2">Tailoring & Craft Specifications</h4>
              <ul className="space-y-1.5 text-xs text-[#554F44]">
                {product.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#C2A676] font-bold">·</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <h4 className="font-serif text-lg text-[#1A1A1A] mb-1">Fabric & Care Guide</h4>
              <p className="text-xs text-[#666055] leading-relaxed">{product.fabricCare}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Critiques & Reviews Section */}
      <div className="pt-12 border-t border-[#E8E3D8] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl text-[#1A1A1A]">Client Reviews & Testimonials</h3>
            <p className="text-xs text-[#7A7469]">Verified acquisitions from the atelier salon</p>
          </div>
          <span className="text-sm font-medium text-[#1A1A1A]">
            Average: ★ {product.averageRating.toFixed(1)} / 5.0
          </span>
        </div>

        {/* Existing Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length === 0 ? (
            <p className="text-xs text-[#7A7469] col-span-2 py-6">Be the first to record a critique for this garment.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-[#FAF9F5] border border-[#E8E3D8] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1A1A1A]">{rev.userName}</span>
                  <div className="text-[#C2A676]">{'★'.repeat(rev.rating)}</div>
                </div>
                <h4 className="font-medium text-xs text-[#1A1A1A]">{rev.title}</h4>
                <p className="text-xs text-[#554F44] leading-relaxed">{rev.comment}</p>
                <div className="text-[10px] text-[#8C8476] pt-1">
                  Verified Atelier Purchase · {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Leave a Review Form */}
        <div className="p-6 bg-[#F7F5EE] border border-[#E5E0D5] rounded-xs max-w-2xl space-y-4">
          <h4 className="font-serif text-lg text-[#1A1A1A]">Submit Your Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                Rating
              </label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-1.5 text-xs text-[#1A1A1A] rounded"
              >
                <option value={5}>5 Stars - Exquisite Haute Couture</option>
                <option value={4}>4 Stars - High Quality</option>
                <option value={3}>3 Stars - Good</option>
                <option value={2}>2 Stars - Substandard</option>
                <option value={1}>1 Star - Flawed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                Review Headline
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Flawless wool structure, impeccable fit"
                className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-1.5 text-xs text-[#1A1A1A] rounded"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                Your Commentary
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe drape, seam construction, and sizing accuracy..."
                className="w-full bg-[#FAF9F5] border border-[#D8D2C5] px-3 py-1.5 text-xs text-[#1A1A1A] rounded"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-6 py-2.5 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-wider font-semibold disabled:bg-[#888]"
            >
              {isSubmittingReview ? 'Submitting...' : 'Post Critique'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
