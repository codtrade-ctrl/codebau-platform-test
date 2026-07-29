import React, { useState } from 'react';
import { CodeBauLogo } from './CodeBauLogo';
import { ChevronDown, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

interface FooterProps {
  onTabChange: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-[#0D1B2A] border-t border-[#1A3448] text-slate-400 text-xs py-10 px-4 sm:px-6 pb-[calc(72px+env(safe-area-inset-bottom,0px)+16px)] md:pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Branding Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1A3448] pb-6">
          <div className="space-y-2 max-w-xl">
            <div onClick={() => onTabChange('home')} className="cursor-pointer inline-block">
              <div className="sm:hidden">
                <CodeBauLogo size="sm" variant="dark" />
              </div>
              <div className="hidden sm:block">
                <CodeBauLogo size="md" variant="dark" />
              </div>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {t.footerTagline}
            </p>
          </div>

          <div className="text-xs text-slate-300 font-medium bg-[#13283A] px-3.5 py-2 rounded-xl border border-[#1A3448]">
            <p className="font-bold text-white">{t.footerPhysicalStores}</p>
            <p className="text-[#00A878] font-semibold mt-0.5">Cahul, Cantemir, Vulcănești, Taraclia</p>
          </div>
        </div>

        {/* Desktop Grid Layout (hidden on mobile) */}
        <div className="hidden md:grid grid-cols-3 gap-8 pt-2">
          
          {/* Column 1: Magazin și servicii */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">{t.footerStoreAndServices}</h5>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => onTabChange('catalog')} className="hover:text-[#00A878] transition-colors cursor-pointer">
                  {t.footerMaterialsCatalog}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('calculator')} className="hover:text-[#00A878] transition-colors cursor-pointer">
                  {t.calculateMaterials}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('solutions')} className="hover:text-[#00A878] transition-colors cursor-pointer">
                  {t.footerRenovationPackages}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('guides')} className="hover:text-[#00A878] transition-colors cursor-pointer font-bold text-[#00A878]">
                  {t.footerGuidesCenter}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('stores')} className="hover:text-[#00A878] transition-colors cursor-pointer">
                  {t.footerLocalStores}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Profesioniști */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">{t.navProfessionals}</h5>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => onTabChange('meister')} className="hover:text-[#F4B400] transition-colors cursor-pointer">
                  CodeBau Meister Club
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('craftsmen')} className="hover:text-[#00A878] transition-colors cursor-pointer">
                  {t.footerCraftsmenNetwork}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('b2b')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  {t.business360}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Suport și contact */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">{t.footerSupportAndContact}</h5>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#00A878]" />
                <span>Email: contact@codebau.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#00A878]" />
                <span>Telefon: +373 299 12 345</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.footerRegionServed}</span>
              </li>
              <li className="flex items-center gap-2 text-[#00A878] font-bold pt-1">
                <Lock className="w-3.5 h-3.5 text-[#00A878]" />
                <span>{t.footerLockers247}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Mobile Accordion Layout (visible only on mobile) */}
        <div className="md:hidden space-y-3 pt-2">
          
          {/* Accordion 1: Magazin și servicii */}
          <div className="border border-[#1A3448] rounded-xl overflow-hidden bg-[#13283A]">
            <button
              onClick={() => toggleSection('store')}
              aria-expanded={openSection === 'store'}
              className="w-full p-3.5 flex items-center justify-between text-left font-bold text-white text-xs"
            >
              <span>Magazin și servicii</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openSection === 'store' ? 'rotate-180' : ''}`} />
            </button>
            
            {openSection === 'store' && (
              <div className="p-3.5 pt-0 border-t border-[#1A3448] space-y-2 text-slate-300 animate-in fade-in duration-200">
                <button onClick={() => onTabChange('catalog')} className="block w-full text-left py-1 hover:text-[#00A878]">
                  Catalog Materiale
                </button>
                <button onClick={() => onTabChange('calculator')} className="block w-full text-left py-1 hover:text-[#00A878]">
                  Calculator Necesare
                </button>
                <button onClick={() => onTabChange('solutions')} className="block w-full text-left py-1 hover:text-[#00A878]">
                  Pachete Renovare
                </button>
                <button onClick={() => onTabChange('stores')} className="block w-full text-left py-1 hover:text-[#00A878]">
                  Magazine & Stocuri Local
                </button>
              </div>
            )}
          </div>

          {/* Accordion 2: Profesioniști */}
          <div className="border border-[#1A3448] rounded-xl overflow-hidden bg-[#13283A]">
            <button
              onClick={() => toggleSection('pro')}
              aria-expanded={openSection === 'pro'}
              className="w-full p-3.5 flex items-center justify-between text-left font-bold text-white text-xs"
            >
              <span>Profesioniști</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openSection === 'pro' ? 'rotate-180' : ''}`} />
            </button>
            
            {openSection === 'pro' && (
              <div className="p-3.5 pt-0 border-t border-[#1A3448] space-y-2 text-slate-300 animate-in fade-in duration-200">
                <button onClick={() => onTabChange('meister')} className="block w-full text-left py-1 hover:text-[#F4B400]">
                  CodeBau Meister Club
                </button>
                <button onClick={() => onTabChange('craftsmen')} className="block w-full text-left py-1 hover:text-[#00A878]">
                  Rețeaua de Meșteri
                </button>
                <button onClick={() => onTabChange('b2b')} className="block w-full text-left py-1 hover:text-blue-400">
                  Cont Corporativ B2B
                </button>
              </div>
            )}
          </div>

          {/* Accordion 3: Suport și contact */}
          <div className="border border-[#1A3448] rounded-xl overflow-hidden bg-[#13283A]">
            <button
              onClick={() => toggleSection('contact')}
              aria-expanded={openSection === 'contact'}
              className="w-full p-3.5 flex items-center justify-between text-left font-bold text-white text-xs"
            >
              <span>Suport și contact</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openSection === 'contact' ? 'rotate-180' : ''}`} />
            </button>
            
            {openSection === 'contact' && (
              <div className="p-3.5 pt-0 border-t border-[#1A3448] space-y-2 text-slate-300 animate-in fade-in duration-200">
                <p className="py-0.5">Email: contact@codebau.com</p>
                <p className="py-0.5">Telefon: +373 XX XXX XXX</p>
                <p className="py-0.5 text-slate-400">Regiune deservită: Sudul Republicii Moldova</p>
                <p className="py-1 text-[#00A878] font-bold">Ridicare și lockere 24/7 în magazinele selectate</p>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#1A3448] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 CodeBau. Construiește cu încredere.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => onTabChange('guides')} className="hover:text-slate-200 cursor-pointer">Centrul CodeBau</button>
            <span>•</span>
            <button onClick={() => onTabChange('stores')} className="hover:text-slate-200 cursor-pointer">Termeni & Condiții</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
