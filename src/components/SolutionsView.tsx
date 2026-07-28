import React, { useState } from 'react';
import { MOCK_PROJECT_SOLUTIONS, MOCK_PRODUCTS } from '../data/mockData';
import { ProjectSolution, BudgetTier, CartItem } from '../types';
import { Check, ArrowRight, ShoppingCart, Wrench, ShieldCheck, Clock, Layers, Sparkles } from 'lucide-react';

interface SolutionsViewProps {
  onAddMultipleToCart: (items: CartItem[]) => void;
  onSelectCraftsman: () => void;
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({
  onAddMultipleToCart,
  onSelectCraftsman
}) => {
  const [selectedSolution, setSelectedSolution] = useState<ProjectSolution>(MOCK_PROJECT_SOLUTIONS[0]);
  const [tier, setTier] = useState<BudgetTier>('standard');
  const [addedMsg, setAddedMsg] = useState('');

  const currentProducts = selectedSolution.defaultProducts[tier].map(id => MOCK_PRODUCTS.find(p => p.id === id)!).filter(Boolean);
  const currentEstimate = tier === 'premium' ? selectedSolution.premiumEstimate : tier === 'economic' ? selectedSolution.economicEstimate : selectedSolution.standardEstimate;

  const handleAddSolutionPackage = () => {
    const cartItems: CartItem[] = currentProducts.map(p => ({
      product: p,
      quantity: 1,
      appliedPrice: p.priceRetail
    }));
    onAddMultipleToCart(cartItems);
    setAddedMsg(`✅ Pachetul complet "${selectedSolution.title}" (${tier.toUpperCase()}) a fost adăugat în coș!`);
    setTimeout(() => setAddedMsg(''), 4000);
  };

  return (
    <div className="bg-[#F4F7F6] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* ================= HERO SECTION ================= */}
        <div className="bg-gradient-to-br from-white via-[#EFFAF6] to-[#E9ECEF] border border-[#D9E2E1] p-8 sm:p-10 rounded-3xl text-[#0D1B2A] relative overflow-hidden shadow-xs">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#DDF5EE] text-[#087F5B] text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-[#00A878]/30">
              <Layers className="w-4 h-4 text-[#087F5B]" />
              <span>Soluții Complete pe Cheie CodeBau</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0D1B2A] leading-tight">
              Nu cumpăra doar produse. Rezolvă întreaga lucrare.
            </h1>
            <p className="text-[#5C6670] text-sm leading-relaxed font-medium">
              Alege proiectul dorit și primești automat pachetul tehnologic complet: materiale de calitate, adezivi, grunduri, chituri, scule și opțiunea de a adăuga un meșter autorizat din sudul Moldovei.
            </p>
          </div>
        </div>

        {/* ================= SOLUTIONS CARDS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_PROJECT_SOLUTIONS.map(sol => (
            <div 
              key={sol.id}
              onClick={() => setSelectedSolution(sol)}
              className={`bg-white border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xs ${
                selectedSolution.id === sol.id 
                  ? 'border-[#087F5B] ring-2 ring-[#00A878]/30 scale-[1.01]' 
                  : 'border-[#D9E2E1] hover:border-[#087F5B]/50'
              }`}
            >
              <div className="relative aspect-video">
                <img src={sol.image} alt={sol.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[#DDF5EE] text-[#087F5B] font-extrabold text-[10px] px-2.5 py-1 rounded-lg border border-[#00A878]/30 shadow-xs">
                  {sol.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-[#0D1B2A]">
                <div>
                  <h3 className="font-extrabold text-base text-[#0D1B2A] line-clamp-1">{sol.title}</h3>
                  <p className="text-xs text-[#5C6670] line-clamp-2 mt-1.5 leading-relaxed font-medium">{sol.description}</p>
                </div>

                <div className="pt-3 border-t border-[#D9E2E1] flex items-center justify-between text-xs">
                  <span className="text-[#5C6670]">Durată: <strong className="text-[#0D1B2A]">{sol.estimatedDays} zile</strong></span>
                  <span className="text-[#087F5B] font-black">de la {sol.economicEstimate} MDL</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= SELECTED SOLUTION DETAIL WORKSPACE ================= */}
        {selectedSolution && (
          <div className="bg-white border border-[#D9E2E1] p-6 sm:p-8 rounded-3xl text-[#0D1B2A] space-y-6 shadow-xs">
            
            {addedMsg && (
              <div className="bg-[#DDF5EE] border border-[#00A878]/40 text-[#087F5B] p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                <Check className="w-5 h-5 text-[#087F5B]" />
                <span>{addedMsg}</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#D9E2E1] pb-6 gap-4">
              <div>
                <span className="text-xs font-extrabold text-[#087F5B] uppercase tracking-wider">Proiect Selectat</span>
                <h2 className="text-2xl font-black text-[#0D1B2A]">{selectedSolution.title}</h2>
                <p className="text-xs text-[#5C6670] mt-1 max-w-2xl font-medium leading-relaxed">{selectedSolution.description}</p>
              </div>

              {/* Budget Selector Pill */}
              <div className="bg-[#F8FAF9] p-1.5 rounded-2xl border border-[#D9E2E1] flex text-xs font-bold">
                {(['economic', 'standard', 'premium'] as BudgetTier[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={`px-4 py-2 rounded-xl uppercase transition-all cursor-pointer ${
                      tier === t 
                        ? 'bg-[#087F5B] text-white font-extrabold shadow-xs' 
                        : 'text-[#5C6670] hover:text-[#0D1B2A]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Technological Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#5C6670] uppercase tracking-wider">Etapele Tehnologice ale Lucrării:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedSolution.steps.map((step, idx) => (
                  <div key={idx} className="bg-[#F8FAF9] p-4 rounded-2xl border border-[#D9E2E1] space-y-1">
                    <span className="text-[10px] font-black text-[#087F5B] uppercase">Pasul {idx + 1}</span>
                    <h5 className="font-extrabold text-xs text-[#0D1B2A]">{step.title}</h5>
                    <p className="text-[11px] text-[#5C6670] leading-relaxed font-medium">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Items Included */}
            <div className="space-y-3 pt-4 border-t border-[#D9E2E1]">
              <h4 className="text-xs font-extrabold text-[#5C6670] uppercase tracking-wider">
                Produsele Incluse în Pachetul Nivel {tier.toUpperCase()}:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentProducts.map(prod => (
                  <div key={prod.id} className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-[#D9E2E1] flex items-center gap-3 text-xs">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-xl border border-[#D9E2E1]" />
                    <div>
                      <p className="text-[10px] text-[#087F5B] font-extrabold">{prod.brand}</p>
                      <h5 className="font-extrabold text-[#0D1B2A] line-clamp-1">{prod.name}</h5>
                      <p className="text-xs font-black text-[#087F5B] mt-0.5">{prod.priceRetail.toFixed(2)} MDL / {prod.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-[#D9E2E1] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#5C6670] uppercase font-extrabold">Cost Estimativ Pachet Complet ({tier.toUpperCase()})</p>
                <p className="text-3xl font-black text-[#087F5B]">{currentEstimate.toFixed(2)} MDL</p>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddSolutionPackage}
                  className="flex-1 sm:flex-initial bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span>Adaugă Tot Pachetul în Coș ({currentEstimate.toFixed(2)} MDL)</span>
                </button>

                <button
                  onClick={onSelectCraftsman}
                  className="bg-[#EFFAF6] hover:bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 px-5 py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Solicită Meșter</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
