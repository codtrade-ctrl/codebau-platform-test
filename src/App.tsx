import React, { useState, useEffect } from 'react';
import { UserRole, Product, CartItem, SavedProject, Order } from './types';
import { MOCK_PRODUCTS, MOCK_STORES } from './data/mockData';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { MaterialCalculatorView } from './components/MaterialCalculatorView';
import { CraftsmenView } from './components/CraftsmenView';
import { MeisterClubView } from './components/MeisterClubView';
import { B2BView } from './components/B2BView';
import { UserAccountView } from './components/UserAccountView';
import { SolutionsView } from './components/SolutionsView';
import { AdminView } from './components/AdminView';
import { AIAssistantModal } from './components/AIAssistantModal';
import { CartDrawer } from './components/CartDrawer';
import { CartPage } from './components/CartPage';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { QATestScenariosModal } from './components/QATestScenariosModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { CodeBauLogo } from './components/CodeBauLogo';
import { ProductDetailPage } from './components/ProductDetailPage';
import { PromotionService } from './services/PromotionService';
import { NewsSection } from './components/NewsSection';
import { PromotionsSection } from './components/PromotionsSection';
import { NewsPage } from './components/NewsPage';
import { PromotionsPage } from './components/PromotionsPage';
import { EditorialCenterView } from './components/EditorialCenterView';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { AdminArticlesView } from './components/AdminArticlesView';
import { getProductBySlug, getProductSlug } from './utils/formatters';
import { defaultCartRepository, getCartSessionId, logTestEvent } from './services/cartRepository';
import { Search, Sparkles, Filter, Calculator, Wrench, Building2, Layers, ShoppingCart, Check, ShieldCheck, ArrowRight, Store, Clock, Phone, MapPin, BookOpen, CheckCircle2, Truck, UserCheck, Tag } from 'lucide-react';

export default function App() {
  // Global Application State
  const [currentRole, setCurrentRole] = useState<UserRole>('client');
  const [selectedStore, setSelectedStore] = useState<string>('CodeBau Cahul');
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [activeProductSlug, setActiveProductSlug] = useState<string | null>(null);
  const [editorialArticleSlug, setEditorialArticleSlug] = useState<string | null>(null);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>('');

  // Sync routing with URL path /produs/:slug, /ghiduri, /ghiduri/:slug, /admin/articole, /cos, /finalizare-comanda
  useEffect(() => {
    const handleRouteSync = () => {
      const path = window.location.pathname;
      if (path.startsWith('/produs/')) {
        const slug = path.replace(/^\/produs\//, '').trim();
        if (slug) {
          setActiveProductSlug(slug);
          setActiveTab('product_detail');
        }
      } else if (path.startsWith('/ghiduri/')) {
        const slug = path.replace(/^\/ghiduri\//, '').trim();
        if (slug) {
          setEditorialArticleSlug(slug);
          setActiveTab('article_detail');
        }
      } else if (path === '/ghiduri') {
        setEditorialArticleSlug(null);
        setActiveTab('guides');
      } else if (path === '/admin/articole') {
        setActiveTab('admin_articles');
      } else if (path === '/cos') {
        setActiveProductSlug(null);
        setActiveTab('cart');
      } else if (path === '/finalizare-comanda') {
        setActiveProductSlug(null);
        setActiveTab('checkout');
      } else if (path === '/noutati') {
        setActiveProductSlug(null);
        setActiveTab('noutati');
      } else if (path === '/promotii') {
        setActiveProductSlug(null);
        setActiveTab('promotii');
      } else if (path.startsWith('/comanda-confirmata/')) {
        const orderNum = path.replace(/^\/comanda-confirmata\//, '').trim();
        setConfirmedOrderNumber(orderNum);
        setActiveProductSlug(null);
        setActiveTab('confirmation');
      } else if (path === '/' || path === '') {
        setActiveProductSlug(null);
        if (['product_detail', 'cart', 'checkout', 'confirmation', 'article_detail'].includes(activeTab)) {
          setActiveTab('catalog');
        }
      }
    };

    handleRouteSync();
    window.addEventListener('popstate', handleRouteSync);
    return () => window.removeEventListener('popstate', handleRouteSync);
  }, []);

  const navigateToEditorialCenter = () => {
    setEditorialArticleSlug(null);
    setActiveTab('guides');
    window.history.pushState({}, '', '/ghiduri');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToArticle = (slug: string) => {
    setEditorialArticleSlug(slug);
    setActiveTab('article_detail');
    window.history.pushState({ slug }, '', `/ghiduri/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToNews = () => {
    setActiveProductSlug(null);
    setActiveTab('noutati');
    window.history.pushState({}, '', '/noutati');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPromotions = () => {
    setActiveProductSlug(null);
    setActiveTab('promotii');
    window.history.pushState({}, '', '/promotii');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (slug: string) => {
    setActiveProductSlug(slug);
    setActiveTab('product_detail');
    window.history.pushState({ slug }, '', `/produs/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCart = () => {
    setActiveProductSlug(null);
    setActiveTab('cart');
    window.history.pushState({}, '', '/cos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCheckout = () => {
    setActiveProductSlug(null);
    setActiveTab('checkout');
    window.history.pushState({}, '', '/finalizare-comanda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToConfirmation = (orderNumber: string) => {
    setConfirmedOrderNumber(orderNumber);
    setActiveProductSlug(null);
    setActiveTab('confirmation');
    window.history.pushState({}, '', `/comanda-confirmata/${orderNumber}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBackToCatalog = () => {
    setActiveProductSlug(null);
    setActiveTab('catalog');
    if (window.location.pathname.startsWith('/produs/') || window.location.pathname === '/cos') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'cart') {
      navigateToCart();
      return;
    }
    if (tab !== 'product_detail') {
      setActiveProductSlug(null);
      if (window.location.pathname.startsWith('/produs/') || window.location.pathname === '/cos') {
        window.history.pushState({}, '', '/');
      }
    }
    setActiveTab(tab);
  };

  // Catalog Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [catalogTypeFilter, setCatalogTypeFilter] = useState<'all' | 'noutati' | 'promotii' | 'recomandate'>('all');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isQAModalOpen, setIsQAModalOpen] = useState<boolean>(false);

  // Cart & Saved Items State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Load initial cart from repository
  useEffect(() => {
    async function loadCartData() {
      const sessionId = getCartSessionId();
      const cart = await defaultCartRepository.getCart(sessionId, selectedStore);
      if (cart.items && cart.items.length > 0) {
        setCartItems(cart.items);
      }
      if (cart.savedItems && cart.savedItems.length > 0) {
        setSavedItems(cart.savedItems);
      }
    }
    loadCartData();
  }, []);

  // Save cart changes to repository
  useEffect(() => {
    async function persistCart() {
      const sessionId = getCartSessionId();
      await defaultCartRepository.saveCart({
        id: `cart_${sessionId}`,
        sessionId,
        selectedStoreId: selectedStore,
        items: cartItems,
        savedItems,
        currency: 'MDL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        environment: 'development',
        isTestData: true
      });
    }
    persistCart();
  }, [cartItems, savedItems, selectedStore]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    const appliedPrice = (currentRole === 'meister' || currentRole === 'b2b') ? product.pricePro : product.priceRetail;
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity, appliedPrice } : item
        );
      }
      return [...prev, { product, quantity, appliedPrice }];
    });

    logTestEvent('cart_item_added', { productId: product.id, productName: product.name, quantity, appliedPrice });
  };

  const handleAddMultipleToCart = (items: CartItem[]) => {
    setCartItems(prev => {
      let updated = [...prev];
      items.forEach(newItem => {
        const idx = updated.findIndex(i => i.product.id === newItem.product.id);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + newItem.quantity };
        } else {
          updated.push(newItem);
        }
      });
      return updated;
    });
    setIsCartOpen(true);
    logTestEvent('cart_item_added', { itemsCount: items.length });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
    logTestEvent('cart_quantity_changed', { productId, newQuantity: quantity });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    logTestEvent('cart_item_removed', { productId });
  };

  const handleClearCart = () => {
    setCartItems([]);
    logTestEvent('cart_cleared', {});
  };

  const handleSaveForLater = (productId: string) => {
    const itemToSave = cartItems.find(i => i.product.id === productId);
    if (itemToSave) {
      setCartItems(prev => prev.filter(i => i.product.id !== productId));
      setSavedItems(prev => [...prev.filter(i => i.product.id !== productId), itemToSave]);
      logTestEvent('cart_saved_for_later', { productId });
    }
  };

  const handleMoveToCartFromSaved = (productId: string) => {
    const itemToMove = savedItems.find(i => i.product.id === productId);
    if (itemToMove) {
      setSavedItems(prev => prev.filter(i => i.product.id !== productId));
      handleAddToCart(itemToMove.product, itemToMove.quantity);
    }
  };

  const handleRemoveSavedItem = (productId: string) => {
    setSavedItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleRunQAScenario = (scenarioId: number) => {
    if (scenarioId === 1) {
      handleAddToCart(MOCK_PRODUCTS[0], 1);
      setIsCartOpen(true);
    } else if (scenarioId === 2) {
      handleAddToCart(MOCK_PRODUCTS[0], 10);
      handleAddToCart(MOCK_PRODUCTS[1] || MOCK_PRODUCTS[0], 2);
      setIsCartOpen(true);
    } else if (scenarioId === 5) {
      navigateToCart();
    } else if (scenarioId === 14) {
      handleAddToCart(MOCK_PRODUCTS[0], 3);
      navigateToCart();
    } else {
      setIsCartOpen(true);
    }
  };

  const handleSaveProject = (title: string, items: CartItem[], budget: number) => {
    const newProj: SavedProject = {
      id: `proj-${Date.now()}`,
      title,
      clientName: 'Adrian Popescu',
      location: 'Cahul - Sudul Republicii Moldova',
      status: 'planning',
      notes: 'Proiect generat automat prin Calculatorul CodeBau',
      items,
      budget,
      createdAt: new Date().toISOString().substring(0, 10)
    };
    setSavedProjects(prev => [...prev, newProj]);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setUserOrders(prev => [newOrder, ...prev]);
  };

  // Favorites State
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const handleToggleFavorite = (product: Product) => {
    setFavoriteIds(prev => 
      prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]
    );
  };

  // Filter products for Catalog safely
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const q = (searchQuery || '').toLowerCase();
    const nameMatch = (p.name || '').toLowerCase().includes(q);
    const brandMatch = (p.brand || '').toLowerCase().includes(q);
    const catMatch = (p.category || '').toLowerCase().includes(q);
    const skuMatch = (p.sku || '').toLowerCase().includes(q);
    const matchesSearch = nameMatch || brandMatch || catMatch || skuMatch;

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || (p.brand || '').toLowerCase() === selectedBrand.toLowerCase();

    // Type filter: Toate, Noutăți, Promoții, Recomandate
    let matchesType = true;
    if (catalogTypeFilter === 'noutati') {
      matchesType = PromotionService.isNewProduct(p);
    } else if (catalogTypeFilter === 'promotii') {
      const basePrice = (currentRole === 'meister' || currentRole === 'b2b') ? p.pricePro : p.priceRetail;
      const res = PromotionService.calculateEffectivePrice({
        product: p,
        basePrice,
        userRole: currentRole,
        selectedStore,
        quantity: 1
      });
      matchesType = res.isPromoActive;
    } else if (catalogTypeFilter === 'recomandate') {
      matchesType = (p.rating ?? 0) >= 4.7 || Boolean(p.qualityTier === 'premium');
    }

    return matchesSearch && matchesCategory && matchesBrand && matchesType;
  });

  const cartTotalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#0D1B2A] flex flex-col font-sans selection:bg-[#00A878] selection:text-white">
      
      {/* Top Header Navigation */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === 'meister') setActiveTab('meister');
          else if (role === 'b2b') setActiveTab('b2b');
          else if (role === 'admin') setActiveTab('admin');
        }}
        selectedStore={selectedStore}
        onStoreChange={setSelectedStore}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiAssistant={() => setIsAiModalOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favoriteIds.length}
        onOpenQAModal={() => setIsQAModalOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory('all');
          setSearchQuery(cat);
          setActiveTab('catalog');
        }}
      />

      {/* Main Container View Router */}
      <main className="flex-1 pb-4 md:pb-6">
        
        {/* VIEW 1: CATALOG & HOME */}
        {(activeTab === 'catalog' || activeTab === 'home') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            
            {/* Hero Interactive Banner (Light Background as per CodeBau DS v1.1) */}
            <div className="bg-gradient-to-br from-white via-[#EFFAF6] to-[#E9ECEF] border border-[#D9E2E1] px-6 py-7 sm:p-8 lg:p-10 rounded-3xl text-[#0D1B2A] relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A878]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
                {/* Left Column: Text, Badge, CTA Buttons, Advantages */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                  
                  {/* 1. Badge */}
                  <div className="inline-flex items-center gap-2 bg-[#DDF5EE] text-[#087F5B] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#00A878]/30 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#00A878] animate-pulse"></span>
                    <span>Materiale • Soluții • Livrare • Meșteri</span>
                  </div>

                  {/* 2. Main Commercial Title */}
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#0D1B2A] max-w-2xl">
                    Tot ce ai nevoie pentru construcții și renovări
                    <span className="block text-[#087F5B] font-black mt-1">într-un singur loc.</span>
                  </h1>

                  {/* 3. Description */}
                  <p className="text-[#5C6670] text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                    Alege materialele potrivite, verifică stocul în magazinele CodeBau, calculează necesarul și comandă cu livrare sau ridicare din magazin.
                  </p>

                  {/* 4, 5, 6. Commercial Actions Buttons */}
                  <div className="pt-1 space-y-2.5">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                      {/* Button 1: Vezi produsele */}
                      <button
                        onClick={() => {
                          setActiveTab('catalog');
                          setTimeout(() => {
                            document.getElementById('products-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                          }, 50);
                        }}
                        className="w-full sm:w-auto bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-6 py-3.5 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                      >
                        <span>Vezi produsele</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>

                      {/* Button 2: Începe un proiect */}
                      <button
                        onClick={() => setActiveTab('solutions')}
                        className="w-full sm:w-auto bg-white hover:bg-[#F8FAF9] text-[#0D1B2A] font-extrabold px-6 py-3.5 rounded-xl text-xs border-2 border-[#0D1B2A] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Începe un proiect</span>
                      </button>
                    </div>

                    {/* Link: Calculează necesarul */}
                    <div className="pt-1">
                      <button
                        onClick={() => setActiveTab('calculator')}
                        className="text-xs text-[#087F5B] hover:text-[#066B4D] font-extrabold underline underline-offset-4 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Calculator className="w-3.5 h-3.5 text-[#087F5B]" />
                        <span>Calculează necesarul de materiale</span>
                      </button>
                    </div>
                  </div>

                  {/* 7. Advantages (placed after buttons on mobile) */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-6 text-xs text-[#0D1B2A] font-bold pt-2 border-t border-[#D9E2E1] sm:border-0">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#00A878] flex-shrink-0" />
                      <span>Stoc actualizat în timp real</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#00A878] flex-shrink-0" />
                      <span>Livrare în sudul Moldovei</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#00A878] flex-shrink-0" />
                      <span>Consultanță pentru proiectul tău</span>
                    </div>
                  </div>

                </div>

                {/* Right Column: Realistic Commercial Image */}
                <div className="lg:col-span-5 hidden lg:block relative">
                  <div className="relative rounded-2xl overflow-hidden border border-[#D9E2E1] shadow-lg group">
                    <img 
                      src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80" 
                      alt="Renovări și materiale de construcții CodeBau" 
                      className="w-full h-72 lg:h-80 object-cover object-center transform group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 via-transparent to-transparent"></div>
                    
                    {/* Updated Card Overlay Text */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md border border-[#D9E2E1] p-3 rounded-xl flex items-center justify-between text-xs shadow-md">
                      <div>
                        <p className="font-extrabold text-[#0D1B2A] text-xs">Stoc verificat în magazinele CodeBau</p>
                        <p className="text-[11px] text-[#5C6670] font-medium">Comandă cu livrare sau ridicare din magazin.</p>
                      </div>
                      <span className="bg-[#EFFAF6] text-[#00A878] font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-[#00A878]/30 shrink-0 ml-2">
                        Stoc live
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Action Shortcuts Cards (Light Cards) */}
            <div className="grid grid-cols-1 [min-[430px]:grid-cols-2] lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Card 1 */}
              <button
                onClick={() => setActiveTab('calculator')}
                className="bg-white border border-[#D9E2E1] hover:border-[#00A878] p-4 rounded-2xl text-left transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md group flex flex-col justify-between space-y-2 min-h-[140px] sm:min-h-[160px] cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-[#DDF5EE] text-[#087F5B] rounded-xl flex items-center justify-center font-bold group-hover:bg-[#087F5B] group-hover:text-white transition-colors">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#5C6670] group-hover:text-[#087F5B] group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#0D1B2A]">Calculează materialele</h4>
                  <p className="text-[11px] text-[#5C6670] mt-0.5 leading-tight font-medium">Află cantitatea necesară și rezerva recomandată.</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#087F5B] mt-1.5">
                    Deschide calculatorul
                  </span>
                </div>
              </button>

              {/* Card 2 */}
              <button
                onClick={() => setActiveTab('craftsmen')}
                className="bg-white border border-[#D9E2E1] hover:border-[#00A878] p-4 rounded-2xl text-left transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md group flex flex-col justify-between space-y-2 min-h-[140px] sm:min-h-[160px] cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-[#DDF5EE] text-[#087F5B] rounded-xl flex items-center justify-center font-bold group-hover:bg-[#087F5B] group-hover:text-white transition-colors">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#5C6670] group-hover:text-[#087F5B] group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#0D1B2A]">Găsește un meșter</h4>
                  <p className="text-[11px] text-[#5C6670] mt-0.5 leading-tight font-medium">Alege profesioniști verificați din regiunea ta.</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#087F5B] mt-1.5">
                    Vezi meșterii
                  </span>
                </div>
              </button>

              {/* Card 3 */}
              <button
                onClick={() => setActiveTab('solutions')}
                className="bg-white border border-[#D9E2E1] hover:border-[#00A878] p-4 rounded-2xl text-left transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md group flex flex-col justify-between space-y-2 min-h-[140px] sm:min-h-[160px] cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-[#DDF5EE] text-[#087F5B] rounded-xl flex items-center justify-center font-bold group-hover:bg-[#087F5B] group-hover:text-white transition-colors">
                    <Layers className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#5C6670] group-hover:text-[#087F5B] group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#0D1B2A]">Soluții complete</h4>
                  <p className="text-[11px] text-[#5C6670] mt-0.5 leading-tight font-medium">Pachete pentru baie, zugrăvire, gresie și termoizolație.</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#087F5B] mt-1.5">
                    Alege lucrarea
                  </span>
                </div>
              </button>

              {/* Card 4 */}
              <button
                onClick={() => setActiveTab('b2b')}
                className="bg-white border border-[#D9E2E1] hover:border-[#00A878] p-4 rounded-2xl text-left transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md group flex flex-col justify-between space-y-2 min-h-[140px] sm:min-h-[160px] cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-[#DDF5EE] text-[#087F5B] rounded-xl flex items-center justify-center font-bold group-hover:bg-[#087F5B] group-hover:text-white transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#5C6670] group-hover:text-[#087F5B] group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#0D1B2A]">Pentru profesioniști</h4>
                  <p className="text-[11px] text-[#5C6670] mt-0.5 leading-tight font-medium">Prețuri speciale, comenzi pe șantier și avantaje Meister Club.</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#087F5B] mt-1.5">
                    Descoperă avantajele
                  </span>
                </div>
              </button>

            </div>

            {/* Homepage Commercial Sections */}
            <PromotionsSection
              products={MOCK_PRODUCTS}
              currentRole={currentRole}
              selectedStore={selectedStore}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onOpenDetail={(p) => navigateToProduct(getProductSlug(p))}
              onNavigateToPromotions={navigateToPromotions}
            />

            <NewsSection
              products={MOCK_PRODUCTS}
              currentRole={currentRole}
              selectedStore={selectedStore}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onOpenDetail={(p) => navigateToProduct(getProductSlug(p))}
              onNavigateToNews={navigateToNews}
            />

            {/* Section Header Before Products/Categories */}
            <div id="products-catalog-section" className="scroll-mt-32 space-y-4 pt-2">
              
              {/* Responsive Header: Stacked on Mobile, Inline on Desktop */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#D9E2E1] pb-3">
                <div className="space-y-0.5">
                  <h2 className="text-xl sm:text-2xl font-black text-[#0D1B2A] tracking-tight">Catalog produse CodeBau</h2>
                  <p className="text-xs text-[#5C6670] font-medium">Descoperă materiale și echipamente disponibile în {selectedStore}.</p>
                </div>
                <button 
                  onClick={() => { 
                    setSelectedCategory('all'); 
                    setCatalogTypeFilter('all');
                    setActiveTab('catalog'); 
                  }} 
                  className="text-xs font-bold text-[#087F5B] hover:text-[#066B4D] flex items-center gap-1 transition-colors self-start sm:self-auto pt-1 sm:pt-0 cursor-pointer"
                >
                  <span>Resetează filtrele</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Commercial Filter Bar (Toate, Noutăți, Promoții, Recomandate) - Horizontal Scroll on Mobile */}
              <div className="bg-white p-2 sm:p-3 rounded-2xl border border-[#D9E2E1] shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-extrabold">
                <button
                  onClick={() => setCatalogTypeFilter('all')}
                  className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    catalogTypeFilter === 'all'
                      ? 'bg-[#0D1B2A] text-white shadow-xs'
                      : 'bg-[#F8FAF9] text-[#5C6670] hover:text-[#0D1B2A]'
                  }`}
                >
                  Toate Produsele ({MOCK_PRODUCTS.length})
                </button>

                <button
                  onClick={() => setCatalogTypeFilter('noutati')}
                  className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    catalogTypeFilter === 'noutati'
                      ? 'bg-[#087F5B] text-white shadow-xs'
                      : 'bg-[#DDF5EE] text-[#087F5B] hover:bg-[#087F5B] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Noutăți</span>
                </button>

                <button
                  onClick={() => setCatalogTypeFilter('promotii')}
                  className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    catalogTypeFilter === 'promotii'
                      ? 'bg-[#F4B400] text-[#0D1B2A] shadow-xs'
                      : 'bg-amber-100 text-amber-800 hover:bg-[#F4B400] hover:text-[#0D1B2A]'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 fill-current" />
                  <span>Promoții & Reduceri</span>
                </button>

                <button
                  onClick={() => setCatalogTypeFilter('recomandate')}
                  className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    catalogTypeFilter === 'recomandate'
                      ? 'bg-[#0D1B2A] text-white shadow-xs'
                      : 'bg-[#F8FAF9] text-[#5C6670] hover:text-[#0D1B2A]'
                  }`}
                >
                  Recomandate (Top Calitate)
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="relative pt-1">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold scrollbar-none flex-nowrap pr-8">
                  {[
                    { id: 'all', name: 'Toate Categoriile' },
                    { id: 'Adezivi & Grunduri', name: 'Adezivi & Grunduri' },
                    { id: 'Plăci Ceramice & Parchet', name: 'Gresie & Faianță' },
                    { id: 'Vopsele & Tencuieli', name: 'Vopsele & Lavabile' },
                    { id: 'Termoizolații', name: 'Polistiren & Izolații' },
                    { id: 'Scule & Echipamente', name: 'Scule & Unelte Pro' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      aria-label={`Filtrează categoria ${cat.name}`}
                      className={`px-4 py-2 rounded-xl border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#087F5B] text-white border-[#087F5B] font-extrabold shadow-sm'
                          : 'bg-white text-[#0D1B2A] border-[#D9E2E1] hover:border-[#00A878]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentRole={currentRole}
                  selectedStore={selectedStore}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onOpenDetail={(p) => navigateToProduct(getProductSlug(p))}
                  isFavorite={favoriteIds.includes(product.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

          </div>
        )}

        {/* VIEW: FULL PRODUCT DETAIL PAGE */}
        {activeTab === 'product_detail' && activeProductSlug && (() => {
          const currentProd = getProductBySlug(activeProductSlug, MOCK_PRODUCTS) || MOCK_PRODUCTS[0];
          return (
            <ProductDetailPage
              product={currentProd}
              userRole={currentRole}
              selectedStore={selectedStore}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favoriteIds.includes(currentProd.id)}
              onNavigateToProduct={navigateToProduct}
              onBackToCatalog={navigateBackToCatalog}
              onOpenAIAssistant={() => setIsAiModalOpen(true)}
              onOpenMeisterConnect={() => handleTabChange('craftsmen')}
            />
          );
        })()}

        {/* VIEW: NOUTATI DEDICATED PAGE */}
        {activeTab === 'noutati' && (
          <NewsPage
            currentRole={currentRole}
            selectedStore={selectedStore}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onOpenDetail={(p) => navigateToProduct(getProductSlug(p))}
            onNavigateHome={navigateBackToCatalog}
          />
        )}

        {/* VIEW: PROMOTII DEDICATED PAGE */}
        {activeTab === 'promotii' && (
          <PromotionsPage
            currentRole={currentRole}
            selectedStore={selectedStore}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onOpenDetail={(p) => navigateToProduct(getProductSlug(p))}
            onNavigateHome={navigateBackToCatalog}
          />
        )}
        {activeTab === 'calculator' && (
          <MaterialCalculatorView
            onAddMultipleToCart={handleAddMultipleToCart}
            onSelectCraftsman={() => setActiveTab('craftsmen')}
            onSaveProject={handleSaveProject}
          />
        )}

        {/* VIEW 3: CRAFTSMEN */}
        {activeTab === 'craftsmen' && (
          <CraftsmenView />
        )}

        {/* VIEW 4: SOLUTIONS */}
        {activeTab === 'solutions' && (
          <SolutionsView
            onAddMultipleToCart={handleAddMultipleToCart}
            onSelectCraftsman={() => setActiveTab('craftsmen')}
          />
        )}

        {/* VIEW 5: MEISTER CLUB */}
        {(activeTab === 'meister' || activeTab === 'meister_club') && (
          <MeisterClubView />
        )}

        {/* VIEW 6: B2B */}
        {activeTab === 'b2b' && (
          <B2BView />
        )}

        {/* VIEW 7: USER ACCOUNT */}
        {activeTab === 'account' && (
          <UserAccountView savedProjects={savedProjects} />
        )}

        {/* VIEW 8: ADMIN */}
        {activeTab === 'admin' && (
          <AdminView />
        )}

        {/* VIEW 9: CENTRUL CODEBAU (EDITORIAL CENTER) */}
        {(activeTab === 'guides' || activeTab === 'editorial') && (
          <EditorialCenterView
            currentRole={currentRole}
            selectedStore={selectedStore}
            onOpenArticle={(slug) => navigateToArticle(slug)}
            onNavigateCraftsmen={() => setActiveTab('craftsmen')}
            onNavigateB2B={() => setActiveTab('b2b')}
            onNavigateCalculator={() => setActiveTab('calculator')}
          />
        )}

        {/* VIEW 9B: ARTICLE DETAIL PAGE */}
        {activeTab === 'article_detail' && editorialArticleSlug && (
          <ArticleDetailPage
            slug={editorialArticleSlug}
            currentRole={currentRole}
            selectedStore={selectedStore}
            onBackToCenter={navigateToEditorialCenter}
            onOpenArticle={(slug) => navigateToArticle(slug)}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onNavigateSolution={(solId) => setActiveTab('solutions')}
            onNavigateCalculator={() => setActiveTab('calculator')}
          />
        )}

        {/* VIEW 9C: ADMIN ARTICLES */}
        {activeTab === 'admin_articles' && (
          <AdminArticlesView />
        )}

        {/* VIEW 10: STORES & CONTACT */}
        {activeTab === 'stores' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border border-[#D9E2E1] p-6 rounded-3xl space-y-2 shadow-sm">
              <h2 className="text-2xl font-extrabold text-[#0D1B2A]">Rețeaua de Magazine & Lockers CodeBau 24/7</h2>
              <p className="text-[#5C6670] text-xs font-medium">
                Infrastructură logistică unificată în sudul Republicii Moldova: Cahul, Cantemir, Vulcănești și Taraclia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_STORES.map((st) => (
                <div key={st.id} className="bg-white border border-[#D9E2E1] p-5 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#D9E2E1] pb-3">
                    <div>
                      <h3 className="font-extrabold text-base text-[#0D1B2A]">{st.name}</h3>
                      <p className="text-xs text-[#087F5B] font-bold">{st.town} • {st.address}</p>
                    </div>
                    <span className="bg-[#EFFAF6] border border-[#00A878]/30 text-[#00A878] font-extrabold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#00A878] animate-pulse"></span>
                      {st.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-[#5C6670] font-medium">
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#087F5B]" />
                      <span>{st.schedule}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#087F5B]" />
                      <span>{st.estimatedDelivery}</span>
                    </p>
                    {st.lockerAvailable && (
                      <p className="flex items-center gap-2 text-[#087F5B] font-bold">
                        <CheckCircle2 className="w-4 h-4 text-[#087F5B]" />
                        <span>Locker CodeBau 24/7 activ pentru comenzi cu ridicare</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 11: FULL CART PAGE /COS */}
        {activeTab === 'cart' && (
          <CartPage
            cartItems={cartItems}
            savedItems={savedItems}
            selectedStore={selectedStore}
            onStoreChange={setSelectedStore}
            currentRole={currentRole}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onSaveForLater={handleSaveForLater}
            onMoveToCartFromSaved={handleMoveToCartFromSaved}
            onRemoveSavedItem={handleRemoveSavedItem}
            onClearCart={handleClearCart}
            onAddToCart={handleAddToCart}
            onNavigateToProduct={navigateToProduct}
            onNavigateToCatalog={navigateBackToCatalog}
            onNavigateToCheckout={navigateToCheckout}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {/* VIEW 12: FINALIZARE COMANDA /FINALIZARE-COMANDA */}
        {activeTab === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            selectedStore={selectedStore}
            onStoreChange={setSelectedStore}
            currentRole={currentRole}
            onClearCart={handleClearCart}
            onNavigateToCart={navigateToCart}
            onNavigateToConfirmation={navigateToConfirmation}
            onNavigateToCatalog={navigateBackToCatalog}
            savedProjects={savedProjects}
            onAddProject={handleSaveProject}
          />
        )}

        {/* VIEW 13: COMANDA CONFIRMATA /COMANDA-CONFIRMATA/:ORDERNUMBER */}
        {activeTab === 'confirmation' && (
          <OrderConfirmationView
            orderNumber={confirmedOrderNumber}
            onNavigateToCatalog={navigateBackToCatalog}
            onNavigateToUserAccount={() => setActiveTab('account')}
          />
        )}

      </main>

      {/* Product Detail Modal (Quick View) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        currentRole={currentRole}
        selectedStore={selectedStore}
        onOpenCraftsmen={() => {
          setSelectedProduct(null);
          handleTabChange('craftsmen');
        }}
        onGoToFullPage={(p) => {
          setSelectedProduct(null);
          navigateToProduct(getProductSlug(p));
        }}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentRole={currentRole}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onSaveForLater={handleSaveForLater}
        onClearCart={handleClearCart}
        currentRole={currentRole}
        selectedStore={selectedStore}
        onOrderPlaced={handleOrderPlaced}
        onNavigateToCartPage={navigateToCart}
        onNavigateToCheckout={navigateToCart}
      />

      {/* QA Testing Panel Modal */}
      <QATestScenariosModal
        isOpen={isQAModalOpen}
        onClose={() => setIsQAModalOpen(false)}
        onRunScenario={handleRunQAScenario}
      />

      {/* Footer */}
      <Footer onTabChange={setActiveTab} />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

    </div>
  );
}
