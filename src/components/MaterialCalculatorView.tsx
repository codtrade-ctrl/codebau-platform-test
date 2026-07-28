import React, { useState } from 'react';
import { Product, BudgetTier, CartItem } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';
import { Calculator, Check, ArrowRight, ShoppingCart, Share2, Save, Wrench, Sparkles, Layers, DollarSign, Clock, ShieldCheck, FileText } from 'lucide-react';

interface MaterialCalculatorViewProps {
  onAddMultipleToCart: (items: CartItem[]) => void;
  onSelectCraftsman: () => void;
  onSaveProject: (title: string, items: CartItem[], budget: number) => void;
}

export const MaterialCalculatorView: React.FC<MaterialCalculatorViewProps> = ({
  onAddMultipleToCart,
  onSelectCraftsman,
  onSaveProject
}) => {
  const [projectType, setProjectType] = useState<'gresie' | 'zugravire' | 'termoizolatie' | 'parchet'>('gresie');
  const [areaSqM, setAreaSqM] = useState<number>(30);
  const [wasteBufferPercent, setWasteBufferPercent] = useState<number>(10);
  const [tier, setTier] = useState<BudgetTier>('standard');

  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  // Calculate items dynamically
  const adjustedArea = areaSqM * (1 + wasteBufferPercent / 100);

  let primaryProduct: Product = MOCK_PRODUCTS[4]; // Gresie
  let adhesiveProduct: Product = MOCK_PRODUCTS[0]; // Adeziv CM17
  let primerProduct: Product = MOCK_PRODUCTS[2]; // Grund CT17
  let groutProduct: Product = MOCK_PRODUCTS[3]; // Chit Ultracolor

  if (projectType === 'zugravire') {
    primaryProduct = MOCK_PRODUCTS[5]; // Savana Vopsea
    primerProduct = MOCK_PRODUCTS[2]; // Grund
  } else if (projectType === 'termoizolatie') {
    primaryProduct = MOCK_PRODUCTS[7]; // Polistiren
    adhesiveProduct = MOCK_PRODUCTS[0];
    primerProduct = MOCK_PRODUCTS[2];
  }

  // Quantities
  const primaryUnits = Math.ceil(adjustedArea / (projectType === 'zugravire' ? 12 : projectType === 'termoizolatie' ? 2.5 : 1.44));
  const adhesiveUnits = Math.ceil((adjustedArea * 4.5) / 25);
  const primerUnits = Math.ceil((adjustedArea * 0.15) / 10);
  const groutUnits = Math.ceil((adjustedArea * 0.35) / 5);

  const priceMultiplier = tier === 'premium' ? 1.25 : tier === 'economic' ? 0.85 : 1.0;

  const primaryPrice = (primaryProduct.priceRetail * priceMultiplier) * primaryUnits;
  const adhesivePrice = projectType !== 'zugravire' ? (adhesiveProduct.priceRetail * priceMultiplier) * adhesiveUnits : 0;
  const primerPrice = (primerProduct.priceRetail * priceMultiplier) * primerUnits;
  const groutPrice = projectType === 'gresie' ? (groutProduct.priceRetail * priceMultiplier) * groutUnits : 0;

  const totalCalculatedCost = primaryPrice + adhesivePrice + primerPrice + groutPrice;
  const estimatedDays = Math.max(1, Math.ceil(areaSqM / 15));

  const generatedItems: CartItem[] = [
    { product: primaryProduct, quantity: primaryUnits, appliedPrice: primaryProduct.priceRetail * priceMultiplier },
    ...(adhesivePrice > 0 ? [{ product: adhesiveProduct, quantity: adhesiveUnits, appliedPrice: adhesiveProduct.priceRetail * priceMultiplier }] : []),
    { product: primerProduct, quantity: primerUnits, appliedPrice: primerProduct.priceRetail * priceMultiplier },
    ...(groutPrice > 0 ? [{ product: groutProduct, quantity: groutUnits, appliedPrice: groutProduct.priceRetail * priceMultiplier }] : [])
  ];

  const handleAddToCart = () => {
    onAddMultipleToCart(generatedItems);
    setSavedSuccessMsg('✅ Toate materialele au fost adăugate în coș!');
    setTimeout(() => setSavedSuccessMsg(''), 4000);
  };

  const handleSaveProjectInternal = () => {
    onSaveProject(`Proiect ${projectType.toUpperCase()} - ${areaSqM} m²`, generatedItems, totalCalculatedCost);
    setSavedSuccessMsg('💾 Proiect salvat în contul tău CodeBau!');
    setTimeout(() => setSavedSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-white via-[#EFFAF6] to-[#E9ECEF] border border-[#D9E2E1] p-8 rounded-3xl text-[#0D1B2A] relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A878]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#DDF5EE] text-[#087F5B] text-xs font-black px-3.5 py-1.5 rounded-xl border border-[#00A878]/30">
            <Calculator className="w-4 h-4" />
            <span>Motorul de Calcul Tehnologic CodeBau</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-[#0D1B2A]">
            Calculatorul Gratuit de Materiale și Costuri
          </h1>
          <p className="text-[#5C6670] text-sm font-medium leading-relaxed">
            Alege lucrarea, introdu suprafața și sistemul va calcula automat cantitatea de material principal, adezivul, grundul, chitul și sculele necesare — fără risipă și fără drumuri suplimentare la magazin.
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs vs Real-time Calculated Estimate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT 5 COLS: Controls */}
        <div className="lg:col-span-5 bg-white border border-[#D9E2E1] p-6 rounded-3xl text-[#0D1B2A] space-y-6 shadow-sm">
          
          <h3 className="text-lg font-extrabold flex items-center gap-2 text-[#0D1B2A]">
            <Layers className="w-5 h-5 text-[#087F5B]" />
            1. Selectează Lucrarea
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => setProjectType('gresie')}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-20 cursor-pointer ${
                projectType === 'gresie' ? 'bg-[#087F5B] text-white border-[#087F5B] font-extrabold shadow-sm' : 'bg-[#F8FAF9] text-[#0D1B2A] border-[#D9E2E1] hover:border-[#00A878]'
              }`}
            >
              <span>Montare Gresie & Faianță</span>
              <span className="text-[10px] opacity-80">Adeziv, grund, chit</span>
            </button>

            <button
              onClick={() => setProjectType('zugravire')}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-20 cursor-pointer ${
                projectType === 'zugravire' ? 'bg-[#087F5B] text-white border-[#087F5B] font-extrabold shadow-sm' : 'bg-[#F8FAF9] text-[#0D1B2A] border-[#D9E2E1] hover:border-[#00A878]'
              }`}
            >
              <span>Zugrăvire Pereți</span>
              <span className="text-[10px] opacity-80">Amorsă, glet, lavabilă</span>
            </button>

            <button
              onClick={() => setProjectType('termoizolatie')}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-20 cursor-pointer ${
                projectType === 'termoizolatie' ? 'bg-[#087F5B] text-white border-[#087F5B] font-extrabold shadow-sm' : 'bg-[#F8FAF9] text-[#0D1B2A] border-[#D9E2E1] hover:border-[#00A878]'
              }`}
            >
              <span>Termoizolație Fațadă</span>
              <span className="text-[10px] opacity-80">Polistiren, plasă, dibluri</span>
            </button>

            <button
              onClick={() => setProjectType('parchet')}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-20 cursor-pointer ${
                projectType === 'parchet' ? 'bg-[#087F5B] text-white border-[#087F5B] font-extrabold shadow-sm' : 'bg-[#F8FAF9] text-[#0D1B2A] border-[#D9E2E1] hover:border-[#00A878]'
              }`}
            >
              <span>Montare Parchet</span>
              <span className="text-[10px] opacity-80">Folie, plintă, conectori</span>
            </button>
          </div>

          <div className="space-y-4 pt-2 border-t border-[#D9E2E1]">
            <h3 className="text-sm font-extrabold flex items-center justify-between text-[#0D1B2A]">
              <span>2. Suprafața de Lucrat (m²)</span>
              <span className="text-[#087F5B] font-black text-lg">{areaSqM} m²</span>
            </h3>

            <input 
              type="range"
              min={5}
              max={300}
              step={5}
              value={areaSqM}
              onChange={(e) => setAreaSqM(Number(e.target.value))}
              className="w-full accent-[#087F5B] bg-[#E9ECEF] h-2 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs text-[#5C6670] font-medium">
              <span>5 m² (Baie mică)</span>
              <span>100 m² (Apartament)</span>
              <span>300 m² (Casă)</span>
            </div>
          </div>

          {/* Waste buffer % */}
          <div className="space-y-2 pt-2 border-t border-[#D9E2E1]">
            <label className="block text-xs font-bold text-[#0D1B2A]">
              3. Marjă Recomandată de Pierderi / Tăieturi:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[5, 10, 15].map(b => (
                <button
                  key={b}
                  onClick={() => setWasteBufferPercent(b)}
                  className={`py-2 rounded-xl border font-extrabold transition-all cursor-pointer ${
                    wasteBufferPercent === b ? 'bg-[#087F5B] text-white border-[#087F5B]' : 'bg-[#F8FAF9] text-[#0D1B2A] border-[#D9E2E1]'
                  }`}
                >
                  +{b}% Marjă
                </button>
              ))}
            </div>
          </div>

          {/* Budget Quality Level */}
          <div className="space-y-2 pt-2 border-t border-[#D9E2E1]">
            <label className="block text-xs font-bold text-[#0D1B2A]">
              4. Nivelul de Calitate / Buget:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['economic', 'standard', 'premium'] as BudgetTier[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`py-2.5 rounded-xl border font-extrabold uppercase transition-all cursor-pointer ${
                    tier === t ? 'bg-[#087F5B] text-white border-[#087F5B] shadow-sm' : 'bg-[#F8FAF9] text-[#5C6670] border-[#D9E2E1]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT 7 COLS: Results & Action Summary */}
        <div className="lg:col-span-7 space-y-6">
          
          {savedSuccessMsg && (
            <div className="bg-[#EFFAF6] border border-[#00A878] text-[#087F5B] p-4 rounded-2xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-5 h-5 text-[#00A878]" />
              <span>{savedSuccessMsg}</span>
            </div>
          )}

          <div className="bg-white border border-[#D9E2E1] p-6 rounded-3xl text-[#0D1B2A] space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#D9E2E1] pb-4 gap-4">
              <div>
                <p className="text-xs text-[#5C6670] uppercase tracking-wider font-extrabold">Rezultat Calcul Automat</p>
                <h2 className="text-xl font-extrabold text-[#0D1B2A]">
                  Deviz Necesar {projectType.toUpperCase()} ({adjustedArea.toFixed(1)} m² inclus marjă +{wasteBufferPercent}%)
                </h2>
              </div>

              <div className="bg-[#EFFAF6] p-3 rounded-2xl border border-[#00A878]/30 text-right shrink-0">
                <p className="text-[10px] text-[#5C6670] uppercase font-bold">Cost Estimativ Materiale</p>
                <p className="text-2xl font-black text-[#087F5B]">{totalCalculatedCost.toFixed(2)} MDL</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-3">
              <p className="text-xs text-[#5C6670] font-extrabold uppercase tracking-wider">
                Lista de Materiale Recomandate
              </p>

              <div className="space-y-2">
                {generatedItems.map((item, idx) => (
                  <div key={idx} className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-[#D9E2E1] flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl border border-[#D9E2E1]" />
                      <div>
                        <p className="text-[10px] text-[#087F5B] font-bold uppercase">{item.product.brand}</p>
                        <h4 className="font-extrabold text-[#0D1B2A] line-clamp-1">{item.product.name}</h4>
                        <p className="text-[#5C6670] text-[11px] mt-0.5">
                          Cantitate: <strong className="text-[#0D1B2A]">{item.quantity} {item.product.unit}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right whitespace-nowrap">
                      <p className="font-black text-[#087F5B] text-sm">{(item.appliedPrice * item.quantity).toFixed(2)} MDL</p>
                      <p className="text-[10px] text-[#5C6670] font-medium">{item.appliedPrice.toFixed(2)} / unit</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time estimation and guarantee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#D9E2E1]">
              <div className="bg-[#F8FAF9] p-3 rounded-xl border border-[#D9E2E1] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#087F5B]" />
                <span>Timp estimativ execuție: <strong>{estimatedDays} {estimatedDays === 1 ? 'zi' : 'zile'}</strong></span>
              </div>
              <div className="bg-[#F8FAF9] p-3 rounded-xl border border-[#D9E2E1] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00A878]" />
                <span>Garanție materiale: <strong>Până la 10 Ani</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-3 border-t border-[#D9E2E1]">
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#087F5B] hover:bg-[#066B4D] active:scale-[0.98] text-white font-extrabold py-3.5 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                Adaugă Toate Materialele în Coș ({totalCalculatedCost.toFixed(2)} MDL)
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={onSelectCraftsman}
                  className="bg-[#DDF5EE] hover:bg-[#cbf1e5] text-[#087F5B] border border-[#00A878]/30 py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  Trimite Devizul unui Meșter
                </button>

                <button
                  onClick={handleSaveProjectInternal}
                  className="bg-white hover:bg-[#F8FAF9] text-[#0D1B2A] border-2 border-[#0D1B2A] py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#087F5B]" />
                  Salvează ca Proiect
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
