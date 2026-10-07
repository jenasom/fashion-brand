import React, { useState, useEffect } from 'react';
import { Product, Category, Collection } from '../types/index';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { SlidersHorizontal, Search, X } from 'lucide-react';

interface ShopPageProps {
  onNavigate: (route: string) => void;
  searchParam?: string;
  categoryParam?: string;
  wishlistOnly?: boolean;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onNavigate,
  searchParam = '',
  categoryParam = '',
  wishlistOnly = false
}) => {
  const { wishlist } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(wishlistOnly);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catsRes, colsRes] = await Promise.all([
          api.getCategories(),
          api.getCollections()
        ]);
        setCategories(catsRes.categories);
        setCollections(colsRes.collections);
      } catch (err) {
        console.warn('Failed to load shop meta', err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setShowWishlistOnly(wishlistOnly);
  }, [wishlistOnly]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await api.getProducts({
          categoryId: selectedCategory || undefined,
          collectionId: selectedCollection || undefined,
          search: searchQuery || undefined,
          sort: sortOption
        });

        let list = res.products;
        if (showWishlistOnly) {
          list = list.filter((p) => wishlist.includes(p.id));
        }
        if (onlyInStock) {
          list = list.filter((p) =>
            p.variants.some((v) => v.stock - v.reservedStock > 0)
          );
        }

        setProducts(list);
      } catch (err) {
        console.warn('Failed to fetch products', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedCollection, sortOption, searchQuery, showWishlistOnly, onlyInStock, wishlist]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedCollection('');
    setSearchQuery('');
    setSortOption('newest');
    setOnlyInStock(false);
    setShowWishlistOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title & Banner */}
      <div className="border-b border-[#E8E3D8] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C2A676] font-semibold block mb-1">
              Atelier Garments & Silhouettes
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] font-light">
              {showWishlistOnly ? 'Saved Atelier Wardrobe' : 'The Brand Storefront'}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#7A7469]">
            <span>{products.length} Garments Available</span>
            <span aria-hidden="true">·</span>
            <span>Lagos, Paris & Savile Row Savoir-Faire</span>
          </div>
        </div>
      </div>

      {/* Filter & Sorting Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 bg-[#FAF9F5] border border-[#E8E3D8] rounded-xs text-xs">
        {/* Category Buttons (Functional filter buttons with clean states) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 transition-colors font-medium ${
              selectedCategory === ''
                ? 'bg-[#1A1A1A] text-[#FAF9F5]'
                : 'bg-[#F2EEE4] text-[#4A453E] hover:bg-[#E8E2D5]'
            }`}
          >
            All Pieces
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 transition-colors font-medium ${
                selectedCategory === cat.id
                  ? 'bg-[#1A1A1A] text-[#FAF9F5]'
                  : 'bg-[#F2EEE4] text-[#4A453E] hover:bg-[#E8E2D5]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search, Sort & Stock Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search garments..."
              className="bg-[#F5F2EB] border border-[#D8D2C5] pl-8 pr-3 py-1.5 text-xs text-[#1A1A1A] rounded focus:outline-hidden focus:border-[#1A1A1A] w-40 sm:w-48"
            />
            <Search className="w-3.5 h-3.5 text-[#8C8476] absolute left-2.5 top-2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-[#888] hover:text-[#111]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-[#F5F2EB] border border-[#D8D2C5] px-3 py-1.5 text-xs text-[#1A1A1A] rounded focus:outline-hidden focus:border-[#1A1A1A]"
          >
            <option value="newest">Sort by: Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* In-Stock Toggle */}
          <label className="flex items-center gap-1.5 text-[#4A453E] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="accent-[#1A1A1A]"
            />
            <span>In-Stock Only</span>
          </label>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <p className="font-serif text-lg text-[#7A7469] animate-pulse">Loading atelier catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-[#FAF9F5] border border-dashed border-[#D5CEBF] p-8">
          <SlidersHorizontal className="w-8 h-8 text-[#A89F90] mx-auto stroke-[1.2]" />
          <h3 className="font-serif text-xl text-[#1A1A1A]">No Garments Match Your Selection</h3>
          <p className="text-xs text-[#7A7469] max-w-sm mx-auto">
            Try resetting your active filters, adjusting the search query, or checking back during the next capsule drop.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 px-5 py-2 bg-[#1A1A1A] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#333]"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(slug) => onNavigate(`/shop/${slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
