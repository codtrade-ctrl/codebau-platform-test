import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';
import { PromotionService } from '../services/PromotionService';
import { Sparkles, Calendar, Save, Check, RefreshCw, Eye, Tag, Search } from 'lucide-react';

export const AdminNewsView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [durationDays, setDurationDays] = useState<number>(60);
  const [search, setSearch] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setDurationDays(PromotionService.getNewProductDurationDays());
  }, []);

  const handleUpdateDuration = (e: React.FormEvent) => {
    e.preventDefault();
    PromotionService.setNewProductDurationDays(durationDays);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleToggleManualNew = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          isManuallyMarkedNew: !p.isManuallyMarkedNew
        };
      }
      return p;
    }));
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Settings Panel */}
      <div className="bg-white p-6 rounded-2xl border border-[#D9E2E1] space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-[#087F5B] font-extrabold text-base">
          <Sparkles className="w-5 h-5 stroke-[2.5]" />
          <span>Configurare Regulă Automată Produse Noi („Noutăți”)</span>
        </div>

        <p className="text-xs text-[#5C6670] max-w-3xl leading-relaxed">
          Produsele sunt încadrate automat în secțiunea <strong>Noutăți</strong> pe baza datei de lansare (<code>launchDate</code>) pentru o perioadă configurabilă de zile.
        </p>

        <form onSubmit={handleUpdateDuration} className="flex flex-col sm:flex-row items-start sm:items-end gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
              Perioadă Valabilitate Status Noutate (Zile):
            </label>
            <input
              type="number"
              min={1}
              max={365}
              value={durationDays}
              onChange={e => setDurationDays(Number(e.target.value))}
              className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-4 py-2 font-black text-[#0D1B2A] text-sm focus:outline-none focus:border-[#087F5B]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Salvat!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Actualizează Regula</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Catalog Listing with Manual Overrides */}
      <div className="bg-white rounded-2xl border border-[#D9E2E1] p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-sm font-extrabold text-[#0D1B2A]">
            Catalog Produse & Status Noutate
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6670]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Caută după nume sau SKU..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl text-xs focus:outline-none focus:border-[#087F5B]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAF9] border-b border-[#D9E2E1] text-[#5C6670] font-extrabold uppercase">
                <th className="p-3">Produs</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Dată Lansare</th>
                <th className="p-3 text-center">Status Calculator</th>
                <th className="p-3 text-center">Setare Manuală (Override)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E2E1] text-[#0D1B2A]">
              {filtered.map(p => {
                const isAutoNew = PromotionService.isNewProduct(p);
                return (
                  <tr key={p.id} className="hover:bg-[#F8FAF9]/80 transition-colors">
                    <td className="p-3 font-bold flex items-center gap-2">
                      <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-100" />
                      <span>{p.name}</span>
                    </td>

                    <td className="p-3 font-mono text-[11px] text-[#5C6670]">
                      {p.sku}
                    </td>

                    <td className="p-3 text-[11px]">
                      {p.launchDate || '2026-01-01'}
                    </td>

                    <td className="p-3 text-center">
                      {isAutoNew ? (
                        <span className="bg-[#DDF5EE] text-[#087F5B] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-[#087F5B]/20">
                          NOUTATE (ACTIVĂ)
                        </span>
                      ) : (
                        <span className="bg-[#E9ECEF] text-[#5C6670] text-[10px] font-medium px-2 py-0.5 rounded-full">
                          STANDARD
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleManualNew(p.id)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                          p.isManuallyMarkedNew 
                            ? 'bg-[#087F5B] text-white shadow-xs' 
                            : 'bg-[#F8FAF9] border border-[#D9E2E1] text-[#5C6670] hover:text-[#0D1B2A]'
                        }`}
                      >
                        {p.isManuallyMarkedNew ? 'Marcat Noutate (Forțat)' : 'Setare Automată'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
