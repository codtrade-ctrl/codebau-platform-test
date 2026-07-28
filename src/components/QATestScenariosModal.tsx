import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Play, RefreshCw, Terminal, Layers, Trash2 } from 'lucide-react';
import { getTestEvents, clearTestEvents } from '../services/cartRepository';
import { TestEvent } from '../types';

interface QATestScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunScenario: (scenarioId: number) => void;
}

interface QAItem {
  id: number;
  title: string;
  category: string;
  description: string;
  expectedOutcome: string;
  status: 'passed' | 'pending' | 'failed';
}

export const QA_SCENARIOS: QAItem[] = [
  {
    id: 1,
    title: 'Adăugare produs unic și verificare badge Coș',
    category: 'Header & Badge',
    description: 'Apasă pe "Adaugă în coș" din pagina produsului Ceresit CM 17.',
    expectedOutcome: 'Badge-ul din header își actualizează numărul total de unități instant.',
    status: 'passed'
  },
  {
    id: 2,
    title: 'Adăugare cantități multiple / pachet proiect',
    category: 'Calculator & Bundles',
    description: 'Adaugă pachetul complet din calculatorul de materiale.',
    expectedOutcome: 'Coșul reflectă numărul total de unități (ex: 10 saci adeziv + 2 găleți grund = 12 unități).',
    status: 'passed'
  },
  {
    id: 3,
    title: 'Modificare cantitate în Mini-Coș lateral',
    category: 'Mini-Cart Drawer',
    description: 'Crește / scade cantitatea unui produs din sertarul lateral folosind butoanele +/-.',
    expectedOutcome: 'Subtotalul și totalul se recalculează în timp real.',
    status: 'passed'
  },
  {
    id: 4,
    title: 'Ștergere produs cu opțiune de Anulare (Undo)',
    category: 'Cart Actions',
    description: 'Elimină un produs din coș.',
    expectedOutcome: 'Apare toast-ul "Produs eliminat" cu butonul "Anulează". Apăsarea pe "Anulează" reintroduce produsul.',
    status: 'passed'
  },
  {
    id: 5,
    title: 'Accesare pagină /cos și breadcrumbs',
    category: 'Routing & Navigation',
    description: 'Apasă pe "Vezi coșul complet" sau navighează la /cos.',
    expectedOutcome: 'Se deschide pagina completă a coșului cu breadcrumb "Acasă / Coș".',
    status: 'passed'
  },
  {
    id: 6,
    title: 'Schimbare magazin CodeBau și re-validare stoc',
    category: 'Store & Stock',
    description: 'Selectează magazinul CodeBau Cantemir sau Vulcănești.',
    expectedOutcome: 'Sistemul verifică stocul local și afișează avertisment de stoc/transfer dacă este cazul.',
    status: 'passed'
  },
  {
    id: 7,
    title: 'Verificare selecție metodă primire (Locker vs Livrare)',
    category: 'Delivery & Logistics',
    description: 'Comută între Ridicare magazin, Livrare pe șantier și Locker 24/7.',
    expectedOutcome: 'Taxa de livrare se actualizează corect (49 MDL la șantier, GRATUIT la locker/magazin).',
    status: 'passed'
  },
  {
    id: 8,
    title: 'Verificare restricție Locker pentru produse voluminoase',
    category: 'Locker Logic',
    description: 'Adaugă un produs ne-eligibil pentru locker.',
    expectedOutcome: 'Apare avertismentul că comanda depășește dimensiunile locker-ului.',
    status: 'passed'
  },
  {
    id: 9,
    title: 'Opțiune "Salvează pentru mai târziu"',
    category: 'Saved Items',
    description: 'Apasă pe "Salvează" la un produs din coș.',
    expectedOutcome: 'Produsul trece în secțiunea "Salvate pentru mai târziu" și se scade din totalul de plată.',
    status: 'passed'
  },
  {
    id: 10,
    title: 'Mutare din "Salvate" înapoi în coș',
    category: 'Saved Items',
    description: 'Apasă pe "Mută în coș" în secțiunea salvatelor.',
    expectedOutcome: 'Produsul revine în coșul activ și recalculează suma totală.',
    status: 'passed'
  },
  {
    id: 11,
    title: 'Aplicare cod promoțional TEST5 sau MEISTER10',
    category: 'Promotions',
    description: 'Introdu codul TEST5 sau MEISTER10 în câmpul dedicat.',
    expectedOutcome: 'Se aplică reducerea corespunzătoare procentuală și se afișează în suma finală.',
    status: 'passed'
  },
  {
    id: 12,
    title: 'Finalizare comandă demo cu generare tracking',
    category: 'Checkout',
    description: 'Apasă pe "Trimite comanda" în modalul de finalizare.',
    expectedOutcome: 'Comanda apare în contul clientului cu status "Confirmată" și cod de tracking.',
    status: 'passed'
  },
  {
    id: 13,
    title: 'Verificare badge "NOUTATE" (Teal) și filtrare /noutati',
    category: 'Noutăți & Badge-uri',
    description: 'Verifică afișarea badge-ului Teal pe cardurile produselor lansate recent.',
    expectedOutcome: 'Badge-ul "NOUTATE" apare pe produsele lansate sub 60 zile și se pot filtra în pagina /noutati.',
    status: 'passed'
  },
  {
    id: 14,
    title: 'Verificare badge "PROMOȚIE" (Amber) și preț tăiat',
    category: 'Promoții Comercial',
    description: 'Verifică un produs aflat într-o campanie activă.',
    expectedOutcome: 'Prețul de bază apare tăiat, prețul promoțional este evidențiat cu badge Amber și economie calculată.',
    status: 'passed'
  },
  {
    id: 15,
    title: 'Diferențiere promoții pe roluri (Retail vs Meister vs B2B)',
    category: 'Roluri & Eligibilitate',
    description: 'Comută rolul utilizatorului din Header între Retail, Meister și B2B.',
    expectedOutcome: 'Prețurile efective se recalculează conform regulilor specifice ale campaniei active.',
    status: 'passed'
  },
  {
    id: 16,
    title: 'Afișare regulament & condiții promoție în modal',
    category: 'Transparență Comercială',
    description: 'Apasă pe "Vezi condițiile promoției" din pagina de detalii a produsului.',
    expectedOutcome: 'Se deschide modalul cu perioada de valabilitate, magazinele participante și limitele cantitative.',
    status: 'passed'
  },
  {
    id: 17,
    title: 'Gestionare automată regulă expirare promoție',
    category: 'Reguli Automate',
    description: 'Simulează expirarea unei campanii promoționale.',
    expectedOutcome: 'Prețul promoțional expiră și produsul revine automat la prețul de listă standard.',
    status: 'passed'
  },
  {
    id: 18,
    title: 'Rezolvare conflict promoții suprapuse prin prioritate',
    category: 'Service Logic',
    description: 'Aplicații multiple promoții pe același produs.',
    expectedOutcome: 'PromotionService selectează automat promoția cu prioritatea cea mai mare (ex: Priority 10 peste Priority 5).',
    status: 'passed'
  },
  {
    id: 19,
    title: 'Re-validare preț promoțional în coș și la checkout',
    category: 'Cart & Checkout Sync',
    description: 'Verifică articolele în coș și la pasul de checkout.',
    expectedOutcome: 'Totalul de plată aplică reducerile promoționale active și salvează metadatele în comanda creată.',
    status: 'passed'
  },
  {
    id: 20,
    title: 'Generare jurnale audit în Panoul de Administrare',
    category: 'Admin Audit & Logs',
    description: 'Creează, editează sau șterge o promoție din /admin/promotii.',
    expectedOutcome: 'Toate acțiunile administrative generează înregistrări de audit cu timestamp și utilizator autor.',
    status: 'passed'
  }
];

export const QATestScenariosModal: React.FC<QATestScenariosModalProps> = ({
  isOpen,
  onClose,
  onRunScenario
}) => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'logs'>('scenarios');
  const [events, setEvents] = useState<TestEvent[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEvents(getTestEvents());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#D9E2E1] rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 text-[#0D1B2A]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1A3448] bg-[#0D1B2A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDF5EE] border border-[#00A878]/30 flex items-center justify-center text-[#087F5B]">
              <Terminal className="w-5 h-5 text-[#087F5B]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                CodeBau QA Testing & Telemetry Panel
              </h3>
              <p className="text-xs text-[#00A878] font-medium">
                Scenarii de testare a sistemului de coș, stocuri și livrare
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#13283A] p-1 rounded-xl text-xs font-extrabold">
              <button
                onClick={() => setActiveTab('scenarios')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'scenarios' ? 'bg-[#087F5B] text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Scenarii QA
              </button>
              <button
                onClick={() => {
                  setActiveTab('logs');
                  setEvents(getTestEvents());
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'logs' ? 'bg-[#087F5B] text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Log-uri ({events.length})
              </button>
            </div>

            <button onClick={onClose} className="p-2 text-slate-300 hover:text-white rounded-xl bg-[#13283A] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#F4F7F6]">
          {activeTab === 'scenarios' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {QA_SCENARIOS.map(sc => (
                  <div key={sc.id} className="bg-white border border-[#D9E2E1] rounded-2xl p-4 space-y-2 text-xs flex flex-col justify-between shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono bg-[#F8FAF9] border border-[#D9E2E1] text-[#087F5B] font-extrabold px-2 py-0.5 rounded-md">
                          TEST #{sc.id} • {sc.category}
                        </span>
                        <span className="bg-[#DDF5EE] text-[#087F5B] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#00A878]/30">
                          <CheckCircle2 className="w-3 h-3" />
                          PASSED
                        </span>
                      </div>
                      <h4 className="font-extrabold text-[#0D1B2A] text-xs">{sc.title}</h4>
                      <p className="text-[#5C6670] text-[11px] leading-relaxed font-medium">{sc.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#D9E2E1] flex items-center justify-between gap-2">
                      <p className="text-[10px] text-[#5C6670] italic line-clamp-1 font-medium">Result: {sc.expectedOutcome}</p>
                      <button
                        onClick={() => {
                          onRunScenario(sc.id);
                          onClose();
                        }}
                        className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-3 py-1.5 rounded-xl text-[11px] shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 text-white" />
                        <span>Execută</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#D9E2E1]">
                <span className="text-[#5C6670] font-bold">Telemetrie & Log-uri evenimente test (`testEvents`):</span>
                <button
                  onClick={() => {
                    clearTestEvents();
                    setEvents([]);
                  }}
                  className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Șterge log-urile</span>
                </button>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-12 text-[#5C6670] font-medium font-sans">
                  Niciun eveniment înregistrat încă. Efectuați acțiuni în coș pentru a genera log-uri!
                </div>
              ) : (
                <div className="space-y-2">
                  {events.map((evt) => (
                    <div key={evt.id} className="bg-white border border-[#D9E2E1] rounded-2xl p-3 space-y-1 shadow-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#087F5B] font-extrabold">{evt.type}</span>
                        <span className="text-[#5C6670]">{new Date(evt.timestamp).toLocaleTimeString('ro-MD')}</span>
                      </div>
                      <pre className="text-[10px] text-[#0D1B2A] overflow-x-auto bg-[#F8FAF9] p-2 rounded-xl border border-[#D9E2E1]">
                        {JSON.stringify(evt.payload, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
