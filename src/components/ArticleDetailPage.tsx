import React, { useState } from 'react';
import { Article, Product, UserRole } from '../types';
import { EditorialService } from '../services/EditorialService';
import { PromotionService } from '../services/PromotionService';
import { MOCK_PRODUCTS, MOCK_SOLUTIONS } from '../data/mockData';
import { ChevronRight, Calendar, Clock, Share2, Copy, Check, BookOpen, AlertTriangle, ArrowLeft, ShoppingCart, Calculator, Layers, ShieldCheck, CheckCircle2, ChevronDown } from 'lucide-react';

interface ArticleDetailPageProps {
  slug: string;
  currentRole: UserRole;
  selectedStore: string;
  onBackToCenter: () => void;
  onOpenArticle: (slug: string) => void;
  onAddToCart?: (product: Product) => void;
  onNavigateSolution?: (solutionId: string) => void;
  onNavigateCalculator?: () => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  slug,
  currentRole,
  selectedStore,
  onBackToCenter,
  onOpenArticle,
  onAddToCart,
  onNavigateSolution,
  onNavigateCalculator
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);

  const article = EditorialService.getArticleBySlug(slug) || EditorialService.getArticles()[0];
  const categories = EditorialService.getCategories();
  const category = categories.find(c => c.id === article.categoryId) || categories[0];
  const author = EditorialService.getAuthorById(article.authorId);

  // Extract headings from markdown content for Table of Contents
  const headingMatches = Array.from(article.content.matchAll(/^(##|###)\s+(.+)$/gm));
  const tocItems = headingMatches.map((match, idx) => ({
    id: `heading-${idx}`,
    level: match[1] === '##' ? 2 : 3,
    text: match[2].trim()
  }));

  // Map related products from catalog
  const relatedProducts: Product[] = (article.relatedProductIds || [])
    .map(id => MOCK_PRODUCTS.find(p => p.id === id || p.slug === id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, 4);

  // Map related solutions
  const relatedSolutions = (article.relatedSolutionIds || [])
    .map(id => MOCK_SOLUTIONS.find(s => s.id === id || s.slug === id))
    .filter(Boolean)
    .slice(0, 2);

  // Related articles in same category
  const similarArticles = EditorialService.getPublishedArticles(article.categoryId)
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -120; // Offset for sticky header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Convert markdown to rich elements
  const renderFormattedContent = () => {
    const lines = article.content.split('\n');
    let headingCounter = 0;

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) return <div key={idx} className="h-3" />;

      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace('## ', '');
        const headingId = `heading-${headingCounter++}`;
        return (
          <h2 key={idx} id={headingId} className="text-xl sm:text-2xl font-black text-[#0D1B2A] mt-8 mb-3 pt-4 border-t border-[#D9E2E1] tracking-tight">
            {text}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        const text = trimmed.replace('### ', '');
        const headingId = `heading-${headingCounter++}`;
        return (
          <h3 key={idx} id={headingId} className="text-lg font-bold text-[#0D1B2A] mt-6 mb-2">
            {text}
          </h3>
        );
      }

      if (trimmed.startsWith('> ')) {
        const text = trimmed.replace('> ', '');
        return (
          <blockquote key={idx} className="my-5 p-4 bg-[#EFFAF6] border-l-4 border-[#087F5B] rounded-r-2xl italic text-xs sm:text-sm text-[#0D1B2A] font-medium shadow-2xs">
            {text}
          </blockquote>
        );
      }

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const text = trimmed.replace(/^(\*|-)\s+/, '');
        return (
          <li key={idx} className="ml-5 list-disc text-xs sm:text-sm text-[#0D1B2A] leading-relaxed font-medium py-1">
            {text}
          </li>
        );
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        const text = trimmed.replace(/^\d+\.\s+/, '');
        return (
          <li key={idx} className="ml-5 list-decimal text-xs sm:text-sm text-[#0D1B2A] leading-relaxed font-bold py-1">
            {text}
          </li>
        );
      }

      if (trimmed.startsWith('|')) {
        // Simple table rendering placeholder
        return (
          <p key={idx} className="text-xs font-mono bg-slate-50 p-2 rounded border border-[#D9E2E1] overflow-x-auto my-2">
            {trimmed}
          </p>
        );
      }

      return (
        <p key={idx} className="text-xs sm:text-sm text-[#0D1B2A] leading-relaxed font-medium my-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200 max-w-7xl mx-auto">
      
      {/* 1. BREADCRUMBS & NAV BACK */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C6670] font-medium pt-2">
        <nav className="flex items-center gap-1.5 flex-wrap">
          <button onClick={onBackToCenter} className="hover:text-[#087F5B] cursor-pointer">
            Acasă
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button onClick={onBackToCenter} className="hover:text-[#087F5B] cursor-pointer">
            Centrul CodeBau
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[#087F5B] font-bold">{category.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
          <span className="text-[#0D1B2A] font-bold truncate max-w-[200px] hidden sm:inline">{article.title}</span>
        </nav>

        <button
          onClick={onBackToCenter}
          className="text-xs font-extrabold text-[#087F5B] hover:text-[#066B4D] flex items-center gap-1 cursor-pointer bg-[#EFFAF6] px-3 py-1.5 rounded-xl border border-[#00A878]/30"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Înapoi la Centrul CodeBau</span>
        </button>
      </div>

      {/* 2. DEMO TECHNICAL DISCLAIMER BANNER */}
      <div className="p-4 bg-[#FFFBEB] border border-[#F59E0B]/40 rounded-2xl text-xs text-[#78350F] flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-[#92400E]">Informație tehnică demonstrativă CodeBau</p>
          <p className="leading-relaxed">
            Conținut demonstrativ pentru testarea platformei. Recomandările tehnice finale trebuie verificate în documentația oficială a produselor furnizate în magazinele CodeBau.
          </p>
        </div>
      </div>

      {/* 3. HEADER ARTICOL */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#087F5B] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
            {category.name}
          </span>
          <span className="bg-[#EFFAF6] text-[#087F5B] border border-[#00A878]/30 text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verificat Tehnic</span>
          </span>
          {article.isTestData && (
            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
              isTestData: true
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#0D1B2A] tracking-tight leading-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-base sm:text-lg font-bold text-[#5C6670] leading-snug">
            {article.subtitle}
          </p>
        )}

        {/* Autor, Dată & Opțiuni Distribuire */}
        <div className="pt-3 border-t border-[#D9E2E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover border border-[#D9E2E1] shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#0D1B2A]">{author.name}</span>
                {author.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" />}
              </div>
              <p className="text-[11px] text-[#5C6670]">{author.role} • {author.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#5C6670] font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#087F5B]" />
              {article.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#087F5B]" />
              {article.readingTime}
            </span>
            <span>•</span>
            <button
              onClick={handleCopyLink}
              className="text-[#087F5B] hover:underline flex items-center gap-1 cursor-pointer font-extrabold"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link copiat!' : 'Distribuie'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 4. MAIN HERO IMAGE */}
      <div className="relative rounded-3xl overflow-hidden border border-[#D9E2E1] shadow-md max-h-[460px]">
        <img
          src={article.heroImage}
          alt={article.title}
          className="w-full h-full object-cover max-h-[460px]"
        />
      </div>

      {/* 5. CONTENT GRID (Main Content Left + Sidebar Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLOANA PRINCIPALĂ (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Table of Contents Accordion (Mobile Only) */}
          {tocItems.length > 0 && (
            <div className="lg:hidden bg-white border border-[#D9E2E1] rounded-2xl overflow-hidden shadow-2xs">
              <button
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                className="w-full p-4 flex items-center justify-between text-xs font-black text-[#0D1B2A] bg-[#EFFAF6]"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#087F5B]" />
                  <span>În acest ghid ({tocItems.length} secțiuni)</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileTocOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileTocOpen && (
                <div className="p-4 space-y-2 border-t border-[#D9E2E1] text-xs">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToHeading(item.id);
                        setMobileTocOpen(false);
                      }}
                      className="block w-full text-left text-[#0D1B2A] hover:text-[#087F5B] py-1 font-medium pl-2 border-l-2 border-[#D9E2E1]"
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Formatted Content */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#D9E2E1] shadow-2xs text-[#0D1B2A]">
            {renderFormattedContent()}
          </div>

          {/* SECȚIUNEA 9: PRODUSE RELEVANTE PENTRU ACEASTĂ LUCRARE */}
          {relatedProducts.length > 0 && (
            <section className="bg-[#EFFAF6] p-6 sm:p-8 rounded-3xl border border-[#00A878]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0D1B2A] tracking-tight">
                    Produse recomandate pentru această lucrare
                  </h3>
                  <p className="text-xs text-[#5C6670] font-medium">
                    Selectate direct din catalogul CodeBau cu stoc disponibil la {selectedStore}
                  </p>
                </div>
                <span className="bg-[#087F5B] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                  Catalog Live
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {relatedProducts.map((p) => {
                  const effective = getEffectivePrice(p, currentRole, selectedStore);

                  return (
                    <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#D9E2E1] shadow-2xs flex flex-col justify-between space-y-3">
                      <div className="flex gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded-xl border border-[#D9E2E1] shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold text-[#087F5B] uppercase">{p.brand}</span>
                          <h4 className="text-xs font-bold text-[#0D1B2A] line-clamp-2 leading-tight">
                            {p.name}
                          </h4>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#D9E2E1] flex items-center justify-between">
                        <div>
                          <p className="text-sm font-black text-[#087F5B]">
                            {effective.promotionalPrice.toFixed(2)} MDL
                          </p>
                          <p className="text-[10px] text-[#5C6670]">per {p.unit}</p>
                        </div>

                        {onAddToCart && (
                          <button
                            onClick={() => onAddToCart(p)}
                            className="bg-[#087F5B] hover:bg-[#066B4D] text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Adaugă</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SECȚIUNEA 10 & 11: SOLUȚII RELEVANTE & CALCULATOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Soluție CodeBau */}
            {relatedSolutions.length > 0 && (
              <div className="bg-[#0D1B2A] text-white p-6 rounded-3xl space-y-3 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[#00A878] text-xs font-black uppercase">
                  <Layers className="w-4 h-4" />
                  <span>Soluție completă</span>
                </div>
                <h4 className="text-base font-black text-white leading-tight">
                  {relatedSolutions[0].title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-2">
                  {relatedSolutions[0].description}
                </p>
                {onNavigateSolution && (
                  <button
                    onClick={() => onNavigateSolution(relatedSolutions[0].id)}
                    className="bg-[#00A878] hover:bg-[#008A63] text-white px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-colors w-full"
                  >
                    Vezi soluția completă
                  </button>
                )}
              </div>
            )}

            {/* Calculator Relevant */}
            {article.relatedCalculatorId && (
              <div className="bg-white border border-[#D9E2E1] p-6 rounded-3xl space-y-3 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[#087F5B] text-xs font-black uppercase">
                  <Calculator className="w-4 h-4" />
                  <span>Calculator Proiect</span>
                </div>
                <h4 className="text-base font-black text-[#0D1B2A] leading-tight">
                  Calculează necesarul de materiale
                </h4>
                <p className="text-xs text-[#5C6670] leading-relaxed font-medium">
                  Află exact câți saci de adeziv, litri de vopsea sau hidroizolație ai nevoie pentru suprafața ta.
                </p>
                {onNavigateCalculator && (
                  <button
                    onClick={onNavigateCalculator}
                    className="bg-[#087F5B] hover:bg-[#066B4D] text-white px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-colors w-full"
                  >
                    Deschide calculatorul
                  </button>
                )}
              </div>
            )}

          </div>

        </div>

        {/* COLOANA LATERALĂ / STICKY TOC (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Table of Contents Sticky (Desktop) */}
          {tocItems.length > 0 && (
            <div className="hidden lg:block bg-white p-6 rounded-3xl border border-[#D9E2E1] shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#0D1B2A] uppercase tracking-wider pb-2 border-b border-[#D9E2E1]">
                <BookOpen className="w-4 h-4 text-[#087F5B]" />
                <span>În acest ghid</span>
              </div>

              <nav className="space-y-1 text-xs">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    className={`block w-full text-left py-1.5 px-2 rounded-lg transition-colors font-medium truncate cursor-pointer ${
                      item.level === 3 ? 'pl-4 text-[#5C6670] hover:text-[#087F5B]' : 'text-[#0D1B2A] hover:bg-[#EFFAF6] hover:text-[#087F5B] font-bold'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Profil Autor Sidebar Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#D9E2E1] shadow-2xs space-y-3">
            <h4 className="text-xs font-black text-[#5C6670] uppercase tracking-wider">
              Despre Autor
            </h4>

            <div className="flex items-center gap-3">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-12 h-12 rounded-full object-cover border border-[#D9E2E1]"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-[#0D1B2A]">{author.name}</span>
                  {author.verified && <CheckCircle2 className="w-4 h-4 text-[#00A878]" />}
                </div>
                <p className="text-xs text-[#5C6670] font-medium">{author.role}</p>
              </div>
            </div>

            <p className="text-xs text-[#5C6670] leading-relaxed font-medium pt-1">
              {author.biography}
            </p>
          </div>

          {/* Banner Consultație Tehnică */}
          <div className="bg-[#EFFAF6] p-6 rounded-3xl border border-[#00A878]/30 space-y-3">
            <span className="bg-[#087F5B] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
              Suport Tehnic CodeBau
            </span>
            <h4 className="text-sm font-black text-[#0D1B2A]">
              Ai întrebări despre acest ghid?
            </h4>
            <p className="text-xs text-[#5C6670] font-medium leading-relaxed">
              Consultanții noștri din magazinele Cahul și Cantemir îți pot calcula consumurile exacte pentru proiectul tău.
            </p>
            <p className="text-xs font-bold text-[#087F5B]">
              Suport Telefon: +373 XX XXX XXX
            </p>
          </div>

        </div>

      </div>

      {/* SECȚIUNEA 13: ARTICOLE SIMILARE */}
      {similarArticles.length > 0 && (
        <section className="pt-8 border-t border-[#D9E2E1] space-y-4">
          <h3 className="text-xl font-black text-[#0D1B2A] tracking-tight">
            Ghiduri similare recomandate
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarArticles.map((s) => (
              <div
                key={s.id}
                onClick={() => onOpenArticle(s.slug)}
                className="bg-white rounded-2xl border border-[#D9E2E1] p-4 space-y-3 cursor-pointer hover:border-[#087F5B] transition-all hover:shadow-sm"
              >
                <img
                  src={s.heroImage}
                  alt={s.title}
                  className="w-full h-36 object-cover rounded-xl"
                />
                <span className="text-[10px] font-extrabold text-[#087F5B] uppercase">
                  {category.name}
                </span>
                <h4 className="text-sm font-bold text-[#0D1B2A] line-clamp-2">
                  {s.title}
                </h4>
                <p className="text-xs text-[#5C6670] line-clamp-2 font-medium">
                  {s.excerpt}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
