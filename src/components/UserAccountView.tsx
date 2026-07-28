import React, { useState, useEffect } from 'react';
import { MOCK_WARRANTIES, MOCK_INVOICES } from '../data/mockData';
import { Order, SavedProject, DigitalWarranty, DigitalInvoice } from '../types';
import { OrderRepository } from '../services/orderRepository';
import { formatMoney } from '../utils/formatters';
import { 
  Package, Truck, QrCode, ShieldCheck, FileText, Award, FolderPlus, 
  Clock, CheckCircle2, ChevronRight, Download, RefreshCw, X, Sparkles, Share2, Trash2, ExternalLink
} from 'lucide-react';

interface UserAccountViewProps {
  savedProjects: SavedProject[];
}

export const UserAccountView: React.FC<UserAccountViewProps> = ({ savedProjects }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'locker' | 'projects' | 'warranties' | 'loyalty'>('orders');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeOrderForQr, setActiveOrderForQr] = useState<Order | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    setUserOrders(OrderRepository.getOrders());
  }, []);

  const pointsCount = 420; // 420 Puncte CodeBau

  return (
    <div className="bg-[#F4F7F6] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* ================= 1. HEADER PROFILE SUMMARY ================= */}
        <div className="bg-white border border-[#D9E2E1] p-6 rounded-3xl text-[#0D1B2A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#DDF5EE] text-[#087F5B] rounded-2xl flex items-center justify-center font-black text-xl border border-[#00A878]/30 shrink-0 shadow-xs">
              AP
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-[#0D1B2A]">Adrian Popescu</h2>
                <span className="bg-[#DDF5EE] text-[#087F5B] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-[#00A878]/30">
                  Membru CodeBau VIP
                </span>
              </div>
              <p className="text-xs text-[#5C6670] mt-0.5">Client Persoană Fizică | adrian.popescu@gmail.com</p>
            </div>
          </div>

          {/* Loyalty Quick Card */}
          <div className="bg-[#EFFAF6] p-4 rounded-2xl border border-[#00A878]/30 text-left md:text-right min-w-[220px] w-full md:w-auto">
            <p className="text-[10px] text-[#5C6670] uppercase font-extrabold">Puncte Fidelitate CodeBau</p>
            <div className="flex items-baseline justify-start md:justify-end gap-1 mt-0.5">
              <span className="text-2xl font-black text-[#087F5B]">{pointsCount}</span>
              <span className="text-xs font-bold text-[#0D1B2A]">Puncte</span>
            </div>
            <p className="text-[11px] text-[#087F5B] font-extrabold mt-0.5">Echivalent cu 42.00 MDL reducere</p>
          </div>
        </div>

        {/* ================= 2. ACCOUNT NAVIGATION TABS ================= */}
        <div className="bg-white border border-[#D9E2E1] rounded-2xl p-1.5 flex gap-1.5 overflow-x-auto scrollbar-none shadow-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Comenzile Mele ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('locker')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'locker' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Ridicare Locker 24/7</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'projects' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Proiecte Salvate ({savedProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('warranties')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'warranties' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Garanții & Facturi</span>
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'loyalty' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Program Fidelitate</span>
          </button>
        </div>

        {/* ================= TAB 1: ORDERS TIMELINE ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {userOrders.length === 0 ? (
              <div className="bg-white border border-[#D9E2E1] p-8 rounded-3xl text-center space-y-3">
                <Package className="w-10 h-10 text-[#087F5B] mx-auto" />
                <h3 className="font-extrabold text-[#0D1B2A] text-sm">Nu ai nicio comandă plasată încă</h3>
                <p className="text-xs text-[#5C6670]">Adaugă produse în coș și plasează prima ta comandă de test.</p>
              </div>
            ) : (
              userOrders.map(order => (
                <div key={order.id} className="bg-white border border-[#D9E2E1] p-6 rounded-3xl text-[#0D1B2A] space-y-6 shadow-xs">
                
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#D9E2E1] pb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-[#087F5B]">{order.orderNumber}</span>
                      <span className="bg-[#E9ECEF] text-[#5C6670] text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {order.date}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C6670] mt-1">
                      Metodă livrare: <strong className="text-[#0D1B2A]">{order.deliveryMethod === 'express_site' ? 'Livrare Rapidă pe Șantier' : 'Locker CodeBau 24/7'}</strong>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-lg font-black text-[#0D1B2A]">{order.total.toFixed(2)} MDL</p>
                    <span className="bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                      Plătit Online Securizat
                    </span>
                  </div>
                </div>

                {/* Real-time Order Tracking Stepper */}
                <div className="space-y-3">
                  <p className="text-xs font-extrabold text-[#5C6670] uppercase tracking-wider">Status Livrare în Timp Real:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {order.trackingSteps.map((step, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-2xl border text-xs flex flex-col justify-between h-20 transition-all ${
                          step.completed 
                            ? 'bg-[#DDF5EE] border-[#00A878]/40 text-[#087F5B]' 
                            : 'bg-[#F8FAF9] border-[#D9E2E1] text-[#5C6670]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold">{step.label}</span>
                          {step.completed && <CheckCircle2 className="w-4 h-4 text-[#087F5B]" />}
                        </div>
                        {step.date && <span className="text-[10px] font-mono text-[#5C6670]">{step.date}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-[#D9E2E1] space-y-2">
                  <p className="text-[10px] text-[#5C6670] uppercase font-extrabold mb-2">Produse în Comandă:</p>
                  {order.items.map((it, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-[#D9E2E1]/50 last:border-0">
                      <span className="text-[#0D1B2A] font-semibold">{it.product.name} (x{it.quantity})</span>
                      <span className="font-mono text-[#087F5B] font-extrabold">{(it.appliedPrice * it.quantity).toFixed(2)} MDL</span>
                    </div>
                  ))}
                </div>

                {order.lockerCode && (
                  <button
                    onClick={() => {
                      setActiveOrderForQr(order);
                      setQrModalOpen(true);
                    }}
                    className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-white" />
                    <span>Deschide Ușa Locker-ului CodeBau 24/7 (Cod: {order.lockerCode})</span>
                  </button>
                )}

              </div>
            ))
            )}
          </div>
        )}

        {/* ================= TAB 2: LOCKER 24/7 ================= */}
        {activeTab === 'locker' && (
          <div className="bg-white border border-[#D9E2E1] p-8 rounded-3xl text-[#0D1B2A] text-center space-y-6 max-w-lg mx-auto shadow-xs">
            <div className="w-20 h-20 bg-[#DDF5EE] text-[#087F5B] rounded-3xl flex items-center justify-center mx-auto border border-[#00A878]/30">
              <QrCode className="w-10 h-10" />
            </div>
            
            <div>
              <h3 className="text-xl font-black text-[#0D1B2A]">Locker CodeBau 24/7</h3>
              <p className="text-xs text-[#5C6670] leading-relaxed mt-2">
                Pachetul tău te așteaptă la <strong>CodeBau Cahul - Casetă #14</strong>. Scanează codul QR la ecranul locker-ului sau tastează PIN-ul de acces.
              </p>
            </div>

            <div className="bg-[#EFFAF6] p-6 rounded-2xl border border-[#00A878]/30 space-y-2">
              <p className="text-xs text-[#5C6670] uppercase font-extrabold">Cod Acces Unic (Valabil 48 ore)</p>
              <p className="text-3xl font-black font-mono text-[#087F5B] tracking-widest">CB-7739</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (userOrders.length > 0) {
                    setActiveOrderForQr(userOrders[0]);
                    setQrModalOpen(true);
                  }
                }}
                className="w-full bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>Afișează Codul QR pentru Scanare</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SAVED PROJECTS ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {savedProjects.length === 0 ? (
              <div className="bg-white border border-[#D9E2E1] p-8 rounded-3xl text-center text-[#0D1B2A] space-y-4 shadow-xs">
                <div className="w-14 h-14 bg-[#DDF5EE] text-[#087F5B] rounded-2xl flex items-center justify-center mx-auto border border-[#00A878]/30">
                  <FolderPlus className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#0D1B2A]">Nu ai proiecte salvate momentan</h3>
                  <p className="text-xs text-[#5C6670] mt-1 max-w-md mx-auto">
                    Folosește Calculatorul de Materiale CodeBau pentru a calcula devizul necesar și salvează-l ca proiect personal!
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedProjects.map(proj => (
                  <div key={proj.id} className="bg-white border border-[#D9E2E1] p-5 rounded-3xl text-[#0D1B2A] space-y-3 shadow-xs hover:border-[#087F5B] transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-lg text-[#0D1B2A]">{proj.title}</h4>
                        <span className="bg-[#DDF5EE] text-[#087F5B] text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          Salvat
                        </span>
                      </div>
                      <p className="text-xs text-[#5C6670] mt-2">
                        Valoare estimată: <strong className="text-[#087F5B] font-black">{proj.budget.toFixed(2)} MDL</strong>
                      </p>
                      <p className="text-xs text-[#5C6670] mt-0.5">Produse incluse: {proj.items.length} articole</p>
                    </div>

                    <div className="pt-3 border-t border-[#D9E2E1] flex items-center gap-2">
                      <button className="flex-1 bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Deschide</span>
                      </button>
                      <button className="p-2 bg-[#F8FAF9] hover:bg-[#E9ECEF] text-[#0D1B2A] rounded-xl border border-[#D9E2E1] cursor-pointer" title="Partajează">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: DIGITAL WARRANTIES & INVOICES ================= */}
        {activeTab === 'warranties' && (
          <div className="space-y-6">
            
            {/* Warranties Card */}
            <div className="bg-white border border-[#D9E2E1] p-6 rounded-3xl text-[#0D1B2A] space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#D9E2E1] pb-3">
                <h3 className="font-black text-base text-[#0D1B2A] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#087F5B]" />
                  <span>Garanțiile Tale Digitale Active</span>
                </h3>
                <span className="text-xs font-bold text-[#5C6670]">
                  {MOCK_WARRANTIES.length} Produse acoperite
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {MOCK_WARRANTIES.map(war => (
                  <div key={war.id} className="bg-[#F8FAF9] hover:bg-[#EFFAF6] p-4 rounded-2xl border border-[#D9E2E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                    <div>
                      <p className="font-extrabold text-[#0D1B2A]">{war.productName}</p>
                      <p className="text-[#5C6670] text-[11px] mt-0.5">Factură: {war.invoiceNumber} | Serie: {war.serialNumber}</p>
                    </div>
                    <div>
                      <span className="bg-[#DDF5EE] text-[#087F5B] font-extrabold px-3 py-1 rounded-lg border border-[#00A878]/30 text-xs inline-block">
                        Garanție Valabilă până la {war.expiryDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoices Card */}
            <div className="bg-white border border-[#D9E2E1] p-6 rounded-3xl text-[#0D1B2A] space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#D9E2E1] pb-3">
                <h3 className="font-black text-base text-[#0D1B2A] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#087F5B]" />
                  <span>Facturi Digitale Descărcabile</span>
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                {MOCK_INVOICES.map(inv => (
                  <div key={inv.id} className="bg-[#F8FAF9] hover:bg-[#EFFAF6] p-4 rounded-2xl border border-[#D9E2E1] flex items-center justify-between gap-3 transition-colors">
                    <div>
                      <p className="font-extrabold text-[#0D1B2A]">Factură fiscală #{inv.number}</p>
                      <p className="text-[#5C6670] text-[11px] mt-0.5">ID: {inv.id} | Data: {inv.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#0D1B2A] text-sm">{inv.totalAmount.toFixed(2)} MDL</span>
                      <button className="p-2 bg-white hover:bg-[#E9ECEF] text-[#0D1B2A] rounded-xl border border-[#D9E2E1] transition-colors cursor-pointer" title="Descarcă PDF">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 5: PROGRAM FIDELITATE ================= */}
        {activeTab === 'loyalty' && (
          <div className="bg-white border border-[#D9E2E1] p-6 rounded-3xl text-[#0D1B2A] space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D9E2E1] pb-4 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#DDF5EE] text-[#087F5B] rounded-2xl flex items-center justify-center font-black border border-[#00A878]/30">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0D1B2A]">Programul de Fidelitate CodeBau</h3>
                  <p className="text-xs text-[#5C6670]">Acumulează puncte la fiecare achiziție și folosește-le ca reducere la comenzile viitoare</p>
                </div>
              </div>

              <div className="bg-[#EFFAF6] border border-[#00A878]/30 p-3 rounded-2xl text-right">
                <p className="text-[10px] text-[#5C6670] uppercase font-extrabold">Sold curent</p>
                <p className="text-xl font-black text-[#087F5B]">{pointsCount} Puncte (42.00 MDL)</p>
              </div>
            </div>

            {/* Loyalty Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-[#D9E2E1] space-y-1">
                <span className="text-[10px] font-black uppercase text-[#087F5B] bg-[#DDF5EE] px-2 py-0.5 rounded">Rată Conversie</span>
                <h4 className="font-extrabold text-sm text-[#0D1B2A] pt-1">10 MDL = 1 Punct</h4>
                <p className="text-xs text-[#5C6670]">Fiecare 10 puncte acumulate valorează 1.00 MDL reducere la casă.</p>
              </div>

              <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-[#D9E2E1] space-y-1">
                <span className="text-[10px] font-black uppercase text-[#087F5B] bg-[#DDF5EE] px-2 py-0.5 rounded">Beneficiu VIP</span>
                <h4 className="font-extrabold text-sm text-[#0D1B2A] pt-1">Locker 24/7 Gratuit</h4>
                <p className="text-xs text-[#5C6670]">Rezervare prioritară și livrare gratuită în casetele securizate CodeBau.</p>
              </div>

              <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-[#D9E2E1] space-y-1">
                <span className="text-[10px] font-black uppercase text-[#087F5B] bg-[#DDF5EE] px-2 py-0.5 rounded">Retur Extins</span>
                <h4 className="font-extrabold text-sm text-[#0D1B2A] pt-1">30 Zile Retur Gratuit</h4>
                <p className="text-xs text-[#5C6670]">Perioadă dublă de retur pentru materialele nedesfăcute.</p>
              </div>
            </div>

            {/* Recent Points History */}
            <div className="space-y-3 pt-2">
              <h4 className="font-black text-sm text-[#0D1B2A]">Istoric Recenta Puncte</h4>
              <div className="space-y-2 text-xs">
                <div className="bg-[#F8FAF9] p-3 rounded-xl border border-[#D9E2E1] flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-[#0D1B2A]">Comandă finalizată #CB-10482</p>
                    <p className="text-[10px] text-[#5C6670]">14 Mai 2026</p>
                  </div>
                  <span className="font-black text-[#087F5B] text-sm">+50 Puncte</span>
                </div>
                <div className="bg-[#F8FAF9] p-3 rounded-xl border border-[#D9E2E1] flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-[#0D1B2A]">Recenzie verificată produs Ceresit CM 17</p>
                    <p className="text-[10px] text-[#5C6670]">2 Februarie 2026</p>
                  </div>
                  <span className="font-black text-[#087F5B] text-sm">+20 Puncte</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= QR CODE PICKUP MODAL ================= */}
        {qrModalOpen && activeOrderForQr && (
          <div className="fixed inset-0 bg-[#0D1B2A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#D9E2E1] text-[#0D1B2A] p-6 rounded-3xl max-w-sm w-full text-center relative shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setQrModalOpen(false)} 
                className="absolute top-4 right-4 text-[#5C6670] hover:text-[#0D1B2A] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-[#DDF5EE] text-[#087F5B] rounded-2xl flex items-center justify-center mx-auto border border-[#00A878]/30">
                <QrCode className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-black text-lg text-[#0D1B2A]">Cod QR Deschidere Locker</h3>
                <p className="text-xs text-[#5C6670] mt-1">Apropie codul QR de cititorul optoelectronic al Casetii #14</p>
              </div>

              <div className="bg-white p-6 rounded-2xl inline-block mx-auto border-4 border-[#087F5B] shadow-sm">
                {/* QR Code Visual Simulation */}
                <div className="w-40 h-40 bg-[#0D1B2A] p-2 grid grid-cols-6 gap-1 rounded-lg">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className={`${i % 2 === 0 || i % 5 === 0 ? 'bg-white' : 'bg-[#0D1B2A]'} rounded-sm`}></div>
                  ))}
                </div>
              </div>

              <p className="text-2xl font-black font-mono text-[#087F5B] tracking-widest">{activeOrderForQr.lockerCode}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
