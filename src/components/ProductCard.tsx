import React from 'react';
import { Product } from '../types/index';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (slug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, isInWishlist, toggleWishlist } = useApp();
  const isWished = isInWishlist(product.id);

  // Available total stock across variants
  const totalAvailableStock = product.variants.reduce(
    (acc, v) => acc + Math.max(0, v.stock - v.reservedStock),
    0
  );

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants.length > 0) {
      // Pick first available variant
      const firstAvailable = product.variants.find((v) => v.stock - v.reservedStock > 0) || product.variants[0];
      await addToCart(product.id, firstAvailable.id, 1);
    }
  };

  return (
    <div
      onClick={() => onSelect(product.slug)}
      className="group flex flex-col cursor-pointer transition-all duration-300"
    >
      {/* Image Showcase */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#F0EDE6] border border-[#E8E3D8]">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Secondary image hover transition if present */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#FAF9F5]/90 hover:bg-white text-[#1A1A1A] transition-colors shadow-xs z-10"
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-[#C2A676] text-[#C2A676]' : 'text-[#4A453E]'}`} />
        </button>

        {/* Quick Action Bar on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex gap-2 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={totalAvailableStock === 0}
            className="flex-1 py-2.5 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md disabled:bg-[#888]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {totalAvailableStock > 0 ? 'Quick Reserve' : 'Sold Out'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product.slug);
            }}
            className="px-3 py-2.5 bg-white/90 hover:bg-white text-[#1A1A1A] transition-colors shadow-md"
            title="Inspect Garment"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Information: Zero-pill discipline */}
      <div className="pt-3.5 flex flex-col space-y-1">
        {/* Subtle unboxed metadata */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#8C8476]">
          <span>{product.variants.length} Sizes</span>
          <span aria-hidden="true">·</span>
          <span>{totalAvailableStock > 0 ? `${totalAvailableStock} in Atelier` : 'Bespoke Order Only'}</span>
        </div>

        {/* Garment Title */}
        <h3 className="font-serif text-base sm:text-lg text-[#1A1A1A] group-hover:text-[#8E7954] transition-colors leading-snug line-clamp-1">
          {product.name}
        </h3>

        {/* Pricing & Tagline */}
        <div className="flex items-baseline justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-[#1A1A1A] tabular-nums">
              ${product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#8C8476] line-through tabular-nums">
                ${product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#7A7469]">
            ★ {product.averageRating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>
      </div>
    </div>
  );
};
