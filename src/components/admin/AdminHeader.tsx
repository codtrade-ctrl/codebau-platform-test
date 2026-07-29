import React from 'react';
import { Layers, Package, Sliders, FileText, Download, ArrowLeft, Plus, Sparkles } from 'lucide-react';

interface AdminHeaderProps {
  activeTab: 'products' | 'categories' | 'attributes' | 'documents' | 'backup';
  onTabChange: (tab: 'products' | 'categories' | 'attributes' | 'documents' | 'backup') => void;
  onNewProduct: () => void;
  onNewFromTemplate: (templateIdx: number) => void;
  onBackToSite: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onTabChange,
  onNewProduct,
  onNewFromTemplate,
  onBackToSite
}) => {
  return (
    <header className="bg-[#0D1B2A] text-white border-b border-[#1A3448] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Module Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-black text-base shadow-sm">
            PIM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight">CodeBau Catalog Pilot</h1>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                ADMIN v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Gestionare produse, specificații PIM și aprobare loturi pilot</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#13283A] p-1 rounded-xl border border-[#1A3448] text-xs font-bold">
          <button
            onClick={() => onTabChange('products')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'products' ? 'bg-[#00A878] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Produse</span>
          </button>
          <button
            onClick={() => onTabChange('categories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'categories' ? 'bg-[#00A878] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categorii</span>
          </button>
          <button
            onClick={() => onTabChange('attributes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'attributes' ? 'bg-[#00A878] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Atribute</span>
          </button>
          <button
            onClick={() => onTabChange('documents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'documents' ? 'bg-[#00A878] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documente</span>
          </button>
          <button
            onClick={() => onTabChange('backup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'backup' ? 'bg-[#00A878] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Import/Export</span>
          </button>
        </nav>

        {/* Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Pilot Template Quick Dropdown */}
          <div className="relative group">
            <button className="bg-[#13283A] hover:bg-[#1A3448] border border-[#1A3448] text-slate-200 font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Șabloane Pilot</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-60 bg-white text-[#0D1B2A] border border-[#D9E2E1] rounded-2xl shadow-xl p-2 hidden group-hover:block z-50 animate-in fade-in duration-150">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2 py-1">
                Generare rapidă lot pilot:
              </div>
              <button
                onClick={() => onNewFromTemplate(0)}
                className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded-lg text-xs font-bold flex flex-col cursor-pointer"
              >
                <span>1. Adeziv Economic</span>
                <span className="text-[10px] text-slate-500 font-normal">Ceresit CM 9 (Interior C1)</span>
              </button>
              <button
                onClick={() => onNewFromTemplate(1)}
                className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded-lg text-xs font-bold flex flex-col cursor-pointer"
              >
                <span>2. Adeziv Standard</span>
                <span className="text-[10px] text-slate-500 font-normal">Ceresit CM 11 Plus (C1TE)</span>
              </button>
              <button
                onClick={() => onNewFromTemplate(2)}
                className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded-lg text-xs font-bold flex flex-col cursor-pointer"
              >
                <span>3. Adeziv Premium</span>
                <span className="text-[10px] text-slate-500 font-normal">Ceresit CM 17 (C2TE S1 Flex)</span>
              </button>
              <button
                onClick={() => onNewFromTemplate(3)}
                className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded-lg text-xs font-bold flex flex-col cursor-pointer"
              >
                <span>4. Grund de Profunzime</span>
                <span className="text-[10px] text-slate-500 font-normal">Ceresit CT 17 (10 litri)</span>
              </button>
              <button
                onClick={() => onNewFromTemplate(4)}
                className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded-lg text-xs font-bold flex flex-col cursor-pointer"
              >
                <span>5. Accesoriu Nivelare</span>
                <span className="text-[10px] text-slate-500 font-normal">Clipsuri Nivelare Gresie 1.5mm</span>
              </button>
            </div>
          </div>

          <button
            onClick={onNewProduct}
            className="bg-[#00A878] hover:bg-[#008f66] text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Produs Nou</span>
          </button>

          <button
            onClick={onBackToSite}
            className="bg-[#13283A] hover:bg-[#1A3448] text-slate-300 hover:text-white font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Magazin Public</span>
          </button>
        </div>
      </div>
    </header>
  );
};
