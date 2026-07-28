import React, { useState } from 'react';
import { Article, UserRole } from '../types';
import { EditorialService } from '../services/EditorialService';
import { BookOpen, Sparkles, ArrowRight, Clock, Calendar, CheckCircle2, User, Wrench, Building2, Search, Tag, ShieldCheck, ChevronRight, Share2, AlertTriangle } from 'lucide-react';

interface EditorialCenterViewProps {
  currentRole: UserRole;
  selectedStore: string;
  onOpenArticle: (slug: string) => void;
  onNavigateCategory?: (catId: string) => void;
  onNavigateCraftsmen?: () => void;
  onNavigateB2B?: () => void;
  onNavigateCalculator?: () => void;
}

export const EditorialCenterView: React.FC<EditorialCenterViewProps> = ({
  currentRole,
  selectedStore,
  onOpenArticle,
  onNavigateCraftsmen,
  onNavigateB2B,
  onNavigateCalculator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('toate');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = EditorialService.getCategories();
  const articles = EditorialService.getPublishedArticles(selectedCategory, searchQuery);
  const featuredArticle = EditorialService.getFeaturedArticle();

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-200">
      
      {/* 1. HERO EDITORIAL LUMINOS */}
      <section className="relative overflow-hidden rounded-3xl border border-[#D9E2E1] p-6 sm:p-10 shadow-sm"
               style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #EFFAF6 60%, #E9ECEF 100%)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-2xs">
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              <span>Ghiduri • Noutăți • Idei • Profesioniști</span>
            </div>

            {/* Titlu Principal */}
            <h1 className="text-2xl sm:text-4xl font-black text-[#0D1B2A] tracking-tight leading-tight">
              Ghiduri, noutăți și soluții pentru <span className="text-[#087F5B]">construcții</span>
            </h1>

            {/* Descriere */}
            <p className="text-sm sm:text-base text-[#5C6670] leading-relaxed max-w-2xl font-medium">
              Informații practice, tehnologii, idei de proiect și recomandări verificate pentru clienți persoane fizice, meșteri și companii de construcții din sudul Moldovei.
            </p>

            {/* Bară căutare în ghiduri */}
            <div className="pt-2 max-w-xl">
              <div className="relative">
                <Search className="w-5 h-5 text-[#5C6670] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Caută ghiduri tehnice (ex: adeziv gresie, hidroizolație, vopsea)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#D9E2E1] rounded-2xl text-xs sm:text-sm text-[#0D1B2A] placeholder-[#5C6670] shadow-2xs focus:outline-none focus:border-[#087F5B] focus:ring-2 focus:ring-[#087F5B]/20 transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5C6670] hover:text-[#0D1B2A]"
                  >
                    Șterge
                  </button>
                )}
              </div>
            </div>

            {/* Micro stats / Trust indicators */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-[#5C6670] font-semibold">
              <span className="flex items-center gap-1.5 text-[#087F5B]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verificat de Ingineri CodeBau</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-[#0D1B2A]">
                <Wrench className="w-4 h-4 text-[#F4B400]" />
                <span>Format pentru Meșteri & B2B</span>
              </span>
            </div>
          </div>

          {/* Hero Image Editorial Representative */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#D9E2E1] shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop&q=80"
                alt="Centrul CodeBau Ghiduri și Șantier"
                className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-white space-y-1">
                  <span className="bg-[#087F5B] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                    Centrul Editorial
                  </span>
                  <p className="text-xs font-bold text-slate-200">
                    Soluții de la furnizori și experți locali din Cahul & Cantemir
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORII EDITORIALE (FILTRE) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#5C6670]">
            Categorii de ghiduri
          </h3>
          <span className="text-xs text-[#5C6670] font-semibold">
            {articles.length} articole găsite
          </span>
        </div>

        {/* Chips Container - Single/Double row desktop, Horizontal scroll mobile */}
        <div className="bg-white p-2.5 rounded-2xl border border-[#D9E2E1] shadow-2xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap md:flex-wrap">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#087F5B] text-white shadow-xs font-extrabold'
                      : 'bg-white text-[#0D1B2A] border border-[#D9E2E1] hover:border-[#087F5B] hover:text-[#087F5B]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ARTICOL PRINCIPAL (RECOMANDAREA SĂPTĂMÂNII) */}
      {featuredArticle && selectedCategory === 'toate' && !searchQuery && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#0D1B2A] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F4B400]" />
            <h2>Recomandarea săptămânii</h2>
          </div>

          <div className="bg-white rounded-3xl border border-[#D9E2E1] shadow-sm hover:shadow-md transition-shadow overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Stânga: Imagine Mare */}
            <div className="lg:col-span-6 relative min-h-[260px] lg:min-h-[340px]">
              <img
                src={featuredArticle.heroImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#087F5B] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                Recomandat • {EditorialService.getCategories().find(c => c.id === featuredArticle.categoryId)?.name || 'Ghid'}
              </div>
            </div>

            {/* Dreapta: Conținut */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-[#5C6670] font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#087F5B]" />
                    {featuredArticle.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#087F5B]" />
                    {featuredArticle.readingTime} citire
                  </span>
                </div>

                <h3 
                  onClick={() => onOpenArticle(featuredArticle.slug)}
                  className="text-xl sm:text-2xl font-black text-[#0D1B2A] hover:text-[#087F5B] cursor-pointer transition-colors leading-snug"
                >
                  {featuredArticle.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#5C6670] leading-relaxed line-clamp-3 font-medium">
                  {featuredArticle.excerpt}
                </p>
              </div>

              {/* Autor & CTA */}
              <div className="pt-4 border-t border-[#D9E2E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src={EditorialService.getAuthorById(featuredArticle.authorId).avatar}
                    alt={EditorialService.getAuthorById(featuredArticle.authorId).name}
                    className="w-8 h-8 rounded-full object-cover border border-[#D9E2E1]"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#0D1B2A]">
                      {EditorialService.getAuthorById(featuredArticle.authorId).name}
                    </p>
                    <p className="text-[10px] text-[#5C6670]">
                      {EditorialService.getAuthorById(featuredArticle.authorId).role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenArticle(featuredArticle.slug)}
                  className="bg-[#087F5B] hover:bg-[#066B4D] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
                >
                  <span>Citește ghidul</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. GRILA DE ARTICOLE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#0D1B2A] tracking-tight">
            {selectedCategory === 'toate' ? 'Toate Ghidurile & Articolele' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#087F5B] font-bold hover:underline"
            >
              Resetează căutarea
            </button>
          )}
        </div>

        {articles.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#D9E2E1] text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-[#0D1B2A]">Nu am găsit niciun articol în această categorie.</p>
            <button
              onClick={() => { setSelectedCategory('toate'); setSearchQuery(''); }}
              className="text-xs font-extrabold text-[#087F5B] underline"
            >
              Vezi toate articolele
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {articles.map((art) => {
              const author = EditorialService.getAuthorById(art.authorId);
              const categoryName = categories.find(c => c.id === art.categoryId)?.name || 'Ghid';

              return (
                <article
                  key={art.id}
                  className="bg-white rounded-2xl border border-[#D9E2E1] overflow-hidden hover:border-[#087F5B] transition-all hover:shadow-md flex flex-col justify-between group h-full"
                >
                  <div>
                    {/* Top Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={art.heroImage}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-[#EFFAF6] text-[#087F5B] border border-[#00A878]/30 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-2xs">
                        {categoryName}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] text-[#5C6670] font-semibold">
                        <span>{art.publishedAt}</span>
                        <span>•</span>
                        <span>{art.readingTime}</span>
                      </div>

                      <h3 
                        onClick={() => onOpenArticle(art.slug)}
                        className="text-base font-extrabold text-[#0D1B2A] hover:text-[#087F5B] cursor-pointer transition-colors leading-snug line-clamp-2"
                      >
                        {art.title}
                      </h3>

                      <p className="text-xs text-[#5C6670] line-clamp-3 leading-relaxed font-medium">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0 border-t border-[#D9E2E1]/60 mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-6 h-6 rounded-full object-cover border border-[#D9E2E1]"
                      />
                      <span className="text-[11px] font-bold text-[#0D1B2A] truncate max-w-[120px]">
                        {author.name}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenArticle(art.slug)}
                      className="text-xs font-extrabold text-[#087F5B] hover:text-[#066B4D] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Citește</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. SECȚIUNI DEDICATE PENTRU PROFESIONIȘTI & COMPANII */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* Pentru Meșteri */}
        <div className="bg-[#0D1B2A] text-white rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 text-[#F4B400] text-xs font-black uppercase tracking-wider">
            <Wrench className="w-4 h-4" />
            <span>Pentru profesioniști</span>
          </div>

          <h3 className="text-xl font-black text-white leading-tight">
            Tehnici de lucru, scule profesionale și Meister Club
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Ghiduri speciale dezvoltate alături de meșterii din Cahul și Cantemir: organizarea șantierului, norme de aplicare și beneficii exclusive Meister Club.
          </p>

          <button
            onClick={() => handleCategorySelect('pentru-mesteri')}
            className="bg-[#F4B400] hover:bg-amber-500 text-[#0D1B2A] px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
          >
            <span>Vezi ghidurile pentru meșteri</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pentru Companii */}
        <div className="bg-[#EFFAF6] border border-[#00A878]/30 rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 text-[#087F5B] text-xs font-black uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Informații pentru companii</span>
          </div>

          <h3 className="text-xl font-black text-[#0D1B2A] leading-tight">
            Achiziții centralizate, logistică șantier și devize B2B
          </h3>

          <p className="text-xs text-[#5C6670] leading-relaxed font-medium">
            Planificarea stocurilor pe șantiere, documentație tehnică DoP, optimizare logistică și facilități de plată pentru antreprenori de construcții.
          </p>

          <button
            onClick={() => handleCategorySelect('pentru-companii')}
            className="bg-[#087F5B] hover:bg-[#066B4D] text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
          >
            <span>Ghiduri achiziții companii</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* Disclaimers Subtile Footer */}
      <div className="p-4 bg-[#FFFBEB] border border-[#F59E0B]/30 rounded-2xl text-[11px] text-[#78350F] flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
        <p>
          <strong>Notă importantă:</strong> Articolele din Centrul CodeBau au scop informativ și tehnologic. Specificațiile finale ale fiecărui proiect trebuie adaptate la fișele tehnice oficiale ale produselor și condițiile specifice din teren.
        </p>
      </div>

    </div>
  );
};
