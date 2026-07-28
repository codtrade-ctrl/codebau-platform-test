import React, { useState } from 'react';
import { MOCK_B2B_PROFILE, MOCK_PRODUCTS } from '../data/mockData';
import { Building2, DollarSign, FileText, CheckCircle2, ShieldCheck, Users, Upload, Send, Plus, ArrowRight, Download } from 'lucide-react';

export const B2BView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'quick_order' | 'approvals' | 'documents'>('overview');
  
  // Bulk order inputs
  const [bulkSkus, setBulkSkus] = useState('CER-CM17-25, 20\nMAP-MAPELAST-16, 5\nSAV-ULTRA-15, 8');
  const [selectedCostCenter, setSelectedCostCenter] = useState(MOCK_B2B_PROFILE.costCenters[0]);
  const [quoteCreatedMsg, setQuoteCreatedMsg] = useState('');

  const handleProcessBulkOrder = () => {
    setQuoteCreatedMsg(`✅ Oferta Comercială B2B pentru "${selectedCostCenter}" a fost generată! A fost transmisă spre aprobare internă către directorul financiar.`);
    setTimeout(() => setQuoteCreatedMsg(''), 5000);
  };

  return (
    <div className="bg-[#F4F7F6] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* ================= BANNER (NAVY B2B) ================= */}
        <div className="bg-[#0D1B2A] border border-[#1A3448] p-8 sm:p-10 rounded-3xl text-white relative overflow-hidden shadow-xs">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#DDF5EE] text-[#087F5B] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
                <Building2 className="w-4 h-4 text-[#087F5B]" />
                <span>Cont Corporativ B2B & Dezvoltatori</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {MOCK_B2B_PROFILE.companyName}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                CUI: {MOCK_B2B_PROFILE.cui} | Condiții contractuale negociate: <strong>-{MOCK_B2B_PROFILE.discountRate}% discount garantat</strong> la întregul catalog CodeBau. Manager dedicat: {MOCK_B2B_PROFILE.assignedAccountManager}.
              </p>
            </div>

            <div className="bg-[#13283A] p-5 rounded-2xl border border-[#1A3448] text-right min-w-[240px] w-full md:w-auto">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase">Plafon Credit Contractual</p>
              <p className="text-2xl font-black text-[#00A878]">150.000 MDL</p>
              <p className="text-xs text-slate-300 mt-1">Utilizat: 34.200 MDL | <strong className="text-white">Disponibil: 115.800 MDL</strong></p>
            </div>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <div className="bg-white border border-[#D9E2E1] rounded-2xl p-1.5 flex gap-1.5 overflow-x-auto scrollbar-none shadow-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Panou B2B & Centre de Cost</span>
          </button>

          <button
            onClick={() => setActiveTab('quick_order')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'quick_order' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Comandă Rapidă SKU / CSV</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'approvals' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Aprobări Interne & Utilizatori</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'documents' 
                ? 'bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 shadow-xs' 
                : 'text-[#0D1B2A] hover:text-[#087F5B] hover:bg-[#EFFAF6]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Facturi & Oferte Comerciale</span>
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#0D1B2A] text-xs">
            
            <div className="bg-white border border-[#D9E2E1] p-6 rounded-3xl space-y-3 shadow-xs">
              <h4 className="font-black text-sm text-[#0D1B2A] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#087F5B]" />
                <span>Șantiere & Centre de Cost</span>
              </h4>
              <div className="space-y-2 pt-2">
                {MOCK_B2B_PROFILE.costCenters.map((cc, i) => (
                  <div key={i} className="bg-[#F8FAF9] p-3 rounded-xl border border-[#D9E2E1] flex items-center justify-between">
                    <span className="font-extrabold text-[#0D1B2A]">{cc}</span>
                    <span className="text-[10px] bg-[#DDF5EE] text-[#087F5B] font-extrabold px-2 py-0.5 rounded-md border border-[#00A878]/30">Activ</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#D9E2E1] p-6 rounded-3xl space-y-3 shadow-xs">
              <h4 className="font-black text-sm text-[#0D1B2A] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#087F5B]" />
                <span>Situație Financiară Scadențe</span>
              </h4>
              <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-[#D9E2E1] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#5C6670] font-medium">Facturi neachitate (30 zile):</span>
                  <span className="font-black text-[#B45309]">34.200 MDL</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#D9E2E1]">
                  <span className="text-[#5C6670] font-medium">Următoarea Scadență:</span>
                  <span className="font-black text-[#0D1B2A]">15 August 2026</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#D9E2E1] p-6 rounded-3xl space-y-3 shadow-xs">
              <h4 className="font-black text-sm text-[#0D1B2A] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#087F5B]" />
                <span>Manager B2B Dedicat</span>
              </h4>
              <p className="text-[#0D1B2A] font-extrabold leading-relaxed">
                {MOCK_B2B_PROFILE.assignedAccountManager}
              </p>
              <p className="text-[#5C6670] text-[11px] pt-2 border-t border-[#D9E2E1] font-medium leading-relaxed">
                Asistență prioritară pentru devize mari, livrări speciale cu tirul pe șantiere și negocieri directe de volum.
              </p>
            </div>

          </div>
        )}

        {/* Quick Order SKU tab */}
        {activeTab === 'quick_order' && (
          <div className="bg-white border border-[#D9E2E1] p-8 rounded-3xl text-[#0D1B2A] space-y-6 max-w-3xl mx-auto shadow-xs">
            <h3 className="text-lg font-black text-[#0D1B2A] flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#087F5B]" />
              <span>Comandă Bulk prin Introducere Coduri SKU sau Fișier CSV</span>
            </h3>
            <p className="text-xs text-[#5C6670] font-medium leading-relaxed">
              Introduceți codurile SKU din catalog și cantitatea dorită (ex: <code>CER-CM17-25, 20</code>) pentru a genera instant o ofertă comercială fermă cu discount B2B.
            </p>

            {quoteCreatedMsg && (
              <div className="bg-[#DDF5EE] border border-[#00A878]/40 text-[#087F5B] p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#087F5B]" />
                <span>{quoteCreatedMsg}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Selectează Șantierul / Centrul de Cost:</label>
                <select
                  value={selectedCostCenter}
                  onChange={(e) => setSelectedCostCenter(e.target.value)}
                  className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-2.5 text-xs text-[#087F5B] font-extrabold focus:border-[#087F5B] focus:outline-none cursor-pointer"
                >
                  {MOCK_B2B_PROFILE.costCenters.map((cc, i) => (
                    <option key={i} value={cc}>{cc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Listă Coduri SKU & Cantitate (format: SKU, Cantitate):</label>
                <textarea
                  rows={5}
                  value={bulkSkus}
                  onChange={(e) => setBulkSkus(e.target.value)}
                  className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-3 text-xs font-mono text-[#0D1B2A] focus:border-[#087F5B] focus:outline-none"
                ></textarea>
              </div>

              <button
                onClick={handleProcessBulkOrder}
                className="w-full bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-3.5 rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>Generează Ofertă Comercială B2B PDF</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
