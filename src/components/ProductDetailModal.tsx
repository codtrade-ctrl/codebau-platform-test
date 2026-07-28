import React, { useState } from 'react';
import { Product, UserRole } from '../types';
import { X, ShoppingCart, Star, ShieldCheck, FileText, Calculator, Check, ArrowRight, Store, Wrench, Sparkles, Tag, Info, Calendar } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { PromotionService } from '../services/PromotionService';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  currentRole: UserRole;
  selectedStore: string;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenCraftsmen: () => void;
  onGoToFullPage?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  currentRole,
  selectedStore,
  onAddToCart,
  onOpenCraftsmen,
  onGoToFullPage
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [areaInput, setAreaInput] = useState(25); // 25 m² default
  const [activeTab, setActiveTab] = useState<'overview' | 'calc' | 'complementary' | 'specs'>('overview');
  const [showTermsModal, setShowTermsModal] = useState(false);

  const showProPrice = currentRole === 'meister' || currentRole === 'b2b';
  const basePrice = showProPrice ? product.pricePro : product.priceRetail;

  const effectivePrice = PromotionService.calculateEffectivePrice({
    product,
    basePrice,
    userRole: currentRole,
    selectedStore,
    quantity
  });

  const isNew = PromotionService.isNewProduct(product);
  const finalUnitPrice = effectivePrice.isPromoActive ? effectivePrice.promotionalPrice : basePrice;

  // Calculate needed quantity if product has consumption per m2
  const calculatedNeeded = product.consumptionPerSqM 
    ? Math.ceil((areaInput * product.consumptionPerSqM) / 25) // assuming 25kg per sac
    : Math.ceil(areaInput);

  // Complementary products
  const complementaryProducts = MOCK_PRODUCTS.filter(p => 
    product.complementaryIds?.includes(p.id) || (p.category === product.category && p.id !== product.id)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-[#D9E2E1] text-[#0D1B2A] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-[#F8FAF9] hover:bg-[#E9ECEF] text-[#5C6670] hover:text-[#0D1B2A] p-2 rounded-full border border-[#D9E2E1] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-[#D9E2E1]">
          
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-[#F8FAF9] aspect-square border border-[#D9E2E1]">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-col items-start gap-1 z-10">
              <div className="flex flex-wrap gap-1">
                {effectivePrice.isPromoActive && (
                  <span className="bg-[#F4B400] text-[#0D1B2A] font-black text-xs px-2.5 py-1 rounded-lg uppercase shadow-xs flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 fill-current" />
                    {effectivePrice.badgeText || 'PROMOȚIE'}
                  </span>
                )}
                {isNew && (
                  <span className="bg-[#DDF5EE] text-[#087F5B] font-extrabold text-xs px-2.5 py-1 rounded-lg border border-[#087F5B]/30 uppercase shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    NOUTATE
                  </span>
                )}
              </div>
              <span className="bg-white/95 text-[#087F5B] font-extrabold text-xs px-2.5 py-1 rounded-lg border border-[#D9E2E1] backdrop-blur-sm shadow-xs">
                {product.brand} • Garanție {product.warrantyYears} Ani
              </span>
            </div>
          </div>

          {/* Core Summary Info */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <p className="text-xs font-mono text-[#5C6670] font-medium">SKU: {product.sku} | Barcode: {product.barcode}</p>
              <h2 className="text-xl font-black text-[#0D1B2A] mt-1 leading-snug">{product.name}</h2>
              
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-[#087F5B] text-sm font-extrabold">
                  <Star className="w-4 h-4 fill-current mr-1 text-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-[#5C6670] text-xs font-normal ml-1">({product.reviewCount} recenzii verificate)</span>
                </div>
              </div>

              {/* Price display with Promotional Support */}
              <div className="mt-4 p-4 bg-[#F8FAF9] rounded-2xl border border-[#D9E2E1] space-y-1.5">
                <p className="text-xs text-[#5C6670] font-extrabold uppercase tracking-wider">
                  {effectivePrice.isPromoActive ? 'Preț Promoțional CodeBau' : showProPrice ? 'Preț Profesional (Meister Club / B2B)' : 'Preț Persoană Fizică'}
                </p>

                {effectivePrice.isPromoActive ? (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-[#5C6670] line-through font-bold">{effectivePrice.basePrice.toFixed(2)} MDL</span>
                      <span className="text-xs bg-[#DDF5EE] text-[#087F5B] font-extrabold px-1.5 py-0.5 rounded">
                        −{effectivePrice.discountPercentage}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#0D1B2A]">{effectivePrice.promotionalPrice.toFixed(2)}</span>
                      <span className="text-sm font-bold text-[#5C6670]">MDL / {product.unit}</span>
                    </div>
                    <p className="text-xs text-[#087F5B] font-extrabold mt-1">
                      Economisești {effectivePrice.discountAmount.toFixed(2)} MDL per unitate!
                    </p>
                    {effectivePrice.validUntil && (
                      <p className="text-[11px] text-[#5C6670] flex items-center gap-1 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-[#087F5B]" />
                        Promoție valabilă până la {effectivePrice.validUntil}
                      </p>
                    )}
                    <button
                      onClick={() => setShowTermsModal(true)}
                      className="text-xs text-[#087F5B] hover:underline font-extrabold mt-1 flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Vezi condițiile promoției
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-black text-[#0D1B2A]">{basePrice.toFixed(2)}</span>
                      <span className="text-sm font-bold text-[#5C6670]">MDL / {product.unit}</span>
                    </div>
                    {showProPrice && (
                      <p className="text-xs text-[#5C6670] mt-1">
                        Reducere activată! Preț standard de raft: <span className="line-through">{product.priceRetail.toFixed(2)} MDL</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Store Availability */}
              {(() => {
                const storeName = selectedStore || 'CodeBau Cahul';
                let stock = product.inStockCahul ?? 0;
                let storeDisplayName = 'CodeBau Cahul';
                if (storeName.includes('Cantemir')) {
                  stock = product.inStockCantemir ?? 0;
                  storeDisplayName = 'CodeBau Cantemir';
                } else if (storeName.includes('Vulcănești') || storeName.includes('Vulcanesti')) {
                  stock = product.inStockVulcanesti ?? 0;
                  storeDisplayName = 'CodeBau Vulcănești';
                } else if (storeName.includes('Taraclia')) {
                  stock = product.inStockTaraclia ?? 0;
                  storeDisplayName = 'CodeBau Taraclia';
                }

                return (
                  <div className="mt-3 text-xs bg-[#EFFAF6] text-[#087F5B] border border-[#00A878]/30 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#00A878]" />
                      <span>Magazin: <strong>{storeDisplayName}</strong></span>
                    </div>
                    {stock > 0 ? (
                      <span className="font-extrabold text-[#087F5B]">
                        {stock} {product.unit} în stoc
                      </span>
                    ) : (
                      <span className="font-extrabold text-amber-700">
                        Disponibil la comandă din CodeBau Cahul (1–2 zile)
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Quantity Selector & Add to Cart Action */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#0D1B2A]">Cantitate:</span>
                <div className="flex items-center bg-[#F8FAF9] rounded-xl border border-[#D9E2E1] p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-[#E9ECEF] text-[#0D1B2A] font-extrabold text-sm flex items-center justify-center border border-[#D9E2E1] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-extrabold text-sm text-[#0D1B2A]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-[#E9ECEF] text-[#0D1B2A] font-extrabold text-sm flex items-center justify-center border border-[#D9E2E1] cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#5C6670]">Total: <strong className="text-[#0D1B2A]">{(finalUnitPrice * quantity).toFixed(2)} MDL</strong></span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-white" />
                  Adaugă în coș
                </button>

                {onGoToFullPage && (
                  <button
                    onClick={() => {
                      onGoToFullPage(product);
                      onClose();
                    }}
                    className="bg-white hover:bg-[#F8FAF9] text-[#0D1B2A] font-extrabold px-4 py-3 rounded-xl border-2 border-[#0D1B2A] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Vezi pagina completă</span>
                    <ArrowRight className="w-4 h-4 text-[#087F5B]" />
                  </button>
                )}

                <button
                  onClick={onOpenCraftsmen}
                  className="bg-[#DDF5EE] hover:bg-[#cbf1e5] text-[#087F5B] border border-[#00A878]/30 px-3 py-3 rounded-xl font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                  title="Solicită meșter pentru montaj"
                >
                  <Wrench className="w-4 h-4" />
                  <span className="hidden sm:inline">Caută Meșter</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#D9E2E1] px-6 bg-[#F8FAF9] text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${activeTab === 'overview' ? 'border-[#087F5B] text-[#087F5B] font-extrabold' : 'border-transparent text-[#5C6670] hover:text-[#0D1B2A]'}`}
          >
            Descriere & Utilizare
          </button>
          
          {product.consumptionPerSqM && (
            <button
              onClick={() => setActiveTab('calc')}
              className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${activeTab === 'calc' ? 'border-[#087F5B] text-[#087F5B] font-extrabold' : 'border-transparent text-[#087F5B] hover:text-[#066B4D]'}`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Calculator de Consum per Suprafață
            </button>
          )}

          <button
            onClick={() => setActiveTab('complementary')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${activeTab === 'complementary' ? 'border-[#087F5B] text-[#087F5B] font-extrabold' : 'border-transparent text-[#5C6670] hover:text-[#0D1B2A]'}`}
          >
            Sistem Recomandat (Compatibile)
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${activeTab === 'specs' ? 'border-[#087F5B] text-[#087F5B] font-extrabold' : 'border-transparent text-[#5C6670] hover:text-[#0D1B2A]'}`}
          >
            Specificații & Fișă Tehnică
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-sm text-[#5C6670]">
              <p className="leading-relaxed">{product.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#D9E2E1]">
                  <h4 className="font-extrabold text-[#0D1B2A] mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#00A878]" />
                    Utilizare și Destinație
                  </h4>
                  <p className="text-xs text-[#5C6670]">
                    Produs recomandat pentru utilizare <strong>{product.destination === 'both' ? 'atât la Interior cât și la Exterior' : product.destination}</strong>.
                  </p>
                </div>

                <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#D9E2E1]">
                  <h4 className="font-extrabold text-[#0D1B2A] mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#087F5B]" />
                    Garanție & Declarație Conformitate
                  </h4>
                  <p className="text-xs text-[#5C6670]">
                    Certificat de calitate ISO9001 inclus. Garanție digitală salvată automat în contul CodeBau după achiziție.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Consumption Calculator */}
          {activeTab === 'calc' && product.consumptionPerSqM && (
            <div className="space-y-4">
              <div className="bg-[#EFFAF6] p-5 rounded-2xl border border-[#00A878]/30 space-y-4">
                <div className="flex items-center gap-2 text-[#087F5B] font-extrabold text-sm">
                  <Calculator className="w-5 h-5" />
                  <span>Calculator Inteligent de Necesar Materiale CodeBau</span>
                </div>

                <p className="text-xs text-[#5C6670]">
                  Introdu suprafața lucrării în m² pentru a afla instantaneu cantitatea necesară, plus marja recomandată de pierderi (10%).
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                      Suprafață de lucrat (m²):
                    </label>
                    <input 
                      type="number"
                      value={areaInput}
                      onChange={(e) => setAreaInput(Number(e.target.value) || 1)}
                      className="w-full bg-white border border-[#BCC9C6] rounded-xl px-4 py-2.5 font-bold text-[#0D1B2A] text-lg focus:border-[#087F5B] focus:outline-none focus:ring-2 focus:ring-[#087F5B]/20"
                    />
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#D9E2E1] flex-1 w-full text-center sm:text-left">
                    <p className="text-xs text-[#5C6670]">Consum specific de fișă:</p>
                    <p className="text-sm font-extrabold text-[#0D1B2A]">{product.consumptionPerSqM} {product.consumptionUnit}</p>
                    <p className="text-xs text-[#087F5B] font-black mt-1">
                      Necesar sugerat: {calculatedNeeded} unități ({product.unit})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setQuantity(calculatedNeeded);
                    onAddToCart(product, calculatedNeeded);
                    onClose();
                  }}
                  className="w-full bg-[#087F5B] hover:bg-[#066B4D] text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Adaugă în coș cantitatea calculată ({calculatedNeeded} x {product.unit})
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Complementary Products System */}
          {activeTab === 'complementary' && (
            <div className="space-y-4">
              <p className="text-xs text-[#5C6670]">
                Pachetul tehnologic complet recomandat de specialiștii CodeBau pentru lucrare impecabilă:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {complementaryProducts.map(comp => (
                  <div key={comp.id} className="bg-white p-3 rounded-2xl border border-[#D9E2E1] flex flex-col justify-between">
                    <div>
                      <img src={comp.image} alt={comp.name} className="w-full h-24 object-cover rounded-xl mb-2 border border-[#D9E2E1]" />
                      <p className="text-[10px] text-[#087F5B] font-bold">{comp.brand}</p>
                      <h5 className="text-xs font-extrabold text-[#0D1B2A] line-clamp-2">{comp.name}</h5>
                      <p className="text-xs font-black text-[#087F5B] mt-2">{comp.priceRetail.toFixed(2)} MDL / {comp.unit}</p>
                    </div>
                    <button
                      onClick={() => onAddToCart(comp, 1)}
                      className="w-full mt-3 bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-white" />
                      Adaugă
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Specs Table */}
          {activeTab === 'specs' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-[#D9E2E1] overflow-hidden text-xs">
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <div key={key} className={`flex justify-between p-3 ${idx % 2 === 0 ? 'bg-[#F8FAF9]' : 'bg-white'}`}>
                    <span className="text-[#5C6670] font-medium">{key}</span>
                    <span className="text-[#0D1B2A] font-extrabold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Promo Terms Modal Overlay */}
        {showTermsModal && effectivePrice.isPromoActive && (
          <div className="fixed inset-0 z-60 bg-[#0D1B2A]/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#D9E2E1] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-150">
              <button 
                onClick={() => setShowTermsModal(false)}
                className="absolute top-4 right-4 bg-[#F8FAF9] hover:bg-[#E9ECEF] text-[#5C6670] p-1.5 rounded-full border border-[#D9E2E1] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-amber-600 font-black text-base">
                <Tag className="w-5 h-5 fill-current" />
                <span>Condiții & Regulament Promoție</span>
              </div>

              <div className="space-y-3 text-xs text-[#0D1B2A]">
                <div className="bg-[#EFFAF6] p-3 rounded-xl border border-[#00A878]/30">
                  <p className="font-extrabold text-[#087F5B] text-sm">{effectivePrice.promotionName || 'Promoție Activă'}</p>
                  <p className="text-[#5C6670] mt-1">{effectivePrice.terms || 'Reducere aplicată automat la îndeplinirea condițiilor de stoc și cantitate.'}</p>
                </div>

                <div className="space-y-2 divide-y divide-[#D9E2E1]">
                  <div className="pt-2 flex justify-between">
                    <span className="text-[#5C6670]">Perioadă valabilitate:</span>
                    <span className="font-extrabold">
                      Până la {effectivePrice.validUntil || 'Dată nedeterminată'}
                    </span>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <span className="text-[#5C6670]">Beneficiu aplicat:</span>
                    <span className="font-extrabold text-[#087F5B]">
                      −{effectivePrice.discountAmount.toFixed(2)} MDL / {product.unit} ({effectivePrice.discountPercentage}% economie)
                    </span>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <span className="text-[#5C6670]">Aplicabil pentru roluri:</span>
                    <span className="font-bold">
                      Retail, Meister Club & Parteneri B2B
                    </span>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <span className="text-[#5C6670]">Magazine eligibile:</span>
                    <span className="font-bold">
                      {selectedStore} și toate magazinele CodeBau
                    </span>
                  </div>

                  {effectivePrice.maxQuantityPerCustomer && (
                    <div className="pt-2 flex justify-between">
                      <span className="text-[#5C6670]">Limită per client:</span>
                      <span className="font-extrabold text-amber-700">
                        Max. {effectivePrice.maxQuantityPerCustomer} {product.unit}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-[#5C6670] italic pt-2">
                  * Reducerea se aplică automat în coș. CodeBau își rezervă dreptul de a modifica promoțiile în funcție de stocul disponibil la magazinul selectat.
                </p>
              </div>

              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Am înțeles
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

