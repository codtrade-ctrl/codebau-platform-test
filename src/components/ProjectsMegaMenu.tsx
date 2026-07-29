import React from 'react';
import { 
  Calculator, Home, Wrench, ArrowRight, Layers, FileText, UserCheck, MessageSquare
} from 'lucide-react';
import { useLanguage } from '../utils/i18n';

interface ProjectsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (projectSlug: string) => void;
  onSelectTool: (toolId: string) => void;
}

export const ProjectsMegaMenu: React.FC<ProjectsMegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onSelectTool
}) => {
  const { language, t } = useLanguage();
  if (!isOpen) return null;

  const isRu = language === 'ru';

  return (
    <div 
      className="absolute top-full left-0 w-full bg-white border-b border-[#D9E2E1] shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto p-6 text-[#0D1B2A]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* COLOANA 1 — RENOVĂRI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2E1] font-black text-xs uppercase tracking-wider text-[#0D1B2A]">
              <Home className="w-4 h-4 text-[#00A878]" />
              <span>{isRu ? 'Внутренний ремонт' : 'Renovări Interioare'}</span>
            </div>
            <ul className="space-y-2 text-xs font-semibold text-[#5C6670]">
              <li>
                <button 
                  onClick={() => { onSelectProject('renovare-baie'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left"
                >
                  <span>{isRu ? 'Ремонт ванной' : 'Renovare baie'}</span>
                  <span className="text-[10px] text-[#00A878] bg-[#EFFAF6] px-1.5 py-0.5 rounded font-extrabold">{isRu ? 'Гид + Кальк' : 'Ghid + Calc'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectProject('renovare-bucatarie'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left"
                >
                  <span>{isRu ? 'Ремонт кухни' : 'Renovare bucătărie'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectProject('zugravire'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left"
                >
                  <span>{isRu ? 'Покраска и побелка' : 'Zugrăvire & Lavabile'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectProject('montare-gresie'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left font-bold text-[#0D1B2A]"
                >
                  <span>{isRu ? 'Укладка плитки и фаянса' : 'Montare gresie și faianță'}</span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-extrabold">{isRu ? 'Популярно' : 'Popular'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectProject('pardoseli'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left"
                >
                  <span>{isRu ? 'Полы и паркет' : 'Pardoseli & Parchet'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectProject('gips-carton'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left"
                >
                  <span>{isRu ? 'Перегородки из гипсокартона' : 'Compartimentări Gips-Carton'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLOANA 2 — CONSTRUCȚII */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2E1] font-black text-xs uppercase tracking-wider text-[#0D1B2A]">
              <Layers className="w-4 h-4 text-[#00A878]" />
              <span>{isRu ? 'Строительство и экстерьер' : 'Construcții & Exterior'}</span>
            </div>
            <ul className="space-y-2 text-xs font-semibold text-[#5C6670]">
              <li>
                <button 
                  onClick={() => { onSelectProject('termoizolatie-fatada'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left font-bold text-[#0D1B2A]"
                >
                  <span>{isRu ? 'Утепление фасада' : 'Termoizolație fațadă'}</span>
                  <span className="text-[10px] text-[#00A878] bg-[#EFFAF6] px-1.5 py-0.5 rounded font-extrabold">EPS</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectProject('sistem-acoperis'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left"
                >
                  <span>{isRu ? 'Кровельная система' : 'Sistem acoperiș'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectProject('instalatii-electrice'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left"
                >
                  <span>{isRu ? 'Электромонтаж' : 'Instalații electrice'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectProject('instalatii-sanitare'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left"
                >
                  <span>{isRu ? 'Сантехника и отопление' : 'Instalații sanitare & Încălzire'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectProject('zidarie'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left"
                >
                  <span>{isRu ? 'Строительство и кладка' : 'Construcții & Zidărie'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectProject('amenajari-exterioare'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center justify-between w-full text-left"
                >
                  <span>{isRu ? 'Благоустройство территории' : 'Amenajări exterioare & Pavaj'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLOANA 3 — INSTRUMENTE */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2E1] font-black text-xs uppercase tracking-wider text-[#0D1B2A]">
              <Wrench className="w-4 h-4 text-[#00A878]" />
              <span>{isRu ? 'Инструменты и сервисы' : 'Unelte & Servicii'}</span>
            </div>
            <ul className="space-y-2 text-xs font-semibold text-[#5C6670]">
              <li>
                <button 
                  onClick={() => { onSelectTool('calculator'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center gap-2 w-full text-left text-[#00A878] font-bold"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{t.calculateMaterials}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectTool('solutions'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center gap-2 w-full text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isRu ? 'Создать новый проект' : 'Creează un proiect nou'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectTool('b2b'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center gap-2 w-full text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isRu ? 'Запросить коммерческое предложение' : 'Solicită ofertă de preț'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectTool('b2b'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center gap-2 w-full text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isRu ? 'Загрузить список материалов' : 'Încarcă lista de materiale'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectTool('ai'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center gap-2 w-full text-left text-[#00A878]"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#00A878]" />
                  <span>{isRu ? 'Чат с ИИ консультантом' : 'Vorbește cu consultant AI'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onSelectTool('craftsmen'); onClose(); }}
                  className="hover:text-[#00A878] hover:translate-x-1 transition-all flex items-center gap-2 w-full text-left"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.shortcutCraftsmanTitle}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* COLOANA 4 — PROIECT PROMOVAT (CARD VIZUAL) */}
          <div className="bg-[#EFFAF6] border border-[#00A878]/30 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <span className="bg-[#00A878] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {isRu ? 'Гид и Калькулятор' : 'Ghid & Calculator'}
              </span>
              <h4 className="font-extrabold text-[#0D1B2A] text-sm mt-2">
                {isRu ? 'Полный ремонт ванной?' : 'Renovezi baia complet?'}
              </h4>
              <p className="text-xs text-[#5C6670] mt-1 leading-relaxed">
                {isRu 
                  ? 'Рассчитайте клей, гидроизоляцию и плитку. Сравните комплекты Эконом, Стандарт и Премиум менее чем за 2 минуты.'
                  : 'Calculează adezivul, hidroizolația și gresia. Compară kiturile Economic, Standard și Premium în mai puțin de 2 minute.'
                }
              </p>
            </div>
            
            <button
              onClick={() => { onSelectProject('montare-gresie'); onClose(); }}
              className="w-full bg-[#00A878] hover:bg-[#009268] text-white font-extrabold text-xs py-2.5 px-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{t.startProject}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
