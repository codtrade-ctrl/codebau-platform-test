import React, { useState } from 'react';
import { Craftsman, MeisterTier } from '../types';
import { MOCK_CRAFTSMEN } from '../data/mockData';
import { Wrench, ShieldCheck, Star, MapPin, Calendar, CheckCircle2, MessageSquare, Phone, Mail, FileText, Send, X, Layers, Sparkles } from 'lucide-react';

interface CraftsmenViewProps {
  onSelectCraftsmanForProject?: (craftsman: Craftsman) => void;
}

export const CraftsmenView: React.FC = () => {
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [selectedCraftsman, setSelectedCraftsman] = useState<Craftsman | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestSentMsg, setRequestSentMsg] = useState('');

  const [requestForm, setRequestForm] = useState({
    projectType: 'Renovare Baie',
    location: 'Cahul - Sudul Moldovei',
    desiredDate: '2026-08-10',
    areaSqM: '25',
    notes: 'Avem nevoie de montat gresie porțelanată 60x60 și hidroizolație impermeabilă.',
    model: 'codebau_managed'
  });

  const filteredCraftsmen = MOCK_CRAFTSMEN.filter(c => {
    if (specialtyFilter === 'all') return true;
    return (c.specialties || []).some(s => (s || '').toLowerCase().includes((specialtyFilter || '').toLowerCase()));
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSentMsg(`✅ Solicitare trimisă cu succes către ${selectedCraftsman?.name}! În scurt timp vei primi un deviz detaliat.`);
    setTimeout(() => {
      setRequestSentMsg('');
      setRequestModalOpen(false);
    }, 4000);
  };

  return (
    <div className="bg-[#F4F7F6] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* ================= HERO HEADER ================= */}
        <div className="bg-gradient-to-br from-white via-[#EFFAF6] to-[#E9ECEF] border border-[#D9E2E1] p-8 sm:p-10 rounded-3xl text-[#0D1B2A] relative overflow-hidden shadow-xs">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#DDF5EE] text-[#087F5B] text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-[#00A878]/30">
              <Wrench className="w-4 h-4 text-[#087F5B]" />
              <span>Rețeaua CodeBau Meister Club</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0D1B2A]">
              Găsește un meșter verificat
            </h1>
            <p className="text-[#5C6670] text-sm font-medium leading-relaxed">
              Compară specializările, portofoliul, zona de lucru și disponibilitatea profesională a meșterilor autorizați din Cahul și tot sudul Moldovei.
            </p>
          </div>
        </div>

        {/* ================= SPECIALTY FILTER PILLS ================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-extrabold scrollbar-none">
          {[
            { id: 'all', label: 'Toți Meșterii' },
            { id: 'gresie', label: 'Gresie & Faianță' },
            { id: 'zugrav', label: 'Zugrăveli & Finisaje' },
            { id: 'electric', label: 'Instalații Electrice' },
            { id: 'sanitar', label: 'Sanitare & Încălzire' },
            { id: 'izolatii', label: 'Termoizolații' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setSpecialtyFilter(filter.id)}
              className={`px-4 py-2.5 rounded-2xl border transition-all whitespace-nowrap cursor-pointer ${
                specialtyFilter === filter.id 
                  ? 'bg-[#087F5B] text-white border-[#087F5B] shadow-xs' 
                  : 'bg-white text-[#0D1B2A] border-[#D9E2E1] hover:border-[#087F5B]/50 hover:bg-[#EFFAF6]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* ================= CRAFTSMEN DIRECTORY GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCraftsmen.map(craftsman => (
            <div key={craftsman.id} className="bg-white border border-[#D9E2E1] rounded-3xl p-6 text-[#0D1B2A] space-y-4 hover:border-[#087F5B] transition-all flex flex-col justify-between shadow-xs">
              
              <div>
                {/* Header Info */}
                <div className="flex items-start gap-4">
                  <img src={craftsman.avatar} alt={craftsman.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D9E2E1] shadow-xs shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-base text-[#0D1B2A]">{craftsman.name}</h3>
                      {craftsman.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-[#087F5B] fill-[#DDF5EE]" title="Meșter Verificat CodeBau" />
                      )}
                    </div>
                    <p className="text-xs text-[#087F5B] font-extrabold">{craftsman.companyName}</p>
                    
                    {/* Tier Badge */}
                    <span className="inline-block mt-1 bg-[#DDF5EE] text-[#087F5B] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-[#00A878]/30">
                      Nivel Meister: {craftsman.meisterLevel}
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 bg-[#F8FAF9] p-3 rounded-2xl border border-[#D9E2E1] my-4 text-center text-xs">
                  <div>
                    <div className="flex items-center justify-center text-[#F4B400] font-black">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      <span>{craftsman.rating}</span>
                    </div>
                    <p className="text-[10px] text-[#5C6670] font-medium">{craftsman.reviewsCount} recenzii</p>
                  </div>
                  <div>
                    <p className="font-black text-[#0D1B2A]">{craftsman.completedJobs}</p>
                    <p className="text-[10px] text-[#5C6670] font-medium">Lucrări finalizate</p>
                  </div>
                  <div>
                    <p className="font-black text-[#087F5B]">{craftsman.experienceYears} Ani</p>
                    <p className="text-[10px] text-[#5C6670] font-medium">Experiență</p>
                  </div>
                </div>

                {/* Bio & Specialties */}
                <p className="text-xs text-[#5C6670] line-clamp-3 leading-relaxed mb-3 font-medium">{craftsman.bio}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {craftsman.specialties.map((spec, i) => (
                    <span key={i} className="bg-[#EFFAF6] text-[#087F5B] text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-[#00A878]/30">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Portfolio Preview */}
                {craftsman.portfolioImages.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#5C6670] uppercase font-extrabold">Portofoliu Lucrări Recent:</p>
                    <div className="flex gap-2">
                      {craftsman.portfolioImages.map((img, idx) => (
                        <img key={idx} src={img} alt="Portofoliu" className="w-20 h-14 object-cover rounded-xl border border-[#D9E2E1]" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions & Availability */}
              <div className="pt-4 border-t border-[#D9E2E1] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-[#5C6670] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#087F5B]" /> {craftsman.location}
                  </span>
                  <span className="bg-[#DDF5EE] text-[#087F5B] text-[11px] font-extrabold px-2.5 py-1 rounded-lg border border-[#00A878]/30">
                    Disponibil din {craftsman.availableFrom}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedCraftsman(craftsman);
                    setRequestModalOpen(true);
                  }}
                  className="w-full bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-3 rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Solicită ofertă / Programează lucrarea</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* ================= QUOTE MODAL ================= */}
        {requestModalOpen && selectedCraftsman && (
          <div className="fixed inset-0 bg-[#0D1B2A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#D9E2E1] text-[#0D1B2A] p-6 rounded-3xl max-w-lg w-full relative shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              
              <button 
                onClick={() => setRequestModalOpen(false)}
                className="absolute top-4 right-4 text-[#5C6670] hover:text-[#0D1B2A] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-[#D9E2E1] pb-4">
                <img src={selectedCraftsman.avatar} alt={selectedCraftsman.name} className="w-12 h-12 rounded-xl object-cover border border-[#D9E2E1]" />
                <div>
                  <h3 className="font-extrabold text-base text-[#0D1B2A]">Solicită ofertă de la {selectedCraftsman.name}</h3>
                  <p className="text-xs text-[#087F5B] font-extrabold">{selectedCraftsman.companyName} (Nivel {selectedCraftsman.meisterLevel})</p>
                </div>
              </div>

              {requestSentMsg ? (
                <div className="bg-[#DDF5EE] border border-[#00A878]/40 text-[#087F5B] p-4 rounded-2xl text-xs font-bold space-y-2">
                  <p>{requestSentMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-4 text-xs">
                  
                  <div>
                    <label className="block text-[#0D1B2A] font-extrabold mb-1">Tip Proiect / Lucrare:</label>
                    <input 
                      type="text"
                      value={requestForm.projectType}
                      onChange={(e) => setRequestForm({ ...requestForm, projectType: e.target.value })}
                      className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-2.5 text-[#0D1B2A] font-medium focus:border-[#087F5B] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#0D1B2A] font-extrabold mb-1">Localitate / Adresă:</label>
                      <input 
                        type="text"
                        value={requestForm.location}
                        onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
                        className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-2.5 text-[#0D1B2A] font-medium focus:border-[#087F5B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0D1B2A] font-extrabold mb-1">Suprafață m²:</label>
                      <input 
                        type="number"
                        value={requestForm.areaSqM}
                        onChange={(e) => setRequestForm({ ...requestForm, areaSqM: e.target.value })}
                        className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-2.5 text-[#0D1B2A] font-medium focus:border-[#087F5B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#0D1B2A] font-extrabold mb-1">Alege Modelul de Contract & Garanție:</label>
                    <select
                      value={requestForm.model}
                      onChange={(e) => setRequestForm({ ...requestForm, model: e.target.value })}
                      className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-2.5 text-[#087F5B] font-extrabold focus:border-[#087F5B] focus:outline-none cursor-pointer"
                    >
                      <option value="codebau_managed">Serviciu Vândut prin CodeBau (Garanție 100% CodeBau & Factură)</option>
                      <option value="verified">Meșter Partener Verificat (Contract Direct)</option>
                      <option value="simple">Recomandare Simplă (Negociere Liberă)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#0D1B2A] font-extrabold mb-1">Descriere & Detalii suplimentare:</label>
                    <textarea 
                      rows={3}
                      value={requestForm.notes}
                      onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                      className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-2.5 text-[#0D1B2A] font-medium focus:border-[#087F5B] focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold py-3 rounded-xl shadow-xs transition-colors text-xs cursor-pointer"
                  >
                    Trimite Solicitarea de Deviz
                  </button>

                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
