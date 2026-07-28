import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { Wrench, ShieldCheck, Truck, Plus, Send, DollarSign, Award, BookOpen, Clock, Check, FileSpreadsheet, Building2, User, ChevronRight } from 'lucide-react';

export const MeisterClubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'tiers' | 'credit' | 'academy'>('workspace');
  
  // Site material list builder
  const [siteName, setSiteName] = useState('Șantier Vila Cahul');
  const [clientEmail, setClientEmail] = useState('client.cahul@gmail.com');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([MOCK_PRODUCTS[0].id, MOCK_PRODUCTS[2].id, MOCK_PRODUCTS[5].id]);
  const [siteOrderSentMsg, setSiteOrderSentMsg] = useState('');

  const selectedProducts = MOCK_PRODUCTS.filter(p => (selectedProductIds || []).includes(p.id));
  const totalProCost = selectedProducts.reduce((acc, p) => acc + p.pricePro, 0);

  const handleSendListToClient = () => {
    setSiteOrderSentMsg(`✅ Lista de materiale pentru "${siteName}" a fost trimisă clientului (${clientEmail}) pentru aprobare și plată securizată CodeBau!`);
    setTimeout(() => setSiteOrderSentMsg(''), 5000);
  };

  return (
    <div className="bg-[#F4F7F6] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* ================= HERO BANNER (NAVY PREMIUM) ================= */}
        <div className="bg-[#0D1B2A] border border-[#1A3448] p-8 sm:p-10 rounded-3xl text-white relative overflow-hidden shadow-xs">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#DDF5EE] text-[#087F5B] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
                <Wrench className="w-4 h-4 text-[#087F5B]" />
                <span>Cont Profesional CodeBau Meister Club</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Aici constructorii și meșterii câștigă mai mult
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                Prețuri profesionale reduse, stocuri rezervate în magazin, livrare prioritară cu macara pe șantier, linie de credit controlat și trimiterea devizului direct clientului pentru plată online.
              </p>
            </div>

            <div className="bg-[#13283A] p-5 rounded-2xl border border-[#1A3448] text-right min-w-[220px] w-full md:w-auto">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase">Nivelul Tău Curent</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <span className="text-xl font-black text-[#FEF3C7] bg-[#B45309]/30 px-2.5 py-0.5 rounded-md border border-[#F59E0B]/30">
                  PRO MEISTER
                </span>
              </div>
              <p className="text-xs text-[#00A878] font-bold mt-2">✓ Reducere -16% aplicată la raft</p>
            </div>
          </div>
        </div>

        {/* ================= MEISTER NAVIGATION TABS ================= */}
        <div className="bg-white border border-[#D9E2E1] rounded-2xl p-1.5 flex gap-1.5 overflow-x-auto scrollbar-none shadow-xs">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'workspace' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Deviz Materiale Șantier</span>
          </button>

          <button
            onClick={() => setActiveTab('credit')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'credit' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Linie de Credit & Plată Amânată</span>
          </button>

          <button
            onClick={() => setActiveTab('tiers')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'tiers' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Niveluri Meister Club</span>
          </button>

          <button
            onClick={() => setActiveTab('academy')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'academy' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>CodeBau Academy</span>
          </button>
        </div>

        {/* ================= TAB 1: WORKSPACE SITE LIST BUILDER ================= */}
        {activeTab === 'workspace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-7 bg-white border border-[#D9E2E1] p-6 rounded-3xl text-[#0D1B2A] space-y-6 shadow-xs">
              <div>
                <h3 className="text-lg font-black text-[#0D1B2A] flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#087F5B]" />
                  <span>Creează un Deviz de Materiale pentru Șantier</span>
                </h3>
                <p className="text-xs text-[#5C6670] mt-1 font-medium">
                  Adaugă produsele necesare pentru lucrare, iar sistemul generează un link securizat prin care clientul tău aprobă și plătește materialele direct la CodeBau!
                </p>
              </div>

              {siteOrderSentMsg && (
                <div className="bg-[#DDF5EE] border border-[#00A878]/40 text-[#087F5B] p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#087F5B]" />
                  <span>{siteOrderSentMsg}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Nume Șantier / Proiect:</label>
                    <input 
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-2.5 text-xs text-[#0D1B2A] font-extrabold focus:border-[#087F5B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Email Client (pentru trimitere deviz):</label>
                    <input 
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-2.5 text-xs text-[#0D1B2A] font-extrabold focus:border-[#087F5B] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Product checklist */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-[#0D1B2A]">Selectează Materialele din Catalogul CodeBau:</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {MOCK_PRODUCTS.map(prod => {
                      const isSelected = selectedProductIds.includes(prod.id);
                      return (
                        <div 
                          key={prod.id}
                          onClick={() => {
                            if (isSelected) setSelectedProductIds(selectedProductIds.filter(id => id !== prod.id));
                            else setSelectedProductIds([...selectedProductIds, prod.id]);
                          }}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                            isSelected ? 'bg-[#EFFAF6] border-[#087F5B]' : 'bg-[#F8FAF9] border-[#D9E2E1] opacity-75'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-[#D9E2E1]" />
                            <div>
                              <p className="font-extrabold text-[#0D1B2A] line-clamp-1">{prod.name}</p>
                              <p className="text-[11px] text-[#087F5B] font-black">Preț Pro: {prod.pricePro.toFixed(2)} MDL / {prod.unit}</p>
                            </div>
                          </div>

                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-[#087F5B] border-[#087F5B] text-white' : 'border-[#D9E2E1]'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-[#D9E2E1] flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#5C6670] uppercase font-extrabold">Valoare Totală Deviz (Prețuri Pro)</p>
                  <p className="text-2xl font-black text-[#087F5B]">{totalProCost.toFixed(2)} MDL</p>
                </div>

                <button
                  onClick={handleSendListToClient}
                  className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-6 py-3 rounded-2xl shadow-xs transition-colors flex items-center gap-2 text-xs cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Trimite Lista Clientului</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLS: Benefits Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#D9E2E1] p-6 rounded-3xl text-[#0D1B2A] space-y-4 shadow-xs">
                <h3 className="font-black text-base text-[#0D1B2A] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#087F5B]" />
                  <span>Beneficii Active Meister Club</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-[#D9E2E1] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#DDF5EE] text-[#087F5B] flex items-center justify-center font-black">1</div>
                    <div>
                      <h5 className="font-extrabold text-[#0D1B2A]">Livrare Prioritară pe Șantier</h5>
                      <p className="text-[#5C6670] text-[11px] font-medium">Descărcare direct pe șantier în Cahul și tot sudul Moldovei.</p>
                    </div>
                  </div>

                  <div className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-[#D9E2E1] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#DDF5EE] text-[#087F5B] flex items-center justify-center font-black">2</div>
                    <div>
                      <h5 className="font-extrabold text-[#0D1B2A]">Rezervare Stoc Garantat</h5>
                      <p className="text-[#5C6670] text-[11px] font-medium">Stoc blocat timp de 7 zile fără plată în avans.</p>
                    </div>
                  </div>

                  <div className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-[#D9E2E1] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#DDF5EE] text-[#087F5B] flex items-center justify-center font-black">3</div>
                    <div>
                      <h5 className="font-extrabold text-[#0D1B2A]">Lucrări Noi & Recomandări</h5>
                      <p className="text-[#5C6670] text-[11px] font-medium">Apare pe harta meșterilor CodeBau și primești cereri directe.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: LINE OF CREDIT ================= */}
        {activeTab === 'credit' && (
          <div className="bg-white border border-[#D9E2E1] p-8 rounded-3xl text-[#0D1B2A] space-y-6 shadow-xs max-w-3xl mx-auto">
            <h3 className="text-xl font-black text-[#0D1B2A] flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-[#087F5B]" />
              <span>Linia de Credit Controlat CodeBau Meister</span>
            </h3>
            <p className="text-xs text-[#5C6670] leading-relaxed font-medium">
              Meșterii din nivelul PRO, MASTER și PREMIUM PARTNER beneficiază de termen de plată de până la 30 de zile pentru cumpărăturile de pe șantiere.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F8FAF9] p-5 rounded-2xl border border-[#D9E2E1] text-center">
              <div>
                <p className="text-[10px] text-[#5C6670] uppercase font-extrabold">Plafon Linie Credit</p>
                <p className="text-2xl font-black text-[#0D1B2A]">30.000 MDL</p>
              </div>
              <div>
                <p className="text-[10px] text-[#5C6670] uppercase font-extrabold">Credit Utilizat</p>
                <p className="text-2xl font-black text-[#B45309]">8.450 MDL</p>
              </div>
              <div>
                <p className="text-[10px] text-[#5C6670] uppercase font-extrabold">Disponibil Imediat</p>
                <p className="text-2xl font-black text-[#087F5B]">21.550 MDL</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: TIERS ================= */}
        {activeTab === 'tiers' && (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-[#0D1B2A] text-xs">
            {[
              { level: 'Start', discount: '-5%', minPoints: '0 pt', desc: 'Înregistrare gratuită meșteri' },
              { level: 'Standard', discount: '-8%', minPoints: '500 pt', desc: 'Rezervare stoc 48h' },
              { level: 'Pro', discount: '-12%', minPoints: '2.500 pt', desc: 'Livrare șantier + Linie credit 15k', active: true },
              { level: 'Master', discount: '-16%', minPoints: '10.000 pt', desc: 'Manager dedicat + Linie credit 30k' },
              { level: 'Premium Partner', discount: '-20%', minPoints: '25.000 pt', desc: 'Contract exclusiv + Lead-uri garantate' }
            ].map((t, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border flex flex-col justify-between shadow-xs transition-all ${
                t.active 
                  ? 'bg-white border-[#087F5B] ring-2 ring-[#00A878]/30' 
                  : 'bg-white border-[#D9E2E1]'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-extrabold text-[#087F5B] uppercase">Nivel {idx + 1}</p>
                    {t.active && (
                      <span className="bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                        RECOMANDAT
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-base text-[#0D1B2A] mt-1">{t.level}</h4>
                  <p className="text-xl font-black text-[#087F5B] mt-2">{t.discount}</p>
                  <p className="text-[#5C6670] text-[11px] mt-1 font-medium leading-relaxed">{t.desc}</p>
                </div>
                <p className="text-[10px] font-extrabold text-[#5C6670] mt-4 pt-2 border-t border-[#D9E2E1]">Min. {t.minPoints}</p>
              </div>
            ))}
          </div>
        )}

        {/* ================= TAB 4: ACADEMY ================= */}
        {activeTab === 'academy' && (
          <div className="bg-white border border-[#D9E2E1] p-8 rounded-3xl text-[#0D1B2A] space-y-4 shadow-xs">
            <h3 className="text-lg font-black text-[#0D1B2A] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#087F5B]" />
              <span>CodeBau Academy & Traininguri Certificate</span>
            </h3>
            <p className="text-xs text-[#5C6670] font-medium leading-relaxed max-w-2xl">
              Participă la cursurile de perfecționare tehnică organizate cu furnizori precum Ceresit, Mapei, Makita și Rigips. Câștigi diplome oficiale și puncte bonus în Meister Club!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
