import React, { useState, useEffect, useRef } from 'react';
import { Product, UserRole, CodeBauStore } from '../types';
import { MOCK_STORES, MOCK_PRODUCTS } from '../data/mockData';
import { formatPriceMDL, getProductSlug } from '../utils/formatters';
import { ProductImage } from './ProductImage';
import { PromotionService } from '../services/PromotionService';
import { 
  ChevronRight, Star, ShieldCheck, CheckCircle2, Truck, Store, MapPin, 
  ShoppingCart, Heart, Calculator, Wrench, Sparkles, ArrowRight, Minus, 
  Plus, Check, Share2, Info, FileText, Download, MessageSquare, ThumbsUp, 
  Eye, Layers, AlertCircle, Maximize2, X, ChevronLeft, HelpCircle,
  CheckSquare, Square, PackageCheck, RefreshCw, Tag, Calendar
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  userRole: UserRole;
  selectedStore: string;
  onAddToCart: (p: Product, qty?: number) => void;
  onToggleFavorite: (p: Product) => void;
  isFavorite: boolean;
  onNavigateToProduct: (slug: string) => void;
  onBackToCatalog: () => void;
  onOpenAIAssistant: (initialPrompt?: string) => void;
  onOpenMeisterConnect?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  userRole,
  selectedStore,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  onNavigateToProduct,
  onBackToCatalog,
  onOpenAIAssistant,
  onOpenMeisterConnect
}) => {
  // State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isStoresModalOpen, setIsStoresModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'descriere' | 'caracteristici' | 'utilizare' | 'documente' | 'livrare' | 'recenzii'>('descriere');
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Ref for IntersectionObserver on main buy button
  const mainBuyButtonRef = useRef<HTMLButtonElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Calculator state
  const [calcArea, setCalcArea] = useState<number>(20);
  const [calcTileType, setCalcTileType] = useState('gresie-portelanata');
  const [calcTileSize, setCalcTileSize] = useState('60x60');

  // Recently viewed handling
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    // Reset image index when product changes
    setActiveImageIndex(0);

    // Save to recently viewed local storage
    try {
      const stored = localStorage.getItem('codebau_recently_viewed');
      let items: Product[] = stored ? JSON.parse(stored) : [];
      items = items.filter(p => p.id !== product.id);
      items.unshift(product);
      items = items.slice(0, 6);
      localStorage.setItem('codebau_recently_viewed', JSON.stringify(items));
      setRecentlyViewed(items.filter(p => p.id !== product.id));
    } catch (e) {
      console.error(e);
    }
  }, [product.id]);

  // Intersection Observer for sticky buy bar on mobile
  useEffect(() => {
    const el = mainBuyButtonRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setShowStickyBar(scrolledPast);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [product.id]);

  // Gallery image selector from product.images or fallbacks
  const galleryImages = (product.images && product.images.length > 0)
    ? product.images
    : [
        { url: product.image, alt: product.name, type: 'product' as const },
        { url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1000&auto=format&fit=crop&q=80', alt: 'Ambalaj produs', type: 'packaging' as const },
        { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80', alt: 'Aplicare pe șantier', type: 'application' as const },
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80', alt: 'Suprafață finisată', type: 'result' as const }
      ];

  // Stock calculations for current store
  const storeObj = MOCK_STORES.find(s => s.name === selectedStore) || MOCK_STORES[0];
  let currentStock = product.inStockCahul ?? 0;
  if (selectedStore.includes('Cantemir')) currentStock = product.inStockCantemir ?? 0;
  if (selectedStore.includes('Vulcănești') || selectedStore.includes('Vulcanesti')) currentStock = product.inStockVulcanesti ?? 0;
  if (selectedStore.includes('Taraclia')) currentStock = product.inStockTaraclia ?? 0;

  // Price & Promotion calculations
  const isProRole = userRole === 'meister' || userRole === 'b2b';
  const baseUnitPrice = isProRole ? product.pricePro : product.priceRetail;

  const effectivePrice = PromotionService.calculateEffectivePrice({
    product,
    basePrice: baseUnitPrice,
    userRole,
    selectedStore,
    quantity
  });

  const isNew = PromotionService.isNewProduct(product);
  const unitPrice = effectivePrice.isPromoActive ? effectivePrice.promotionalPrice : baseUnitPrice;
  const totalPrice = unitPrice * quantity;
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Calculation logic for Consumption Calculator
  const factorSize = calcTileSize === '120x60' ? 1.2 : calcTileSize === '80x80' ? 1.1 : 1.0;
  const rawKgNeeded = calcArea * (product.consumptionPerSqM || 4.5) * factorSize;
  const totalKgWithReserve = rawKgNeeded * 1.10; // +10% reserve
  const calculatedBags = Math.ceil(totalKgWithReserve / 25) || 1;
  const calculatedCost = calculatedBags * unitPrice;

  // ----------------------------------------------------
  // Complementary Products ("Completează lucrarea")
  // ----------------------------------------------------
  const compProductIds = product.complementaryProductIds || ['prod-3', 'prod-2', 'prod-4', 'prod-spacers', 'prod-trowel'];
  const complementaryProducts = MOCK_PRODUCTS.filter(p => compProductIds.includes(p.id) && p.id !== product.id);

  // Default checked complementary items
  const [selectedComplementary, setSelectedComplementary] = useState<string[]>(
    complementaryProducts.slice(0, 3).map(p => p.id)
  );

  const toggleComplementary = (id: string) => {
    setSelectedComplementary(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectedCompItems = complementaryProducts.filter(p => selectedComplementary.includes(p.id));
  const selectedCompTotal = selectedCompItems.reduce((acc, item) => {
    const price = isProRole ? item.pricePro : item.priceRetail;
    return acc + price;
  }, 0);

  const handleAddSelectedComplementary = () => {
    selectedCompItems.forEach(item => onAddToCart(item, 1));
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  // ----------------------------------------------------
  // Similar Products ("Produse similare")
  // ----------------------------------------------------
  const similarProductIds = product.relatedProductIds || ['prod-cm11', 'prod-cm16', 'prod-cm117'];
  const similarProducts = MOCK_PRODUCTS.filter(p => similarProductIds.includes(p.id) && p.id !== product.id);

  // ----------------------------------------------------
  // Recommended Project Bundle ("Pachet recomandat de proiect")
  // ----------------------------------------------------
  // Primary item qty in bundle dynamically ties to calculatedBags!
  const primaryBundleQty = calculatedBags > 0 ? calculatedBags : 4;

  const bundleConfig = [
    { id: product.id, qty: primaryBundleQty, label: `${product.brand} ${product.sku} (${primaryBundleQty} ${product.unit})` },
    { id: 'prod-3', qty: 1, label: 'Grund de Aderență CT 17 (1 bidon 10L)' },
    { id: 'prod-2', qty: 1, label: 'Hidroizolație Bicomponentă (1 set 16kg)' },
    { id: 'prod-4', qty: 1, label: 'Chit de Rosturi Impermeabil (1 pachet 5kg)' }
  ];

  let subtotalBundle = 0;
  const bundleItemsWithData = bundleConfig.map(cfg => {
    const itemData = MOCK_PRODUCTS.find(p => p.id === cfg.id) || product;
    const price = isProRole ? itemData.pricePro : itemData.priceRetail;
    subtotalBundle += price * cfg.qty;
    return { ...cfg, itemData, price };
  });

  const bundleDiscountPercent = 0.10; // 10% discount
  const bundleDiscountAmount = Math.max(0, subtotalBundle * bundleDiscountPercent);
  const bundleTotal = Math.max(0, subtotalBundle - bundleDiscountAmount);

  const handleAddBundle = () => {
    bundleItemsWithData.forEach(b => {
      onAddToCart(b.itemData, b.qty);
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  // ----------------------------------------------------
  // Accessible Tabs Keyboard Handler
  // ----------------------------------------------------
  const tabsList: Array<'descriere' | 'caracteristici' | 'utilizare' | 'documente' | 'livrare' | 'recenzii'> = [
    'descriere', 'caracteristici', 'utilizare', 'documente', 'livrare', 'recenzii'
  ];

  const handleTabKeyDown = (e: React.KeyboardEvent, currentTab: typeof activeTab) => {
    const currentIndex = tabsList.indexOf(currentTab);
    if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % tabsList.length;
      setActiveTab(tabsList[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + tabsList.length) % tabsList.length;
      setActiveTab(tabsList[prevIndex]);
    }
  };

  // Primary add handler
  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const isMockData = product.technicalDataStatus !== 'official' && product.technicalDataStatus !== 'verified';

  return (
    <div 
      className="min-h-screen bg-[#F4F7F6] text-[#0D1B2A] scroll-mt-header pt-2 overflow-x-hidden"
      style={{
        paddingBottom: 'calc(var(--mobile-nav-height, 64px) + var(--product-buybar-height, 72px) + env(safe-area-inset-bottom, 0px) + 24px)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* ================= BREADCRUMBS ================= */}
        <nav aria-label="Breadcrumb" className="pt-2">
          <ol className="flex items-center flex-wrap gap-1.5 text-xs text-[#5C6670] font-medium">
            <li>
              <button onClick={onBackToCatalog} className="hover:text-[#087F5B] transition-colors cursor-pointer">
                Acasă
              </button>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5 text-[#5C6670] shrink-0" /></li>
            <li>
              <button onClick={onBackToCatalog} className="hover:text-[#087F5B] transition-colors cursor-pointer">
                Produse
              </button>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5 text-[#5C6670] shrink-0" /></li>
            <li>
              <button onClick={onBackToCatalog} className="hover:text-[#087F5B] transition-colors cursor-pointer">
                {product.subcategory || product.category}
              </button>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5 text-[#5C6670] shrink-0" /></li>
            <li className="text-[#0D1B2A] font-extrabold truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* ================= MAIN SECTION (2-COLUMNS DESKTOP) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: GALLERY (~48%) STICKY ON DESKTOP */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-[calc(var(--header-total-height,120px)+16px)] self-start">
            
            {/* Main Image Stage */}
            <div className="relative aspect-[4/3] bg-white border border-[#D9E2E1] rounded-2xl overflow-hidden group shadow-sm">
              <ProductImage
                src={galleryImages[activeImageIndex].url}
                alt={galleryImages[activeImageIndex].alt}
                category={product.subcategory || product.category}
                aspectRatio="aspect-full h-full w-full"
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Commercial Badges */}
              <div className="absolute top-3 left-3 flex flex-col items-start gap-1 z-10">
                <div className="flex flex-wrap gap-1">
                  {effectivePrice.isPromoActive && (
                    <span className="bg-[#F4B400] text-[#0D1B2A] text-xs font-black uppercase px-2.5 py-1 rounded-lg border border-amber-600/30 shadow-xs flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 fill-current" />
                      {effectivePrice.badgeText || 'PROMOȚIE'}
                    </span>
                  )}
                  {isNew && (
                    <span className="bg-[#DDF5EE] text-[#087F5B] text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg border border-[#087F5B]/30 shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                      NOUTATE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs ${
                    product.qualityTier === 'premium' ? 'bg-[#087F5B] text-white' :
                    product.qualityTier === 'standard' ? 'bg-[#E9ECEF] text-[#0D1B2A]' : 'bg-[#F1F3F5] text-[#5C6670]'
                  }`}>
                    {product.qualityTier}
                  </span>
                  <span className="bg-white/95 text-[#0D1B2A] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#D9E2E1] backdrop-blur-sm shadow-xs">
                    {product.brand}
                  </span>
                </div>
              </div>

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomOpen(true)}
                aria-label="Mărește imaginea"
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-[#0D1B2A] p-2 rounded-xl border border-[#D9E2E1] backdrop-blur-md transition-all shadow-xs cursor-pointer"
                title="Mărește imaginea"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                    aria-label="Imaginea anterioară"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0D1B2A] p-2 rounded-xl border border-[#D9E2E1] backdrop-blur-md transition-all shadow-xs opacity-80 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                    aria-label="Imaginea următoare"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0D1B2A] p-2 rounded-xl border border-[#D9E2E1] backdrop-blur-md transition-all shadow-xs opacity-80 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Alt Caption */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md border border-[#D9E2E1] px-3 py-1.5 rounded-xl text-center z-10 shadow-xs">
                <p className="text-xs text-[#0D1B2A] font-bold truncate">
                  {galleryImages[activeImageIndex].alt}
                </p>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2.5">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Vezi imaginea ${idx + 1}`}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                      activeImageIndex === idx 
                        ? 'border-[#087F5B] ring-2 ring-[#087F5B]/20 scale-105' 
                        : 'border-[#D9E2E1] hover:border-[#5C6670] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <ProductImage
                      src={img.url}
                      alt={img.alt}
                      category={product.subcategory}
                      aspectRatio="aspect-square h-full w-full"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Benefits Pills */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-white border border-[#D9E2E1] p-3 rounded-xl flex flex-col items-center text-center gap-1 shadow-xs">
                <Truck className="w-5 h-5 text-[#087F5B]" />
                <span className="text-[11px] font-extrabold text-[#0D1B2A]">Livrare Rapidă</span>
                <span className="text-[10px] text-[#5C6670]">Sudul Moldovei</span>
              </div>
              <div className="bg-white border border-[#D9E2E1] p-3 rounded-xl flex flex-col items-center text-center gap-1 shadow-xs">
                <Store className="w-5 h-5 text-[#00A878]" />
                <span className="text-[11px] font-extrabold text-[#0D1B2A]">24/7 Lockers</span>
                <span className="text-[10px] text-[#5C6670]">Ridicare gratuită</span>
              </div>
              <div className="bg-white border border-[#D9E2E1] p-3 rounded-xl flex flex-col items-center text-center gap-1 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#087F5B]" />
                <span className="text-[11px] font-extrabold text-[#0D1B2A]">
                  {product.warrantyYears && product.warrantyYears > 0 ? `Garanție ${product.warrantyYears} Ani` : 'Calitate Verificată'}
                </span>
                <span className="text-[10px] text-[#5C6670]">Standarde UE</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: COMMERCIAL INFO & ACTIONS (~52%) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Ratings & Stock Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-mono text-[#5C6670] font-medium bg-white px-2.5 py-1 rounded-md border border-[#D9E2E1]">
                  SKU: {product.sku}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleFavorite(product)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      isFavorite 
                        ? 'bg-rose-50 border-rose-200 text-rose-600' 
                        : 'bg-white border-[#D9E2E1] text-[#0D1B2A] hover:bg-[#F8FAF9]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
                    <span>{isFavorite ? 'Salvat' : 'Favorite'}</span>
                  </button>

                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: product.name, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copiat în clipboard!');
                      }
                    }}
                    className="p-2 rounded-xl bg-white border border-[#D9E2E1] text-[#0D1B2A] hover:bg-[#F8FAF9] transition-colors cursor-pointer"
                    title="Distribuie"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-[#0D1B2A] leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center text-[#087F5B] font-extrabold">
                  <Star className="w-4 h-4 fill-current mr-1 text-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-[#5C6670] font-normal ml-1">({product.reviewCount} recenzii)</span>
                </div>

                <div className="flex items-center text-[#087F5B] font-extrabold bg-[#EFFAF6] border border-[#00A878]/30 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-4 h-4 mr-1.5 shrink-0 text-[#00A878]" />
                  <span>Documentație tehnică disponibilă</span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-white border border-[#D9E2E1] rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <p className="text-xs text-[#5C6670] uppercase tracking-wider font-extrabold">
                    {effectivePrice.isPromoActive ? 'PREȚ PROMOȚIONAL CODEBAU' : isProRole ? 'PREȚ PRO / MEISTER CLUB' : 'PREȚ PERSOANĂ FIZICĂ'}
                  </p>
                  {effectivePrice.isPromoActive ? (
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#5C6670] line-through font-bold">{formatPriceMDL(effectivePrice.basePrice)}</span>
                        <span className="text-xs bg-[#DDF5EE] text-[#087F5B] font-extrabold px-2 py-0.5 rounded-md border border-[#087F5B]/20">
                          −{effectivePrice.discountPercentage}%
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-[#0D1B2A]">
                          {formatPriceMDL(effectivePrice.promotionalPrice)}
                        </span>
                        <span className="text-sm text-[#5C6670] font-bold">/ {product.unit}</span>
                      </div>
                      <p className="text-xs text-[#087F5B] font-extrabold">
                        Economisești {formatPriceMDL(effectivePrice.discountAmount)} per unitate!
                      </p>
                      {effectivePrice.validUntil && (
                        <p className="text-xs text-[#5C6670] flex items-center gap-1 pt-1">
                          <Calendar className="w-3.5 h-3.5 text-[#087F5B]" />
                          Valabil până la {effectivePrice.validUntil}
                        </p>
                      )}
                      <button
                        onClick={() => setShowTermsModal(true)}
                        className="text-xs text-[#087F5B] hover:underline font-extrabold flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5 text-[#087F5B]" />
                        Vezi condițiile promoției
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-black text-[#0D1B2A]">
                        {formatPriceMDL(unitPrice)}
                      </span>
                      <span className="text-sm text-[#5C6670] font-bold">/ {product.unit}</span>
                    </div>
                  )}
                </div>

                {!effectivePrice.isPromoActive && isProRole && (
                  <div className="text-right">
                    <p className="text-[10px] text-[#5C6670] line-through">Retail: {formatPriceMDL(product.priceRetail)}</p>
                    <span className="inline-block text-[11px] font-black bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 px-2 py-0.5 rounded mt-0.5">
                      Economisești {formatPriceMDL(product.priceRetail - product.pricePro)} / unitate
                    </span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-[#5C6670] pt-2 border-t border-[#D9E2E1] flex items-center justify-between">
                <span>Toate prețurile includ TVA (20%)</span>
                <span className="font-mono text-[#0D1B2A] font-bold">Cod Bare: {product.barcode}</span>
              </div>
            </div>

            {/* Store Stock Availability Selector */}
            <div className="bg-white border border-[#D9E2E1] rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#087F5B]" />
                  <span className="text-xs font-bold text-[#5C6670]">Stoc Magazin Selectat:</span>
                  <span className="text-xs font-black text-[#0D1B2A]">{selectedStore}</span>
                </div>
                <button
                  onClick={() => setIsStoresModalOpen(true)}
                  className="text-xs text-[#087F5B] hover:underline font-extrabold cursor-pointer"
                >
                  Schimbă magazinul
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#F8FAF9] p-3 rounded-xl border border-[#D9E2E1] text-xs">
                {currentStock > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#087F5B] animate-pulse"></span>
                    <span className="font-extrabold text-[#087F5B]">În stoc ({currentStock} {product.unit})</span>
                    <span className="text-[#5C6670] text-[11px]">— Ridicare imediată sau livrare azi</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="font-extrabold text-amber-700">La comandă</span>
                    <span className="text-[#5C6670] text-[11px]">— Disponibil în 1–2 zile</span>
                  </div>
                )}
                <span className="text-[10px] font-mono text-[#087F5B] font-bold">Lockers 24/7 OK</span>
              </div>
            </div>

            {/* Quantity Selector & Main Action Buttons */}
            <div className="bg-white border border-[#D9E2E1] rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <label htmlFor="product-qty-input" className="text-xs font-bold text-[#0D1B2A] block">Cantitate ({product.unit}):</label>
                  <p className="text-[11px] text-[#5C6670]">Selectează numărul de unități</p>
                </div>

                <div className="flex items-center bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Scade cantitatea"
                    className="p-2.5 text-[#0D1B2A] hover:bg-[#E9ECEF] rounded-lg transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center font-extrabold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    id="product-qty-input"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center bg-transparent font-black text-[#0D1B2A] text-base focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Crește cantitatea"
                    className="p-2.5 text-[#0D1B2A] hover:bg-[#E9ECEF] rounded-lg transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center font-extrabold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[#5C6670] font-bold">Total estimat</p>
                  <p className="text-2xl font-black text-[#0D1B2A] mt-0.5">
                    {formatPriceMDL(totalPrice)}
                  </p>
                  {quantity > 1 && (
                    <p className="text-[10px] text-[#5C6670] font-medium mt-0.5">
                      La {quantity} unități: {formatPriceMDL(totalPrice)}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                {/* Primary Buy Button with ref */}
                <button
                  ref={mainBuyButtonRef}
                  onClick={handleAdd}
                  className={`w-full py-4 px-6 rounded-xl font-black text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    addedSuccess
                      ? 'bg-[#087F5B] text-white scale-[0.99]'
                      : 'bg-[#087F5B] hover:bg-[#066B4D] active:scale-95 text-white'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>Adăugat cu succes în coș!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 text-white" />
                      <span>Adaugă {quantity} {quantity === 1 ? product.unit : 'unități'} în coș — {formatPriceMDL(totalPrice)}</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      handleAdd();
                    }}
                    className="py-3 px-4 rounded-xl font-extrabold text-xs bg-[#0D1B2A] hover:bg-[#1B2A3D] text-white border border-[#0D1B2A] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-white" />
                    <span>Cumpără acum</span>
                  </button>

                  <button
                    onClick={() => onOpenAIAssistant(`Care este modul corect de aplicare pentru ${product.name}?`)}
                    className="py-3 px-4 rounded-xl font-extrabold text-xs bg-[#DDF5EE] hover:bg-[#cbf1e5] text-[#087F5B] border border-[#00A878]/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#087F5B]" />
                    <span>Întreabă AI CodeBau</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= 6. MATERIALS CONSUMPTION CALCULATOR ================= */}
        <div className="bg-white border border-[#D9E2E1] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D9E2E1] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DDF5EE] border border-[#00A878]/30 flex items-center justify-center text-[#087F5B]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0D1B2A]">Calculator de Consum & Materiale</h2>
                <p className="text-xs text-[#5C6670]">Calculează exact câți saci de adeziv și materiale conexe ai nevoie pentru suprafața ta</p>
              </div>
            </div>

            <span className="text-xs font-mono bg-[#EFFAF6] text-[#087F5B] px-3 py-1 rounded-lg border border-[#00A878]/30 font-bold">
              Consum specific: {product.consumptionPerSqM || 4.5} kg / m²
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input 1: Suprafață */}
            <div className="space-y-2">
              <label htmlFor="calc-area-input" className="text-xs font-bold text-[#0D1B2A] block">Suprafață de placat (m²):</label>
              <div className="flex items-center gap-3">
                <input
                  id="calc-area-input"
                  type="number"
                  min="1"
                  max="500"
                  value={calcArea}
                  onChange={(e) => setCalcArea(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full bg-white border border-[#BCC9C6] rounded-xl p-3 text-[#0D1B2A] font-black text-base focus:border-[#087F5B] focus:outline-none focus:ring-2 focus:ring-[#087F5B]/20"
                />
                <span className="text-sm font-bold text-[#5C6670]">m²</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {[10, 20, 35, 50, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => setCalcArea(val)}
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                      calcArea === val 
                        ? 'bg-[#087F5B] border-[#087F5B] text-white' 
                        : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#5C6670] hover:text-[#0D1B2A]'
                    }`}
                  >
                    {val} m²
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Dimensiune Placă */}
            <div className="space-y-2">
              <label htmlFor="calc-tile-size-select" className="text-xs font-bold text-[#0D1B2A] block">Dimensiune Placă Ceramică:</label>
              <select
                id="calc-tile-size-select"
                value={calcTileSize}
                onChange={(e) => setCalcTileSize(e.target.value)}
                className="w-full bg-white border border-[#BCC9C6] rounded-xl p-3 text-[#0D1B2A] text-xs font-bold focus:border-[#087F5B] focus:outline-none cursor-pointer"
              >
                <option value="30x30">Standard mică (30x30 cm)</option>
                <option value="60x60">Standard medie (60x60 cm)</option>
                <option value="80x80">Plăci mari (80x80 cm)</option>
                <option value="120x60">Plăci XXL (120x60 cm)</option>
              </select>
              <p className="text-[10px] text-[#5C6670]">Dimensiunea plăcii influențează adâncimea dinților gletierei</p>
            </div>

            {/* Calculation Result Box */}
            <div className="bg-[#EFFAF6] border border-[#00A878]/30 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <p className="text-[10px] text-[#5C6670] uppercase tracking-wider font-extrabold">Necesar Estimat (+10% rezerva de pierderi):</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#087F5B]">{calculatedBags} saci</span>
                  <span className="text-xs text-[#0D1B2A] font-bold">({Math.round(totalKgWithReserve)} kg)</span>
                </div>
                <p className="text-xs text-[#5C6670] mt-1">Cost adeziv: <strong className="text-[#0D1B2A]">{formatPriceMDL(calculatedCost)}</strong></p>
              </div>

              <button
                onClick={() => {
                  setQuantity(calculatedBags);
                  mainBuyButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="w-full py-2.5 px-3 bg-[#087F5B] hover:bg-[#066B4D] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Check className="w-4 h-4 text-white" />
                <span>Aplică {calculatedBags} saci în comanda ta</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 7. RECOMMENDED PROJECT BUNDLE (DYNAMIC CALCULATED PACHET) ================= */}
        <div className="bg-white border border-[#D9E2E1] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D9E2E1] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF4CC] border border-amber-300 flex items-center justify-center text-[#7A5600]">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0D1B2A]">Pachet Recomandat de Proiect (Soluție Completă)</h2>
                <p className="text-xs text-[#5C6670]">Include adezivul calculat ({primaryBundleQty} saci), amorsa de aderență, hidroizolația și chit de rosturi</p>
              </div>
            </div>

            <span className="text-xs font-extrabold bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 px-3 py-1 rounded-lg">
              Reducere pachet 10%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bundleItemsWithData.map((b, idx) => (
              <div key={idx} className="bg-[#F8FAF9] border border-[#D9E2E1] p-4 rounded-xl flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-white border border-[#D9E2E1]">
                    <ProductImage
                      src={b.itemData.image}
                      alt={b.itemData.name}
                      category={b.itemData.subcategory}
                      aspectRatio="aspect-square h-full w-full"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#087F5B] font-bold">Produs #{idx + 1}</span>
                    <p className="text-xs font-extrabold text-[#0D1B2A] line-clamp-2 leading-tight">{b.itemData.name}</p>
                    <p className="text-[11px] text-[#5C6670] font-mono mt-1">
                      Cantitate: <strong className="text-[#0D1B2A]">{b.qty} {b.itemData.unit}</strong>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D9E2E1] flex items-center justify-between text-xs">
                  <span className="text-[#5C6670]">Preț unitar:</span>
                  <span className="font-extrabold text-[#0D1B2A]">{formatPriceMDL(b.price * b.qty)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bundle Total Summary & Button */}
          <div className="bg-[#F8FAF9] p-5 rounded-2xl border border-[#D9E2E1] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-xs text-[#5C6670]">Preț produse separat: <span className="line-through">{formatPriceMDL(subtotalBundle)}</span></span>
                <span className="text-xs font-bold text-[#087F5B] bg-[#DDF5EE] border border-[#00A878]/30 px-2 py-0.5 rounded">
                  Reducere: -{formatPriceMDL(bundleDiscountAmount)}
                </span>
              </div>
              <div className="flex items-baseline gap-2 justify-center md:justify-start">
                <span className="text-2xl font-black text-[#0D1B2A]">Total Pachet: {formatPriceMDL(bundleTotal)}</span>
                <span className="text-xs text-[#087F5B] font-extrabold">Economisești {formatPriceMDL(bundleDiscountAmount)}!</span>
              </div>
            </div>

            <button
              onClick={handleAddBundle}
              className="w-full md:w-auto py-3.5 px-8 bg-[#087F5B] hover:bg-[#066B4D] text-white font-black text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              <span>Adaugă pachetul complet în coș ({formatPriceMDL(bundleTotal)})</span>
            </button>
          </div>
        </div>

        {/* ================= 8. COMPLEMENTARY PRODUCTS ("COMPLETEAZĂ LUCRAREA") ================= */}
        <div className="bg-white border border-[#D9E2E1] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D9E2E1] pb-4">
            <div>
              <h2 className="text-lg font-black text-[#0D1B2A]">Completează lucrarea (Produse Complementare)</h2>
              <p className="text-xs text-[#5C6670]">Materiale și scule necesare pentru montarea corectă a placării ceramice</p>
            </div>

            {selectedCompItems.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#5C6670]">
                  Produse selectate: <strong className="text-[#087F5B]">{selectedCompItems.length}</strong> | Total: <strong className="text-[#0D1B2A]">{formatPriceMDL(selectedCompTotal)}</strong>
                </span>
                <button
                  onClick={handleAddSelectedComplementary}
                  className="py-2 px-4 bg-[#087F5B] hover:bg-[#066B4D] text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span>Adaugă produsele selectate</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {complementaryProducts.map((compProduct) => {
              const isChecked = selectedComplementary.includes(compProduct.id);
              const compPrice = isProRole ? compProduct.pricePro : compProduct.priceRetail;

              return (
                <div 
                  key={compProduct.id} 
                  className={`bg-white border rounded-2xl p-3 flex flex-col justify-between h-full transition-all group ${
                    isChecked ? 'border-[#087F5B] ring-1 ring-[#087F5B]/30' : 'border-[#D9E2E1] hover:border-[#5C6670]'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Image */}
                    <div 
                      onClick={() => toggleComplementary(compProduct.id)}
                      className="relative aspect-square rounded-xl overflow-hidden bg-[#F8FAF9] cursor-pointer border border-[#D9E2E1]"
                    >
                      <ProductImage
                        src={compProduct.image}
                        alt={compProduct.name}
                        category={compProduct.subcategory}
                        aspectRatio="aspect-square h-full w-full"
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComplementary(compProduct.id);
                        }}
                        className="absolute top-2 right-2 z-10 text-[#087F5B] cursor-pointer p-1 bg-white/90 rounded-md backdrop-blur border border-[#D9E2E1]"
                        title={isChecked ? 'Deselectează' : 'Selectează'}
                      >
                        {isChecked ? <CheckSquare className="w-5 h-5 text-[#087F5B]" /> : <Square className="w-5 h-5 text-[#5C6670]" />}
                      </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-[#087F5B] uppercase tracking-wider">{compProduct.brand}</span>
                      <h3 
                        onClick={() => onNavigateToProduct(getProductSlug(compProduct))}
                        className="text-xs font-extrabold text-[#0D1B2A] line-clamp-2 min-h-[2.25rem] hover:text-[#087F5B] cursor-pointer transition-colors leading-snug"
                      >
                        {compProduct.name}
                      </h3>
                    </div>
                  </div>

                  {/* Pricing & Add Separat Button */}
                  <div className="pt-3 border-t border-[#D9E2E1] space-y-2 mt-auto">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black text-[#0D1B2A]">{formatPriceMDL(compPrice)}</span>
                      <span className="text-[10px] text-[#5C6670] font-medium">/ {compProduct.unit}</span>
                    </div>

                    <button
                      onClick={() => onAddToCart(compProduct, 1)}
                      className="w-full py-2 px-3 bg-[#F8FAF9] hover:bg-[#E9ECEF] text-[#0D1B2A] border border-[#D9E2E1] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#087F5B]" />
                      <span>Adaugă separat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 9. SIMILAR ALTERNATIVES ("PRODUSE SIMILARE") ================= */}
        <div className="bg-white border border-[#D9E2E1] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D9E2E1] pb-4">
            <div>
              <h2 className="text-lg font-black text-[#0D1B2A]">Produse Similare & Alternative din Categorie</h2>
              <p className="text-xs text-[#5C6670]">Adezivi alternativi clasificați după nivelul de performanță (Economic, Standard, Premium)</p>
            </div>
            <span className="text-xs font-mono text-[#5C6670]">Același scop de utilizare</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProducts.map((simProduct) => {
              const simPrice = isProRole ? simProduct.pricePro : simProduct.priceRetail;

              return (
                <div 
                  key={simProduct.id}
                  className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl p-4 flex flex-col justify-between h-full hover:border-[#087F5B] transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${
                        simProduct.qualityTier === 'premium' ? 'bg-amber-400 text-[#0D1B2A]' :
                        simProduct.qualityTier === 'standard' ? 'bg-[#087F5B] text-white' : 'bg-[#E9ECEF] text-[#0D1B2A]'
                      }`}>
                        {simProduct.qualityTier}
                      </span>
                      {simProduct.qualityNote && (
                        <span className="text-[10px] font-extrabold text-[#087F5B] bg-[#DDF5EE] border border-[#00A878]/30 px-2 py-0.5 rounded-md">
                          {simProduct.qualityNote}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white border border-[#D9E2E1]">
                        <ProductImage
                          src={simProduct.image}
                          alt={simProduct.name}
                          category={simProduct.subcategory}
                          aspectRatio="aspect-square h-full w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#5C6670]">SKU: {simProduct.sku}</span>
                        <h3 
                          onClick={() => onNavigateToProduct(getProductSlug(simProduct))}
                          className="text-xs font-extrabold text-[#0D1B2A] line-clamp-2 hover:text-[#087F5B] cursor-pointer transition-colors leading-snug"
                        >
                          {simProduct.name}
                        </h3>
                        <p className="text-[11px] text-[#5C6670] line-clamp-2">{simProduct.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#D9E2E1] flex items-center justify-between gap-3 mt-4">
                    <div>
                      <p className="text-[10px] text-[#5C6670] uppercase font-bold">Preț unitar</p>
                      <span className="text-base font-black text-[#0D1B2A]">{formatPriceMDL(simPrice)}</span>
                      <span className="text-[10px] text-[#5C6670]"> / {simProduct.unit}</span>
                    </div>

                    <button
                      onClick={() => onNavigateToProduct(getProductSlug(simProduct))}
                      className="py-2 px-3 bg-white hover:bg-[#F8FAF9] text-[#087F5B] border border-[#D9E2E1] rounded-xl text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Vezi produs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 10. TECHNICAL DATA NOTICE BANNER (IF MOCK) ================= */}
        {isMockData && (
          <div className="bg-[#FFF4CC] border border-amber-300 p-4 rounded-2xl flex items-start gap-3 text-[#7A5600]">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <p className="text-xs leading-relaxed font-medium">
              Informații demonstrative pentru prezentarea interfeței. Datele finale vor fi validate conform documentației oficiale a producătorului.
            </p>
          </div>
        )}

        {/* ================= 11. TABS (ACCESSIBLE & RESPONSIVE) ================= */}
        <div className="bg-white border border-[#D9E2E1] rounded-2xl overflow-hidden shadow-xs">
          {/* Tab Navigation Header */}
          <div 
            ref={tabListRef}
            role="tablist" 
            aria-label="Informații detaliate produs"
            className="flex items-center gap-1 border-b border-[#D9E2E1] bg-[#F8FAF9] p-2 overflow-x-auto no-scrollbar"
          >
            {[
              { id: 'descriere', label: 'Descriere' },
              { id: 'caracteristici', label: 'Caracteristici Tehnice' },
              { id: 'utilizare', label: 'Ghid Utilizare' },
              { id: 'documente', label: 'Documente Tehnice' },
              { id: 'livrare', label: 'Livrare & Retur' },
              { id: 'recenzii', label: `Recenzii (${product.reviewCount})` }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  onKeyDown={(e) => handleTabKeyDown(e, tab.id as typeof activeTab)}
                  className={`px-4 py-3 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#087F5B]/30 ${
                    isActive 
                      ? 'bg-[#087F5B] text-white shadow-xs font-black' 
                      : 'text-[#5C6670] hover:text-[#0D1B2A] hover:bg-[#E9ECEF]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="p-6">
            
            {/* TAB 1: Descriere */}
            {activeTab === 'descriere' && (
              <div id="panel-descriere" role="tabpanel" aria-labelledby="tab-descriere" className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-black text-[#0D1B2A]">Descriere detaliată produs</h3>
                <p className="text-sm text-[#5C6670] leading-relaxed">
                  {product.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                  <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#D9E2E1] space-y-1">
                    <h4 className="text-xs font-extrabold text-[#087F5B]">Domenii de Aplicare</h4>
                    <p className="text-xs text-[#5C6670]">
                      Ideal pentru gresie porțelanată, faianță, piatră naturală, plăci ceramice de mari dimensiuni la interior și exterior. Recomandat pentru băi, bucătării, terase, piscine și încălzire în pardoseală.
                    </p>
                  </div>
                  <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#D9E2E1] space-y-1">
                    <h4 className="text-xs font-extrabold text-[#087F5B]">Avantaje Cheie</h4>
                    <p className="text-xs text-[#5C6670]">
                      Flexibilitate înaltă clasa S1 (absorbție preluată fără fisuri), alunecare redusă la verticală (T), timp deschis extins (E), rezistență la îngheț și solicitări intense.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Caracteristici */}
            {activeTab === 'caracteristici' && (
              <div id="panel-caracteristici" role="tabpanel" aria-labelledby="tab-caracteristici" className="space-y-4 animate-in fade-in duration-200">
                <div className="border border-[#D9E2E1] rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs text-[#5C6670]">
                    <tbody className="divide-y divide-[#D9E2E1]">
                      {Object.entries(product.specs || {}).map(([key, val], idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-[#F8FAF9]' : 'bg-white'}>
                          <td className="px-4 py-3 font-extrabold text-[#0D1B2A] w-1/3 border-r border-[#D9E2E1]">{key}</td>
                          <td className="px-4 py-3 font-medium text-[#0D1B2A]">{val}</td>
                        </tr>
                      ))}
                      <tr className="bg-[#F8FAF9]">
                        <td className="px-4 py-3 font-extrabold text-[#0D1B2A] border-r border-[#D9E2E1]">Destinație spațiu</td>
                        <td className="px-4 py-3 font-bold text-[#0D1B2A] capitalize">{product.destination === 'both' ? 'Interior și Exterior' : product.destination}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-4 py-3 font-extrabold text-[#0D1B2A] border-r border-[#D9E2E1]">Clasă de performanță</td>
                        <td className="px-4 py-3 font-bold text-[#087F5B] font-mono">C2TE S1 conforme EN 12004</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: Utilizare */}
            {activeTab === 'utilizare' && (
              <div id="panel-utilizare" role="tabpanel" aria-labelledby="tab-utilizare" className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-black text-[#0D1B2A]">Ghid pas cu pas de preparare și aplicare</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#D9E2E1] space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-[#DDF5EE] text-[#087F5B] font-black text-xs flex items-center justify-center">1</span>
                    <h4 className="text-xs font-extrabold text-[#0D1B2A]">Pregătirea Suportului</h4>
                    <p className="text-xs text-[#5C6670]">Suprafața trebuie să fie curată, lipsită de praf, grăsimi și complet uscată. Amorsează obligatoriu cu Grund CT 17.</p>
                  </div>
                  <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#D9E2E1] space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-[#DDF5EE] text-[#087F5B] font-black text-xs flex items-center justify-center">2</span>
                    <h4 className="text-xs font-extrabold text-[#0D1B2A]">Amestecarea</h4>
                    <p className="text-xs text-[#5C6670]">Toarnă sacul de 25kg în 7.0–7.5L apă curată. Amestecă cu mixerul la turație joasă până la omogenizare perfectă.</p>
                  </div>
                  <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#D9E2E1] space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-[#DDF5EE] text-[#087F5B] font-black text-xs flex items-center justify-center">3</span>
                    <h4 className="text-xs font-extrabold text-[#0D1B2A]">Aplicarea Plăcilor</h4>
                    <p className="text-xs text-[#5C6670]">Întinde adezivul cu gletieră dințată 10x10mm. Apasă placa ferm și folosește sistemul de autonivelare.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Documente */}
            {activeTab === 'documente' && (
              <div id="panel-documente" role="tabpanel" aria-labelledby="tab-documente" className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: 'Fișă Tehnică — document demonstrativ', size: '1.2 MB', code: 'FT-CM17-RO' },
                    { title: 'Fișă de Securitate — document demonstrativ', size: '850 KB', code: 'FS-CER-CM17' },
                    { title: 'Declarație de Performanță C2TE S1', size: '620 KB', code: 'DoP-00128' },
                    { title: 'Ghid de Montaj Plăci Mari', size: '2.4 MB', code: 'GUIDE-TILING-2026' }
                  ].map((doc, idx) => (
                    <div key={idx} className="bg-[#F8FAF9] border border-[#D9E2E1] p-4 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-[#087F5B] shrink-0" />
                        <div>
                          <p className="font-extrabold text-[#0D1B2A] text-xs">{doc.title}</p>
                          <p className="text-[10px] text-[#5C6670] font-mono">{doc.code} • {doc.size}</p>
                        </div>
                      </div>
                      <button className="p-2 bg-white hover:bg-[#E9ECEF] text-[#0D1B2A] rounded-xl border border-[#D9E2E1] transition-colors cursor-pointer" title="Descarcă PDF">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Livrare */}
            {activeTab === 'livrare' && (
              <div id="panel-livrare" role="tabpanel" aria-labelledby="tab-livrare" className="space-y-4 animate-in fade-in duration-200 text-xs text-[#5C6670]">
                <p>Livrare cu camioane specializate dotate cu macara / oblon direct la șantierul tău din raioanele Cahul, Cantemir, Vulcănești și Taraclia.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#D9E2E1]">
                    <h4 className="font-extrabold text-[#0D1B2A] mb-1">Ridicare Gratuită Lockers & Magazine</h4>
                    <p>Comanzi online și ridici din orice magazin CodeBau sau din dulapurile securizate 24/7 fără costuri de transport.</p>
                  </div>
                  <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#D9E2E1]">
                    <h4 className="font-extrabold text-[#0D1B2A] mb-1">Politica de Retur 14 Zile</h4>
                    <p>Produsele sigilate în ambalaj original nedeteriorat pot fi returnate gratuit în termen de 14 zile la oricare din magazinele noastre.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Recenzii */}
            {activeTab === 'recenzii' && (
              <div id="panel-recenzii" role="tabpanel" aria-labelledby="tab-recenzii" className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#0D1B2A]">Recenzii verificate de la meseriași și clienți</h3>
                    <p className="text-xs text-[#5C6670]">Scor mediu {product.rating} din 5 stele ({product.reviewCount} evaluări)</p>
                  </div>
                  <button className="py-2 px-4 bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 rounded-xl text-xs font-extrabold hover:bg-[#cbf1e5] transition-colors cursor-pointer">
                    Adaugă recenzie
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { name: 'Ion Vasile (Meșter Faianțar, Cahul)', rating: 5, date: '14 Mai 2026', comment: 'Folosesc CM 17 la toate lucrările cu încălzire în pardoseală. Excelent timp deschis și aderență impecabilă.' },
                    { name: 'Mihai D. (Cahul)', rating: 5, date: '2 Februarie 2026', comment: 'L-am cumpărat din magazinul CodeBau Cahul. Am ridicat comanda prin Lockers 24/7. Foarte comod!' }
                  ].map((rev, idx) => (
                    <div key={idx} className="bg-[#F8FAF9] p-4 rounded-xl border border-[#D9E2E1] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#0D1B2A] text-xs">{rev.name}</span>
                        <span className="text-[10px] text-[#5C6670]">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-[#5C6670]">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ================= 12. RECENTLY VIEWED PRODUCTS ================= */}
        {recentlyViewed.length > 0 && (
          <div className="bg-white border border-[#D9E2E1] rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-black text-[#0D1B2A] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#087F5B]" />
              <span>Vizualizate recent</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.slice(0, 4).map((rvProd) => (
                <div
                  key={rvProd.id}
                  onClick={() => onNavigateToProduct(getProductSlug(rvProd))}
                  className="bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-3 hover:border-[#087F5B] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="aspect-square rounded-lg overflow-hidden bg-white border border-[#D9E2E1]">
                      <ProductImage
                        src={rvProd.image}
                        alt={rvProd.name}
                        category={rvProd.subcategory}
                        aspectRatio="aspect-square h-full w-full"
                      />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#087F5B] uppercase">{rvProd.brand}</span>
                    <h3 className="text-xs font-extrabold text-[#0D1B2A] line-clamp-2 group-hover:text-[#087F5B] transition-colors leading-tight">
                      {rvProd.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-[#D9E2E1] mt-2 flex items-baseline justify-between">
                    <span className="text-sm font-black text-[#0D1B2A]">{formatPriceMDL(isProRole ? rvProd.pricePro : rvProd.priceRetail)}</span>
                    <span className="text-[10px] text-[#5C6670]">/ {rvProd.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= STORES MODAL ================= */}
      {isStoresModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#D9E2E1] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#D9E2E1] pb-3">
              <h3 className="text-lg font-black text-[#0D1B2A]">Alege Magazinul / Punctul de Livrare</h3>
              <button 
                onClick={() => setIsStoresModalOpen(false)}
                className="p-1 text-[#5C6670] hover:text-[#0D1B2A] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_STORES.map((s) => (
                <div
                  key={s.id}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedStore === s.name 
                      ? 'bg-[#EFFAF6] border-[#087F5B] text-[#0D1B2A]' 
                      : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#5C6670] hover:border-[#087F5B]'
                  }`}
                  onClick={() => {
                    setIsStoresModalOpen(false);
                  }}
                >
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0D1B2A]">{s.name}</h4>
                    <p className="text-xs text-[#5C6670]">{s.address}</p>
                    <p className="text-[10px] text-[#087F5B] font-mono mt-0.5">{s.schedule}</p>
                  </div>
                  {selectedStore === s.name && (
                    <span className="bg-[#087F5B] text-white text-xs font-black px-2.5 py-1 rounded-md">
                      Activ
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= IMAGE ZOOM MODAL ================= */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-[#0D1B2A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-white border border-[#D9E2E1] rounded-2xl overflow-hidden p-2 shadow-2xl">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-20 bg-[#0D1B2A] hover:bg-[#1B2A3D] text-white p-2 rounded-xl border border-white/20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-[4/3] w-full">
              <ProductImage
                src={galleryImages[activeImageIndex].url}
                alt={galleryImages[activeImageIndex].alt}
                category={product.subcategory}
                aspectRatio="aspect-full h-full w-full"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= STICKY MOBILE BUY BAR ================= */}
      {showStickyBar && (
        <div 
          className="fixed left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#D9E2E1] p-3 shadow-lg md:hidden transition-all duration-300 animate-in slide-in-from-bottom-2"
          style={{
            bottom: 'calc(var(--mobile-nav-height, 64px) + env(safe-area-inset-bottom, 0px))'
          }}
        >
          <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto px-2">
            <div>
              <p className="text-[10px] text-[#5C6670] font-semibold">Total estimat</p>
              <p className="text-base font-black text-[#0D1B2A]">{formatPriceMDL(totalPrice)}</p>
            </div>

            <button
              onClick={handleAdd}
              className="bg-[#087F5B] hover:bg-[#066B4D] active:scale-95 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              <span>Adaugă în coș</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= PROMO TERMS MODAL ================= */}
      {showTermsModal && effectivePrice.isPromoActive && (
        <div className="fixed inset-0 z-50 bg-[#0D1B2A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#D9E2E1] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <button 
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 bg-[#F8FAF9] hover:bg-[#E9ECEF] text-[#5C6670] p-1.5 rounded-full border border-[#D9E2E1] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-600 font-black text-base">
              <Tag className="w-5 h-5 fill-current" />
              <span>Regulament & Condiții Promoție</span>
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
                  <span className="text-[#5C6670]">Roluri eligibile:</span>
                  <span className="font-bold">
                    Retail, Meister Club & Parteneri B2B
                  </span>
                </div>

                <div className="pt-2 flex justify-between">
                  <span className="text-[#5C6670]">Magazine cu stoc promoțional:</span>
                  <span className="font-bold">
                    {selectedStore} și toate magazinele CodeBau
                  </span>
                </div>

                {effectivePrice.maxQuantityPerCustomer && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-[#5C6670]">Limită cantitativă:</span>
                    <span className="font-extrabold text-amber-700">
                      Maxim {effectivePrice.maxQuantityPerCustomer} {product.unit} per comandă
                    </span>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-[#5C6670] italic pt-2">
                * Oferta se aplică automat în coș la îndeplinirea condițiilor de cantitate și stoc la magazinul selectat.
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
  );
};
