import React from 'react';
import { 
  Building2, Paintbrush, Zap, Wrench, Trees, ArrowRight, Sparkles, Tag, Package
} from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  onViewAllProducts: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onViewAllProducts
}) => {
  if (!isOpen) return null;

  const categories = [
    {
      title: 'Materiale de construcții',
      icon: Building2,
      items: [
        'Ciment și mortare',
        'Adezivi și grunduri',
        'Gips-carton',
        'Zidărie',
        'Hidroizolații',
        'Izolații termice'
      ]
    },
    {
      title: 'Finisaje',
      icon: Paintbrush,
      items: [
        'Gresie și faianță',
        'Pardoseli',
        'Vopsele',
        'Tapete',
        'Profile și accesorii'
      ]
    },
    {
      title: 'Instalații',
      icon: Zap,
      items: [
        'Electricitate',
        'Sanitare',
        'Încălzire',
        'Ventilație'
      ]
    },
    {
      title: 'Scule și echipamente',
      icon: Wrench,
      items: [
        'Scule electrice',
        'Scule de mână',
        'Echipamente profesionale',
        'Protecția muncii'
      ]
    },
    {
      title: 'Exterior',
      icon: Trees,
      items: [
        'Acoperiș',
        'Fațade',
        'Grădină',
        'Pavaj',
        'Garduri'
      ]
    }
  ];

  return (
    <div 
      className="absolute top-full left-0 w-full bg-white/98 backdrop-blur-md border-b border-[#D9E2E1] shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-140px)] overflow-y-auto overflow-x-hidden"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          
          {/* Main 5 Product Categories */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2E1] text-[#0D1B2A] font-black text-xs uppercase tracking-wider">
                    <IconComp className="w-4 h-4 text-[#087F5B]" />
                    <span>{cat.title}</span>
                  </div>
                  <ul className="space-y-1 text-xs font-semibold">
                    {cat.items.map((subItem, sIdx) => (
                      <li key={sIdx}>
                        <button
                          onClick={() => {
                            onSelectCategory(subItem);
                            onClose();
                          }}
                          className="text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6] px-2.5 py-1.5 rounded-lg text-left w-full inline-flex items-center gap-2 transition-all group cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D9E2E1] group-hover:bg-[#087F5B] transition-colors"></span>
                          <span>{subItem}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Right Promotional & Feature Sidecard */}
          <div className="lg:col-span-1 bg-[#EFFAF6] border border-[#00A878]/30 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#B45309] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-[#F59E0B]/30">
                <Tag className="w-3 h-3 text-[#D97706]" />
                <span>Promoția Săptămânii</span>
              </div>
              
              <h4 className="font-black text-xs text-[#0D1B2A] leading-snug">
                Pachet Adeziv Ceresit CM17 + Chit Rosturi (-15%)
              </h4>
              <p className="text-[11px] text-[#5C6670] leading-relaxed">
                Valabil pentru comenzile livrate în Cahul și tot sudul Moldovei.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#D9E2E1]">
              <button
                onClick={() => {
                  onViewAllProducts();
                  onClose();
                }}
                className="w-full bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-2.5 px-3 rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Package className="w-4 h-4 text-white" />
                <span>Vezi Toate Produsele</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
