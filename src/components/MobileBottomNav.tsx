import React from 'react';
import { Home, Layers, Calculator, ShoppingBag, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  activeProductSlug?: string | null;
  onTabChange: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  activeProductSlug,
  onTabChange,
  cartCount,
  onOpenCart
}) => {
  const isHomeActive = (activeTab === 'home' || activeTab === 'catalog') && !activeProductSlug;
  const isCatalogActive = activeTab === 'catalog' && !activeProductSlug;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0D1B2A]/95 backdrop-blur-md border-t border-[#1A3448] z-40 py-2.5 px-3 shadow-2xl text-white">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 1. Acasă */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            isHomeActive ? 'text-[#00A878] font-extrabold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Acasă</span>
        </button>

        {/* 2. Produse */}
        <button
          onClick={() => onTabChange('catalog')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            isCatalogActive ? 'text-[#00A878] font-extrabold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px]">Produse</span>
        </button>

        {/* 3. Proiecte / Soluții */}
        <button
          onClick={() => onTabChange('solutions')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'solutions' || activeTab === 'calculator' ? 'text-[#00A878] font-extrabold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px]">Proiecte</span>
        </button>

        {/* 4. Comenzi / Coș */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center gap-1 text-slate-300 hover:text-white relative transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#00A878] text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Comenzi</span>
        </button>

        {/* 5. Cont */}
        <button
          onClick={() => onTabChange('account')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'account' ? 'text-[#00A878] font-extrabold' : 'text-slate-300 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Cont</span>
        </button>

      </div>
    </nav>
  );
};
