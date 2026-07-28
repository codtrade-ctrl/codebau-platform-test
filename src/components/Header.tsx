import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, Heart, User, MapPin, QrCode, 
  Sparkles, Menu, X, ChevronDown, Wrench, Building2, ShieldCheck,
  Calculator, Layers, BookOpen, Clock, Tag, Store, Truck, Phone, Code, Check, PackageCheck
} from 'lucide-react';
import { UserRole } from '../types';
import { CodeBauLogo } from './CodeBauLogo';
import { MegaMenu } from './MegaMenu';
import { DemoRolesModal } from './DemoRolesModal';

export interface HeaderProps {
  currentRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onSelectRole?: (role: UserRole) => void;
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAI?: () => void;
  onOpenAiAssistant?: () => void;
  selectedStore?: string;
  setSelectedStore?: (store: string) => void;
  onStoreChange?: (store: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  favoritesCount?: number;
  onSelectCategory?: (category: string) => void;
  onOpenQAModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onSelectRole,
  activeTab,
  setActiveTab,
  onTabChange,
  cartCount,
  onOpenCart,
  onOpenAI,
  onOpenAiAssistant,
  selectedStore = 'CodeBau Cahul',
  setSelectedStore,
  onStoreChange,
  searchQuery = '',
  setSearchQuery,
  favoritesCount = 0,
  onSelectCategory,
  onOpenQAModal
}) => {
  const handleRoleSelect = onRoleChange || onSelectRole || (() => {});
  const handleTabChange = onTabChange || setActiveTab || (() => {});
  const handleStoreChange = onStoreChange || setSelectedStore || (() => {});
  const handleOpenAI = onOpenAiAssistant || onOpenAI || (() => {});
  const handleSearchChange = setSearchQuery || (() => {});

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaMenuOpen(false);
        setSolutionsDropdownOpen(false);
        setMobileMenuOpen(false);
        setBarcodeModalOpen(false);
        setDemoModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSimulateScan = (code: string) => {
    handleSearchChange(code);
    handleTabChange('catalog');
    setBarcodeModalOpen(false);
  };

  const handleCategoryClick = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      handleSearchChange(cat);
    }
    handleTabChange('catalog');
    setMegaMenuOpen(false);
  };

  const solutionSubCategories = [
    { name: 'Calculator materiale', action: () => handleTabChange('calculator') },
    { name: 'Renovare baie', action: () => handleTabChange('solutions') },
    { name: 'Renovare bucătărie', action: () => handleTabChange('solutions') },
    { name: 'Zugrăvire & Lavabile', action: () => handleTabChange('solutions') },
    { name: 'Montare gresie & faianță', action: () => handleTabChange('solutions') },
    { name: 'Termoizolație fațadă', action: () => handleTabChange('solutions') },
    { name: 'Sistem acoperiș', action: () => handleTabChange('solutions') },
    { name: 'Instalații electrice', action: () => handleTabChange('solutions') },
    { name: 'Instalații sanitare', action: () => handleTabChange('solutions') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0D1B2A] text-white shadow-xl border-b border-[#1A3448]">
      
      {/* ================= ZONE 1: THIN INFORMATIONAL TOP BAR ================= */}
      <div className="bg-[#081420] border-b border-[#1A3448] text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Left: Store Selector + Live Stock Badge */}
          <div className="flex items-center gap-2 sm:gap-3 text-slate-300 min-w-0">
            <div className="flex items-center gap-1.5 bg-[#13283A] px-2 sm:px-2.5 py-0.5 rounded-lg border border-[#1A3448] text-slate-200 font-semibold text-xs shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#00A878] shrink-0" />
              <span className="text-slate-400 text-[11px] hidden sm:inline">Magazin:</span>
              <select 
                aria-label="Selectează magazinul CodeBau"
                value={selectedStore} 
                onChange={(e) => handleStoreChange(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="CodeBau Cahul" className="bg-[#0D1B2A] text-white">CodeBau Cahul</option>
                <option value="CodeBau Cantemir" className="bg-[#0D1B2A] text-white">CodeBau Cantemir</option>
                <option value="CodeBau Vulcănești" className="bg-[#0D1B2A] text-white">CodeBau Vulcănești</option>
                <option value="CodeBau Taraclia" className="bg-[#0D1B2A] text-white">CodeBau Taraclia</option>
              </select>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] text-[#00A878] font-bold bg-[#00A878]/10 border border-[#00A878]/30 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A878] animate-pulse"></span>
              Stoc live
            </span>
          </div>

          {/* Right: Quick Features & Discrete Demo Roles Trigger */}
          <div className="flex items-center gap-2 sm:gap-4 text-[11px] text-slate-300 shrink-0">
            <div className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00A878]" />
              <span>Ridicare 24/7</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#00A878]" />
              <span>Livrare în sudul Moldovei</span>
            </div>

            <button 
              onClick={() => handleTabChange('stores')}
              className="hidden sm:flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-slate-400" />
              <span>Contact</span>
            </button>

            {/* Compact Demo Role Badge (Amber) */}
            <button
              onClick={() => setDemoModalOpen(true)}
              aria-label="Schimbă rolul demonstrativ"
              className="flex items-center gap-1 bg-[#F4B400] hover:bg-[#d9a000] text-[#0D1B2A] px-2 sm:px-2.5 py-0.5 rounded-md text-[11px] font-extrabold transition-all shrink-0 cursor-pointer shadow-sm"
              title="Schimbă rolul demonstrativ (Client, Meșter, B2B, Admin)"
            >
              <Code className="w-3 h-3 text-[#0D1B2A]" />
              <span className="hidden sm:inline">Demo roluri</span>
              <span className="sm:hidden">Demo</span>
            </button>
          </div>

        </div>
      </div>

      {/* ================= ZONE 2: MAIN HEADER ================= */}
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          
          {/* Logo */}
          <div 
            onClick={() => handleTabChange('home')} 
            className="cursor-pointer flex-shrink-0"
          >
            <CodeBauLogo size="md" variant="dark" />
          </div>

          {/* Prominent Search Bar with QR scanner & "Întreabă AI" */}
          <div className="hidden md:flex flex-1 max-w-2xl items-center relative">
            <div className="relative w-full flex items-center">
              <Search className="w-4 h-4 text-[#087F5B] absolute left-3.5 pointer-events-none" />
              
              <input
                type="text"
                placeholder="Caută produse, coduri, categorii sau soluții..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => { if (activeTab !== 'catalog') handleTabChange('catalog'); }}
                className="w-full bg-white text-[#0D1B2A] placeholder-[#5C6670] text-xs rounded-xl pl-10 pr-28 py-2.5 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B] focus:ring-2 focus:ring-[#00A878]/20 transition-all shadow-sm font-medium"
              />

              {/* QR / Barcode Scanner */}
              <button
                onClick={() => setBarcodeModalOpen(true)}
                title="Scanează cod de bare în magazin"
                className="absolute right-24 p-1 text-[#5C6670] hover:text-[#087F5B] rounded-lg transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
              </button>

              {/* Integrated "Întreabă AI" Button */}
              <button
                onClick={handleOpenAI}
                className="absolute right-1.5 bg-[#EFFAF6] border border-[#00A878]/40 hover:bg-[#DDF5EE] text-[#087F5B] font-extrabold text-[11px] px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                title="Asistent AI CodeBau"
              >
                <Sparkles className="w-3.5 h-3.5 fill-[#087F5B] text-[#087F5B]" />
                <span>Întreabă AI</span>
              </button>
            </div>
          </div>

          {/* Right Action Icons: Favorite, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Favorite */}
            <button
              onClick={() => handleTabChange('account')}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-[#13283A] rounded-xl transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Produse Favorite"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-slate-300" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline">Favorite</span>
            </button>

            {/* Account */}
            <button
              onClick={() => {
                if (currentRole === 'meister') handleTabChange('meister');
                else if (currentRole === 'b2b') handleTabChange('b2b');
                else if (currentRole === 'admin') handleTabChange('admin');
                else handleTabChange('account');
              }}
              className="flex items-center gap-1.5 bg-[#13283A] hover:bg-[#1A3448] border border-[#1A3448] px-3 py-2 rounded-xl transition-all text-xs font-semibold text-slate-200 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#00A878]" />
              <span className="hidden sm:inline">Contul meu</span>
            </button>

            {/* Cart Trigger (Primary Teal CTA, Amber Badge) */}
            <button
              onClick={onOpenCart}
              aria-label={`Deschide coșul, ${cartCount} produse`}
              className="relative bg-[#087F5B] hover:bg-[#066B4D] active:scale-[0.98] text-white px-3.5 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              <span>Coș</span>
              {cartCount > 0 && (
                <span className="bg-[#F4B400] text-[#0D1B2A] font-black text-[10px] px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* Mobile Full Width Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full flex items-center">
            <Search className="w-4 h-4 text-[#087F5B] absolute left-3 pointer-events-none" />
            
            <input
              type="text"
              placeholder="Caută produse, coduri, categorii..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-white text-[#0D1B2A] placeholder-[#5C6670] text-xs rounded-xl pl-9 pr-24 py-2 border border-[#D9E2E1] focus:outline-none focus:border-[#087F5B]"
            />

            <button
              onClick={() => setBarcodeModalOpen(true)}
              className="absolute right-20 p-1 text-[#5C6670]"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleOpenAI}
              className="absolute right-1 bg-[#EFFAF6] border border-[#00A878]/40 text-[#087F5B] font-extrabold text-[10px] px-2 py-1 rounded-lg flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 fill-[#087F5B]" />
              <span>AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= ZONE 3: MAIN NAVIGATION MENU ================= */}
      <nav className="hidden md:block bg-[#081420] border-t border-[#1A3448] text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 relative">
          
          {/* Acasă */}
          <button
            onClick={() => handleTabChange('home')}
            className={`px-3.5 py-2.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'home'
                ? 'text-[#00A878] font-extrabold border-b-2 border-[#00A878] bg-[#00A878]/10'
                : 'text-slate-300 hover:text-white hover:bg-[#13283A]'
            }`}
          >
            Acasă
          </button>

          {/* Produse (Mega-Menu) */}
          <div 
            className="relative"
            onMouseEnter={() => {
              if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
              setMegaMenuOpen(true);
            }}
            onMouseLeave={() => {
              megaMenuTimeoutRef.current = setTimeout(() => {
                setMegaMenuOpen(false);
              }, 150);
            }}
          >
            <button
              onClick={() => {
                handleTabChange('catalog');
                setMegaMenuOpen(!megaMenuOpen);
              }}
              className={`px-3.5 py-2.5 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'catalog' || megaMenuOpen
                  ? 'text-[#00A878] font-extrabold border-b-2 border-[#00A878] bg-[#00A878]/10'
                  : 'text-slate-300 hover:text-white hover:bg-[#13283A]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#00A878]" />
              <span>Produse & Catalog</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Noutăți */}
          <button
            onClick={() => handleTabChange('noutati')}
            className={`px-3 py-2.5 transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'noutati'
                ? 'text-[#00A878] font-extrabold border-b-2 border-[#00A878] bg-[#00A878]/10'
                : 'text-slate-300 hover:text-white hover:bg-[#13283A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00A878] stroke-[2.5]" />
            <span>Noutăți</span>
          </button>

          {/* Promoții */}
          <button
            onClick={() => handleTabChange('promotii')}
            className={`px-3 py-2.5 transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'promotii'
                ? 'text-amber-400 font-extrabold border-b-2 border-amber-400 bg-amber-400/10'
                : 'text-slate-300 hover:text-white hover:bg-[#13283A]'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Promoții</span>
            <span className="bg-[#F4B400] text-[#0D1B2A] text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ml-0.5">
              PROMO
            </span>
          </button>
          <div 
            className="relative"
            onMouseEnter={() => setSolutionsDropdownOpen(true)}
            onMouseLeave={() => setSolutionsDropdownOpen(false)}
          >
            <button
              onClick={() => handleTabChange('solutions')}
              className={`px-3.5 py-2.5 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'solutions' || activeTab === 'calculator' || solutionsDropdownOpen
                  ? 'text-[#00A878] font-extrabold border-b-2 border-[#00A878] bg-[#00A878]/10'
                  : 'text-slate-300 hover:text-white hover:bg-[#13283A]'
              }`}
            >
              <span>Soluții complete</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${solutionsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Soluții Subdropdown */}
            {solutionsDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-[#D9E2E1] shadow-2xl rounded-2xl py-2.5 z-50 animate-in fade-in slide-in-from-top-1">
                {solutionSubCategories.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      sub.action();
                      setSolutionsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#0D1B2A] font-semibold hover:text-[#087F5B] hover:bg-[#EFFAF6] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{sub.name}</span>
                    {sub.name === 'Calculator materiale' && (
                      <span className="bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                        PRO
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Servicii */}
          <button
            onClick={() => handleTabChange('solutions')}
            className={`px-3.5 py-2.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'services'
                ? 'text-[#00A878] font-extrabold border-b-2 border-[#00A878] bg-[#00A878]/10'
                : 'text-slate-300 hover:text-white hover:bg-[#13283A]'
            }`}
          >
            Servicii
          </button>

          {/* Găsește un meșter */}
          <button
            onClick={() => handleTabChange('craftsmen')}
            className={`px-3.5 py-2.5 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'craftsmen'
                ? 'text-[#00A878] font-extrabold border-b-2 border-[#00A878] bg-[#00A878]/10'
                : 'text-slate-300 hover:text-white hover:bg-[#13283A]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-[#00A878]" />
            <span>Găsește un meșter</span>
          </button>

          {/* Meister Club */}
          <button
            onClick={() => handleTabChange('meister')}
            className={`px-3.5 py-2.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'meister' || activeTab === 'meister_club'
                ? 'text-[#00A878] font-extrabold border-b-2 border-[#00A878] bg-[#00A878]/10'
                : 'text-slate-300 hover:text-white hover:bg-[#13283A]'
            }`}
          >
            Meister Club
          </button>

          {/* Pentru companii */}
          <button
            onClick={() => handleTabChange('b2b')}
            className={`px-3.5 py-2.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'b2b'
                ? 'text-[#00A878] font-extrabold border-b-2 border-[#00A878] bg-[#00A878]/10'
                : 'text-slate-300 hover:text-white hover:bg-[#13283A]'
            }`}
          >
            Pentru companii
          </button>

          {/* Centrul CodeBau */}
          <button
            onClick={() => handleTabChange('guides')}
            className={`px-3.5 py-2.5 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'guides' || activeTab === 'editorial'
                ? 'text-[#00A878] font-extrabold border-b-2 border-[#00A878] bg-[#00A878]/10'
                : 'text-slate-300 hover:text-white hover:bg-[#13283A]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Centrul CodeBau</span>
          </button>

        </div>
      </nav>

      {/* Mega Menu Component Overlay */}
      <MegaMenu
        isOpen={megaMenuOpen}
        onClose={() => setMegaMenuOpen(false)}
        onSelectCategory={handleCategoryClick}
        onViewAllProducts={() => {
          handleTabChange('catalog');
          setMegaMenuOpen(false);
        }}
      />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D1B2A] border-b border-[#1A3448] p-4 space-y-4 animate-in slide-in-from-top duration-200 text-white">
          <div className="space-y-1.5 text-xs font-semibold">
            <button 
              onClick={() => { handleTabChange('catalog'); setMobileMenuOpen(false); }} 
              className="w-full text-left bg-[#13283A] hover:bg-[#1A3448] p-3 rounded-xl text-white flex items-center gap-2 font-extrabold cursor-pointer transition-colors"
            >
              <Layers className="w-4 h-4 text-[#00A878]" />
              <span>Produse & Catalog</span>
            </button>

            <button 
              onClick={() => { handleTabChange('calculator'); setMobileMenuOpen(false); }} 
              className="w-full text-left bg-[#DDF5EE] border border-[#00A878]/30 p-3 rounded-xl text-[#087F5B] font-extrabold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Calculator className="w-4 h-4 text-[#087F5B]" />
              <span>Calculator Materiale</span>
            </button>

            <button 
              onClick={() => { handleTabChange('solutions'); setMobileMenuOpen(false); }} 
              className="w-full text-left bg-[#13283A] hover:bg-[#1A3448] p-3 rounded-xl text-slate-200 cursor-pointer transition-colors font-bold"
            >
              Soluții Complete & Servicii
            </button>

            <button 
              onClick={() => { handleTabChange('craftsmen'); setMobileMenuOpen(false); }} 
              className="w-full text-left bg-[#13283A] hover:bg-[#1A3448] p-3 rounded-xl text-slate-200 flex items-center gap-2 cursor-pointer transition-colors font-bold"
            >
              <Wrench className="w-4 h-4 text-[#00A878]" />
              <span>Găsește un meșter</span>
            </button>

            <button 
              onClick={() => { handleTabChange('meister'); setMobileMenuOpen(false); }} 
              className="w-full text-left bg-[#FEF3C7] text-[#B45309] p-3 rounded-xl font-extrabold cursor-pointer border border-[#F59E0B]/30"
            >
              Meister Club
            </button>

            <button 
              onClick={() => { handleTabChange('b2b'); setMobileMenuOpen(false); }} 
              className="w-full text-left bg-[#13283A] text-slate-200 p-3 rounded-xl font-bold cursor-pointer hover:bg-[#1A3448]"
            >
              Pentru companii (B2B)
            </button>

            <button 
              onClick={() => { handleTabChange('guides'); setMobileMenuOpen(false); }} 
              className="w-full text-left bg-[#13283A] hover:bg-[#1A3448] p-3 rounded-xl text-slate-200 flex items-center gap-2 cursor-pointer font-bold"
            >
              <BookOpen className="w-4 h-4 text-[#00A878]" />
              <span>Centrul CodeBau</span>
            </button>

            <button 
              onClick={() => { handleTabChange('stores'); setMobileMenuOpen(false); }} 
              className="w-full text-left bg-[#13283A] hover:bg-[#1A3448] p-3 rounded-xl text-slate-200 cursor-pointer font-bold"
            >
              Magazine & Contact
            </button>
          </div>

          <div className="pt-3 border-t border-[#1A3448] flex items-center justify-between">
            <button
              onClick={() => {
                setDemoModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#00A878] font-extrabold flex items-center gap-1 bg-[#13283A] px-3 py-2 rounded-xl cursor-pointer"
            >
              <Code className="w-4 h-4" />
              <span>Demo roluri</span>
            </button>

            <span className="text-[11px] text-slate-400 font-medium">CodeBau Sudul RM</span>
          </div>
        </div>
      )}

      {/* Demo Roles Modal */}
      <DemoRolesModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        currentRole={currentRole}
        onSelectRole={handleRoleSelect}
      />

      {/* Barcode Scanner Simulation Modal */}
      {barcodeModalOpen && (
        <div className="fixed inset-0 bg-[#0D1B2A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1B2A] border border-[#1A3448] text-white p-6 rounded-3xl max-w-md w-full relative shadow-2xl space-y-4">
            <button 
              onClick={() => setBarcodeModalOpen(false)} 
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white rounded-xl bg-[#13283A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-[#DDF5EE] text-[#087F5B] rounded-2xl flex items-center justify-center mx-auto border border-[#00A878]/30">
                <QrCode className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold">Scaner Cod de Bare CodeBau</h3>
              <p className="text-xs text-slate-300 font-medium">
                Ești în magazinul fizic (Cahul, Cantemir, Vulcănești sau Taraclia)? Scanează codul produsului pentru a vedea stocul și prețul special.
              </p>
            </div>

            <div className="bg-[#13283A] p-4 rounded-2xl border border-dashed border-[#1A3448] text-xs space-y-2">
              <p className="text-slate-300 text-center font-bold">Apasă pentru a simula scanarea:</p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleSimulateScan('CER-CM17-25')} 
                  className="bg-[#0D1B2A] hover:bg-[#1A3448] p-2.5 rounded-xl font-mono text-[#00A878] text-left hover:text-white transition-colors cursor-pointer font-bold"
                >
                  [CER-CM17-25] Ceresit CM 17 Flexibil 25kg
                </button>
                <button 
                  onClick={() => handleSimulateScan('MAR-POR-6060')} 
                  className="bg-[#0D1B2A] hover:bg-[#1A3448] p-2.5 rounded-xl font-mono text-[#00A878] text-left hover:text-white transition-colors cursor-pointer font-bold"
                >
                  [MAR-POR-6060] Gresie Porțelanată Marazzi 60x60
                </button>
                <button 
                  onClick={() => handleSimulateScan('SAV-LAV-15L')} 
                  className="bg-[#0D1B2A] hover:bg-[#1A3448] p-2.5 rounded-xl font-mono text-[#00A878] text-left hover:text-white transition-colors cursor-pointer font-bold"
                >
                  [SAV-LAV-15L] Savana Vopsea Lavabilă 15L
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
