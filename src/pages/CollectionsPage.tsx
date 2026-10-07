import React, { useEffect, useState } from 'react';
import { Collection, Product } from '../types/index';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';

interface CollectionsPageProps {
  onNavigate: (route: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onNavigate }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await api.getCollections();
        setCollections(res.collections);
        if (res.collections.length > 0) {
          setActiveCollection(res.collections[0]);
        }
      } catch (err) {
        console.warn('Failed to load collections', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    if (!activeCollection) return;
    const fetchCollectionProducts = async () => {
      try {
        const res = await api.getProducts({ collectionId: activeCollection.id });
        setProducts(res.products);
      } catch (err) {
        console.warn('Failed to load collection products', err);
      }
    };
    fetchCollectionProducts();
  }, [activeCollection]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="font-serif text-lg text-[#7A7469] animate-pulse">Loading atelier collections...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="border-b border-[#E8E3D8] pb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#C2A676] font-semibold block mb-1">
          Seasonal Direction & Architecture
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] font-light">
          Capsule Collections
        </h1>
      </div>

      {/* Collection Switcher Tabs */}
      <div className="flex gap-3 border-b border-[#E8E3D8] pb-4">
        {collections.map((col) => {
          const isSelected = activeCollection?.id === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setActiveCollection(col)}
              className={`pb-2 text-xs uppercase tracking-widest font-semibold transition-all relative ${
                isSelected ? 'text-[#1A1A1A]' : 'text-[#8C8476] hover:text-[#1A1A1A]'
              }`}
            >
              {col.name}
              {isSelected && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A1A1A]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Collection Showcase Banner */}
      {activeCollection && (
        <div className="p-8 sm:p-12 bg-[#EDE7DB] border border-[#D5CEBF] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 aspect-[2/3] overflow-hidden"><img src={activeCollection.bannerImage} alt={activeCollection.name} className="w-full h-full object-cover object-top" /></div>
          <div className="md:col-span-5 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#8E7954] font-semibold">
              {activeCollection.season}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-light">
              {activeCollection.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#554F44] leading-relaxed max-w-2xl">
              {activeCollection.description}
            </p>
          </div>

          <div className="md:col-span-3 flex justify-start md:justify-end">
            <button
              onClick={() => onNavigate(`/shop?collection=${activeCollection.id}`)}
              className="px-6 py-3 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
            >
              Shop Collection <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Collection Product Grid */}
      <div className="space-y-6">
        <h3 className="font-serif text-2xl text-[#1A1A1A]">Curated Garments in this Edit</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(slug) => onNavigate(`/shop/${slug}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
