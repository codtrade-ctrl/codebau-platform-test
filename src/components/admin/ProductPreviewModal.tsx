import React, { useState } from 'react';
import { CatalogProduct, catalogProductToPublicProduct } from '../../types/catalog';
import ProductDetailPage from '../ProductDetailPage';
import { Smartphone, Monitor, Globe, X, AlertTriangle } from 'lucide-react';

interface ProductPreviewModalProps {
  product: CatalogProduct;
  allProducts: CatalogProduct[];
  onClose: () => void;
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  product,
  allProducts,
  onClose
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [lang, setLang] = useState<'ro' | 'ru'>('ro');

  const publicProduct = catalogProductToPublicProduct(product, lang);
  const publicAllProducts = allProducts.map(p => catalogProductToPublicProduct(p, lang));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
      {/* Top Administrative Bar */}
      <div className="bg-[#0D1B2A] text-white border-b border-[#1A3448] px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black uppercase px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>MOD PREVIZUALIZARE — Produs Nepublicat</span>
          </div>
          <span className="text-xs font-bold text-slate-300 hidden sm:inline">
            Afișare exactă așa cum va apărea în magazinul public CodeBau
          </span>
        </div>

        {/* Device & Language Switchers */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#13283A] border border-[#1A3448] p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                deviceMode === 'desktop' ? 'bg-[#00A878] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Afișare Desktop"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                deviceMode === 'mobile' ? 'bg-[#00A878] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Afișare Mobil (360px)"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline">Mobil</span>
            </button>
          </div>

          <div className="flex items-center bg-[#13283A] border border-[#1A3448] p-1 rounded-xl text-xs font-bold text-slate-300">
            <Globe className="w-3.5 h-3.5 ml-1 text-slate-400" />
            <button
              onClick={() => setLang('ro')}
              className={`px-2 py-1 rounded-lg cursor-pointer ${lang === 'ro' ? 'bg-[#00A878] text-white font-extrabold' : 'hover:text-white'}`}
            >
              RO
            </button>
            <button
              onClick={() => setLang('ru')}
              className={`px-2 py-1 rounded-lg cursor-pointer ${lang === 'ru' ? 'bg-[#00A878] text-white font-extrabold' : 'hover:text-white'}`}
            >
              RU
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview Canvas Container */}
      <div className="flex-1 overflow-y-auto bg-slate-200 p-4 sm:p-6 flex justify-center items-start">
        <div
          className={`bg-white rounded-2xl shadow-2xl transition-all overflow-hidden ${
            deviceMode === 'mobile' ? 'w-[375px] my-4 border-8 border-slate-800 rounded-3xl' : 'w-full max-w-7xl'
          }`}
        >
          <ProductDetailPage
            product={publicProduct}
            allProducts={publicAllProducts}
            onBack={() => {}}
            onAddToCart={() => alert('Simulare: Produs adăugat în coș din previzualizare!')}
            onOpenAiAssistant={() => {}}
            onSelectProduct={() => {}}
            onSelectCraftsman={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
