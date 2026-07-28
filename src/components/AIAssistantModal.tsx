import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Wrench, Calculator, ArrowRight, Loader2 } from 'lucide-react';
import { UserRole } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onNavigateTab: (tab: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Salut! Sunt Asistentul AI CodeBau. Îți pot recomanda materialele potrivite (Economic, Standard, Premium), calculul de consum per m², compatibilitățile tehnice (ex: adezivi flexibili C2TE, grunduri, chituri) și meșteri verificați. Cu ce proiect te pot ajuta astăzi?'
    }
  ]);

  const handleSendPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt.trim();
    setPrompt('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, userType: currentRole })
      });

      const data = await res.json();
      const replyText = data.reply || data.error || 'A apărut o problemă la procesarea răspunsului AI.';

      setChatHistory(prev => [...prev, { sender: 'ai', text: replyText }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { 
        sender: 'ai', 
        text: 'Pentru proiectul tău, îți recomandăm să folosești Calculatorul de Materiale CodeBau de pe platformă, care calculează automat cantitățile de adeziv, grund și chit.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white border border-[#D9E2E1] text-[#0D1B2A] rounded-3xl max-w-2xl w-full h-[80vh] flex flex-col justify-between shadow-2xl relative animate-in zoom-in duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1A3448] flex items-center justify-between bg-[#0D1B2A] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#DDF5EE] border border-[#00A878]/30 text-[#087F5B] rounded-2xl flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#087F5B]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Asistentul AI Tehnologic CodeBau</h3>
              <p className="text-xs text-[#00A878] font-medium">Consultanță materiale, consum per m² & meșteri</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-300 hover:text-white rounded-xl bg-[#13283A] hover:bg-[#1A3448] transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs bg-[#F4F7F6]">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-[#DDF5EE] text-[#087F5B] border border-[#00A878]/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#087F5B] text-white font-extrabold shadow-xs'
                  : 'bg-white border border-[#D9E2E1] text-[#0D1B2A] font-medium whitespace-pre-wrap shadow-xs'
              }`}>
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[#0D1B2A] text-white flex items-center justify-center shrink-0 font-bold">
                  U
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-[#087F5B] text-xs font-bold bg-white p-3 rounded-2xl border border-[#D9E2E1] w-fit shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#087F5B]" />
              <span>Asistentul CodeBau calculează și analizează fișele tehnice...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2 bg-white border-t border-[#D9E2E1] flex gap-2 overflow-x-auto text-[11px] font-bold scrollbar-none">
          <button 
            onClick={() => { setPrompt('Ce adeziv recomandati pentru gresie porțelanată exterior?'); }}
            className="bg-[#F8FAF9] hover:bg-[#EFFAF6] text-[#0D1B2A] hover:text-[#087F5B] px-3 py-1.5 rounded-xl whitespace-nowrap border border-[#D9E2E1] transition-colors cursor-pointer"
          >
            Adeziv gresie exterior
          </button>
          <button 
            onClick={() => { setPrompt('Câtă vopsea lavabilă am nevoie pentru un apartament de 60mp?'); }}
            className="bg-[#F8FAF9] hover:bg-[#EFFAF6] text-[#0D1B2A] hover:text-[#087F5B] px-3 py-1.5 rounded-xl whitespace-nowrap border border-[#D9E2E1] transition-colors cursor-pointer"
          >
            Consum vopsea lavabilă 60m²
          </button>
          <button 
            onClick={() => { onClose(); onNavigateTab('calculator'); }}
            className="bg-[#DDF5EE] text-[#087F5B] px-3 py-1.5 rounded-xl whitespace-nowrap border border-[#00A878]/30 flex items-center gap-1 font-extrabold hover:bg-[#087F5B] hover:text-white transition-colors cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            Deschide Calculatorul
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendPrompt} className="p-4 bg-white border-t border-[#D9E2E1] flex items-center gap-2">
          <input 
            type="text"
            placeholder="Întreabă AI CodeBau (ex: Câți saci de adeziv am nevoie pentru 30 m² gresie?)..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-[#F8FAF9] border border-[#D9E2E1] rounded-2xl px-4 py-3 text-xs text-[#0D1B2A] placeholder-[#5C6670] focus:border-[#087F5B] focus:outline-none font-medium"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-[#087F5B] hover:bg-[#066B4D] disabled:opacity-50 text-white font-black p-3 rounded-2xl shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>

      </div>
    </div>
  );
};
