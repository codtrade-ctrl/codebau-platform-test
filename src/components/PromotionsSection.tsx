import React from 'react';
import { Product, UserRole } from '../types';
import { ProductCard } from './ProductCard';
import { PromotionService } from '../services/PromotionService';
import { Tag, ArrowRight } from 'lucide-react';

interface PromotionsSectionProps {
  products: Product[];
  currentRole: UserRole;
  selectedStore: string;
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
  onNavigateToPromotions: () => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  products,
  currentRole,
  selectedStore,
  onAddToCart,
  onOpenDetail,
  onNavigateToPromotions
}) => {
  // Filter products that have an active promotion
  const promoProducts = products.filter(p => {
    const basePrice = (currentRole === 'meister' || currentRole === 'b2b') ? p.pricePro : p.priceRetail;
    const res = PromotionService.calculateEffectivePrice({
      product: p,
      basePrice,
      userRole: currentRole,
      selectedStore,
      quantity: 1
    });
    return res.isPromoActive;
  }).slice(0, 4);

  if (promoProducts.length === 0) return null;

  return (
    <section className="space-y-4 my-10 animate-in fade-in duration-300">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-100 p-2 rounded-xl border border-amber-300">
            <Tag className="w-5 h-5 text-amber-600 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0D1B2A] tracking-tight">Promoții & Reduceri Speciale</h2>
            <p className="text-xs text-[#5C6670] font-medium">Prețuri reduse temporar pentru magazinul tău din {selectedStore}</p>
          </div>
        </div>

        <button
          onClick={onNavigateToPromotions}
          className="text-xs font-black text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1.5 transition-all cursor-pointer group"
        >
          <span>Vezi toate promoțiile</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-amber-600" />
        </button>
      </div>

      {/* Grid: 4 Desktop, 2 Tablet, 1 Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {promoProducts.map(product => (
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
