import React, { useState } from 'react';
import { Product, UserRole } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { PromotionService } from '../services/PromotionService';
import { Sparkles, Filter, ChevronRight, Info, ShieldCheck, ArrowRight } from 'lucide-react';

interface NewsPageProps {
  currentRole: UserRole;
  selectedStore: string;
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
  onNavigateHome: () => void;
  products?: Product[];
}

export const NewsPage: React.FC<NewsPageProps> = ({
  currentRole,
  selectedStore,
  onAddToCart,
  onOpenDetail,
  onNavigateHome,
  products
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const productSource = products || MOCK_PRODUCTS;

  // Filter only new products
  const allNewProducts = productSource.filter(p => PromotionService.isNewProduct(p));

  // Subcategories present
  const subcategories = Array.from(new Set(allNewProducts.map(p => p.subcategory || p.category)));

  let filtered = selectedSubcategory === 'all' 
    ? allNewProducts 
    : allNewProducts.filter(p => (p.subcategory || p.category) === selectedSubcategory);

  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.priceRetail - b.priceRetail);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.priceRetail - a.priceRetail);
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#0D1B2A] py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#5C6670] flex items-center gap-1 font-medium">
        <button onClick={onNavigateHome} className="hover:text-[#087F5B] transition-colors cursor-pointer">
          Acasă
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0D1B2A] font-extrabold">Noutăți & Materiale Inovatoare</span>
      </nav>

      {/* Hero Section Banner */}
      <div className="bg-[#0D1B2A] border border-[#1A3448] p-8 rounded-3xl text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#DDF5EE] text-[#087F5B] text-xs font-black px-3 py-1 rounded-full border border-[#00A878]/30 uppercase">
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Noutăți CodeBau Moldova</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Produse & Tehnologii de Ultimă Generație lansate în Sudul Moldovei
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            Toate materialele din această secțiune sunt adăugate în ultimele 60 de zile în stocul magazinelor noastre din Cahul, Cantemir, Vulcănești și Taraclia, fiind însoțite de fișe tehnice oficiale și garanție directă de producător.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-400 font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Certificare Calitate UE
            </span>
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4" /> Disponibile instant pentru Ridicare Locker 24/7
            </span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D9E2E1] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedSubcategory === 'all'
                ? 'bg-[#087F5B] text-white shadow-xs'
                : 'bg-[#F8FAF9] border border-[#D9E2E1] text-[#5C6670] hover:text-[#0D1B2A]'
            }`}
          >
            Toate Noutățile ({allNewProducts.length})
          </button>

          {subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubcategory === sub
                  ? 'bg-[#087F5B] text-white shadow-xs'
                  : 'bg-[#F8FAF9] border border-[#D9E2E1] text-[#5C6670] hover:text-[#0D1B2A]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs self-end md:self-auto">
          <span className="text-[#5C6670] font-bold">Sortează:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-1.5 font-bold text-[#0D1B2A] focus:outline-none focus:border-[#087F5B]"
          >
            <option value="newest">Cele mai noi adăugate</option>
            <option value="price-asc">Preț crescător</option>
            <option value="price-desc">Preț descrescător</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#D9E2E1] text-center space-y-3">
          <Sparkles className="w-10 h-10 text-[#087F5B] mx-auto opacity-40" />
          <h3 className="text-base font-extrabold text-[#0D1B2A]">Nu există noutăți în această categorie</h3>
          <p className="text-xs text-[#5C6670]">Selectează altă categorie sau revino la toate produsele noi.</p>
          <button
            onClick={() => setSelectedSubcategory('all')}
            className="mt-2 inline-flex items-center gap-2 bg-[#087F5B] text-white font-extrabold text-xs px-4 py-2 rounded-xl"
          >
            Vezi toate noutățile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
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
