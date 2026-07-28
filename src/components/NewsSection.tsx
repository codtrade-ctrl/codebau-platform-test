import React from 'react';
import { Product, UserRole } from '../types';
import { ProductCard } from './ProductCard';
import { PromotionService } from '../services/PromotionService';
import { Sparkles, ArrowRight } from 'lucide-react';

interface NewsSectionProps {
  products: Product[];
  currentRole: UserRole;
  selectedStore: string;
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
  onNavigateToNews: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  products,
  currentRole,
  selectedStore,
  onAddToCart,
  onOpenDetail,
  onNavigateToNews
}) => {
  // Filter products that are new
  const newProducts = products.filter(p => PromotionService.isNewProduct(p)).slice(0, 4);

  if (newProducts.length === 0) return null;

  return (
    <section className="space-y-4 my-10 animate-in fade-in duration-300">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#DDF5EE] p-2 rounded-xl border border-[#00A878]/30">
            <Sparkles className="w-5 h-5 text-[#087F5B] stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0D1B2A] tracking-tight">Noutăți CodeBau</h2>
            <p className="text-xs text-[#5C6670] font-medium">Materiale și tehnologii adăugate recent în stoc</p>
          </div>
        </div>

        <button
          onClick={onNavigateToNews}
          className="text-xs font-black text-[#087F5B] hover:text-[#066B4D] hover:underline flex items-center gap-1.5 transition-all cursor-pointer group"
        >
          <span>Vezi toate noutățile</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Grid: 4 Desktop, 2 Tablet, horizontal scroll mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {newProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            currentRole={currentRole}
            selectedStore={selectedStore}
            onAddToCart={onAddToCart}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>

    </section>
  );
};
