import React, { useState } from 'react';
import { Product, UserRole, Promotion } from '../types';
import { MOCK_PRODUCTS, MOCK_STORES } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { PromotionService } from '../services/PromotionService';
import { Tag, Filter, ChevronRight, Calendar, Store, Percent, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface PromotionsPageProps {
  currentRole: UserRole;
  selectedStore: string;
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
  onNavigateHome: () => void;
}

export const PromotionsPage: React.FC<PromotionsPageProps> = ({
  currentRole,
  selectedStore,
  onAddToCart,
  onOpenDetail,
  onNavigateHome
}) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<string>('all');

  const activePromotions = PromotionService.getActivePromotions(selectedStore);

  // Filter products that have active promotion for given store & role
  const promotionalProducts = MOCK_PRODUCTS.filter(p => {
    const basePrice = (currentRole === 'meister' || currentRole === 'b2b') ? p.pricePro : p.priceRetail;
    const res = PromotionService.calculateEffectivePrice({
      product: p,
      basePrice,
      userRole: selectedRoleFilter === 'all' ? currentRole : selectedRoleFilter,
      selectedStore: selectedStoreFilter === 'all' ? selectedStore : selectedStoreFilter,
      quantity: 1
    });
    return res.isPromoActive;
  });

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#0D1B2A] py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#5C6670] flex items-center gap-1 font-medium">
        <button onClick={onNavigateHome} className="hover:text-[#087F5B] transition-colors cursor-pointer">
          Acasă
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0D1B2A] font-extrabold">Promoții & Campanii Comerciale</span>
      </nav>

      {/* Hero Section Banner */}
      <div className="bg-gradient-to-r from-[#0D1B2A] via-[#13283A] to-[#0D1B2A] border border-[#1A3448] p-8 rounded-3xl text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#F4B400] text-[#0D1B2A] text-xs font-black px-3 py-1 rounded-full uppercase shadow-xs">
            <Tag className="w-4 h-4 fill-current" />
            <span>Ofertă Comercială Activă</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Campanii Promoționale & Reduceri Comerciale în Sudul Moldovei
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            Beneficiază de prețuri speciale reduse pentru persoane fizice, meșteri certificați Meister Club și clienți B2B. Toate prețurile promoționale se calculează și se aplică automat în coș.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Percent className="w-4 h-4" /> Până la −30% Reducere la Materiale de Construcții
            </span>
            <span className="flex items-center gap-1.5">
              <Store className="w-4 h-4" /> Stocuri Garantate în Cahul, Cantemir, Vulcănești, Taraclia
            </span>
          </div>
        </div>
      </div>

      {/* Active Promotion Campaigns Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-[#0D1B2A] uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 fill-current" />
          <span>Campanii Promoționale în Desfășurare ({activePromotions.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePromotions.map(promo => (
            <div key={promo.id} className="bg-white p-5 rounded-2xl border border-amber-500/30 shadow-xs flex flex-col justify-between space-y-3 relative overflow-hidden">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="bg-[#F4B400] text-[#0D1B2A] text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    {promo.badgeText || 'PROMOȚIE'}
                  </span>
                  <span className="text-[10px] text-[#5C6670] font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#087F5B]" />
                    Până la {promo.endDate}
                  </span>
                </div>

                <h4 className="font-extrabold text-[#0D1B2A] text-sm leading-snug">{promo.name}</h4>
                <p className="text-xs text-[#5C6670] line-clamp-2">{promo.description}</p>
              </div>

              <div className="pt-2 border-t border-[#D9E2E1] flex items-center justify-between text-xs">
                <span className="font-bold text-[#087F5B]">
                  {promo.type === 'percentage_discount' && `−${promo.discountPercentage}% Reducere`}
                  {promo.type === 'amount_discount' && `−${promo.discountAmount} MDL / unitate`}
                  {promo.type === 'fixed_price' && `Preț Fix ${promo.fixedPrice} MDL`}
                </span>
                <span className="text-[10px] text-[#5C6670]">
                  Grup: <strong>{promo.customerRoles?.includes('all') ? 'Toate rolurile' : promo.customerRoles?.join(', ').toUpperCase() || 'Toate rolurile'}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar for Promotional Products */}
      <div className="bg-white p-4 rounded-2xl border border-[#D9E2E1] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-[#0D1B2A] flex items-center gap-1">
            <Filter className="w-4 h-4 text-[#087F5B]" />
            Filtrează Promoțiile:
          </span>

          {/* Role Filter */}
          <select
            value={selectedRoleFilter}
            onChange={e => setSelectedRoleFilter(e.target.value as any)}
            className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-1.5 font-bold text-[#0D1B2A] focus:outline-none focus:border-[#087F5B]"
          >
            <option value="all">Toate Rolurile Comercial</option>
            <option value="client">Numai Persoane Fizice (Retail)</option>
            <option value="meister">Numai Meșteri (Meister Club)</option>
            <option value="b2b">Numai Companii (B2B Pro)</option>
          </select>

          {/* Store Filter */}
          <select
            value={selectedStoreFilter}
            onChange={e => setSelectedStoreFilter(e.target.value)}
            className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-1.5 font-bold text-[#0D1B2A] focus:outline-none focus:border-[#087F5B]"
          >
            <option value="all">Toate Magazinele CodeBau</option>
            {MOCK_STORES.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        <p className="text-xs font-extrabold text-[#087F5B] self-end md:self-auto">
          Găsite: {promotionalProducts.length} produse pe promoție
        </p>

      </div>

      {/* Product Grid */}
      {promotionalProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#D9E2E1] text-center space-y-3">
          <Tag className="w-10 h-10 text-amber-500 fill-current mx-auto opacity-40" />
          <h3 className="text-base font-extrabold text-[#0D1B2A]">Nu s-au găsit produse pe promoție pentru filtrele selectate</h3>
          <p className="text-xs text-[#5C6670]">Încearcă să resetezi filtrele de rol sau magazin.</p>
          <button
            onClick={() => {
              setSelectedRoleFilter('all');
              setSelectedStoreFilter('all');
            }}
            className="mt-2 inline-flex items-center gap-2 bg-[#087F5B] text-white font-extrabold text-xs px-4 py-2 rounded-xl"
          >
            Resetează Filtrele
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {promotionalProducts.map(product => (
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
      )}

    </div>
  );
};
