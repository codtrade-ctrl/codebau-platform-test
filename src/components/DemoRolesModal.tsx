import React from 'react';
import { UserRole } from '../types';
import { User, Wrench, Building2, ShieldCheck, X, Check, Code } from 'lucide-react';

interface DemoRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const DemoRolesModal: React.FC<DemoRolesModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole
}) => {
  if (!isOpen) return null;

  const roles: { id: UserRole; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'retail',
      label: 'Client Persoană Fizică',
      desc: 'Vezi prețurile standard de raft, produse și locker 24/7.',
      icon: User
    },
    {
      id: 'meister',
      label: 'Meșter Meister Club',
      desc: 'Accesează prețurile speciale de meșter, acumulează puncte și primește comenzi.',
      icon: Wrench
    },
    {
      id: 'b2b',
      label: 'Companie B2B',
      desc: 'Vezi linia de credit 30 zile, facturare PJ cu IDNO și prețuri speciale de volum.',
      icon: Building2
    },
    {
      id: 'admin',
      label: 'Administrator ERP',
      desc: 'Gestionează stocurile live în magazinele Cahul, Cantemir, Vulcănești, Taraclia și comenzile.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="fixed inset-0 bg-[#0D1B2A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white border border-[#D9E2E1] text-[#0D1B2A] rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#5C6670] hover:text-[#0D1B2A] rounded-xl hover:bg-[#F8FAF9] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#DDF5EE] text-[#087F5B] rounded-2xl border border-[#00A878]/30">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0D1B2A]">Demonstrație Roluri Utilizator</h3>
            <p className="text-xs text-[#5C6670] font-medium">Selectează un rol pentru a simula experiența pe platformă</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {roles.map((r) => {
            const IconComp = r.icon;
            const isSelected = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  onSelectRole(r.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-[#087F5B] bg-[#EFFAF6] shadow-xs' 
                    : 'bg-[#F8FAF9] border-[#D9E2E1] hover:border-[#087F5B]/50'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-[#087F5B] text-white' : 'bg-white border border-[#D9E2E1] text-[#0D1B2A]'}`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#0D1B2A]">{r.label}</span>
                    {isSelected && (
                      <span className="text-[#087F5B] font-extrabold text-xs flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Activ
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5C6670] mt-1 font-medium leading-relaxed">{r.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
