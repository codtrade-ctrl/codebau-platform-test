import React, { useState, useEffect } from 'react';
import { Promotion, PromotionType, UserRole, PromotionAuditLog } from '../types';
import { PromotionService } from '../services/PromotionService';
import { MOCK_PRODUCTS, MOCK_STORES } from '../data/mockData';
import { Plus, Edit3, Trash2, Tag, Calendar, ShieldCheck, Check, AlertCircle, RefreshCw, Layers, Shield, Eye, Info } from 'lucide-react';

export const AdminPromotionsView: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [auditLogs, setAuditLogs] = useState<PromotionAuditLog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'promos' | 'logs'>('promos');

  // Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<PromotionType>('percentage');
  const [formValue, setFormValue] = useState<number>(10);
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState('2026-12-31');
  const [formTargetRoles, setFormTargetRoles] = useState<Array<UserRole | 'all'>>(['all']);
  const [formStoreScope, setFormStoreScope] = useState<'all' | 'specific'>('all');
  const [formStores, setFormStores] = useState<string[]>(['CodeBau Cahul']);
  const [formProductScope, setFormProductScope] = useState<'all' | 'specific' | 'category'>('all');
  const [formProductIds, setFormProductIds] = useState<string[]>([]);
  const [formCategories, setFormCategories] = useState<string[]>([]);
  const [formMaxQty, setFormMaxQty] = useState<number | undefined>(undefined);
  const [formPriority, setFormPriority] = useState<number>(10);
  const [formBadgeText, setFormBadgeText] = useState('PROMOȚIE');

  const loadData = () => {
    setPromotions(PromotionService.getPromotions());
    setAuditLogs(PromotionService.getAuditLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormName('');
    setFormCode('');
    setFormDescription('');
    setFormType('percentage');
    setFormValue(10);
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate('2026-12-31');
    setFormTargetRoles(['all']);
    setFormStoreScope('all');
    setFormStores(['CodeBau Cahul']);
    setFormProductScope('all');
    setFormProductIds([]);
    setFormCategories([]);
    setFormMaxQty(undefined);
    setFormPriority(10);
    setFormBadgeText('PROMOȚIE');
    setEditingId(null);
    setIsCreating(false);
  };

  const handleEdit = (p: Promotion) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormCode(p.id);
    setFormDescription(p.description || '');
    setFormType(p.type);
    setFormValue(p.discountPercentage || p.discountAmount || p.fixedPrice || 10);
    setFormStartDate(p.startDate);
    setFormEndDate(p.endDate);
    setFormTargetRoles((p.customerRoles as any) || ['all']);
    setFormStoreScope(p.storeIds && p.storeIds.includes('all') ? 'all' : 'specific');
    setFormStores(p.storeIds || ['CodeBau Cahul']);
    setFormProductScope(p.productIds && p.productIds.length > 0 ? 'specific' : p.categoryIds && p.categoryIds.length > 0 ? 'category' : 'all');
    setFormProductIds(p.productIds || []);
    setFormCategories(p.categoryIds || []);
    setFormMaxQty(p.maxQuantityPerCustomer);
    setFormPriority(p.priority || 10);
    setFormBadgeText(p.badgeText || 'PROMOȚIE');
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const promoData: Promotion = {
      id: editingId || `PROMO-${Date.now().toString().slice(-6)}`,
      name: formName,
      description: formDescription,
      type: formType,
      discountPercentage: formType === 'percentage_discount' ? Number(formValue) : undefined,
      discountAmount: formType === 'amount_discount' ? Number(formValue) : undefined,
      fixedPrice: formType === 'fixed_price' ? Number(formValue) : undefined,
      startDate: formStartDate,
      endDate: formEndDate,
      active: true,
      customerRoles: formTargetRoles as string[],
      storeIds: formStoreScope === 'all' ? ['all'] : formStores,
      productIds: formProductScope === 'specific' ? formProductIds : undefined,
      categoryIds: formProductScope === 'category' ? formCategories : undefined,
      maxQuantityPerCustomer: formMaxQty ? Number(formMaxQty) : undefined,
      priority: Number(formPriority),
      badgeText: formBadgeText || 'PROMOȚIE',
      terms: formDescription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin_codebau',
      updatedBy: 'admin_codebau',
      isTestData: true
    };

    PromotionService.upsertPromotion(promoData, 'admin_codebau');

    loadData();
    resetForm();
  };

  const handleToggleActive = (id: string, current: boolean) => {
    PromotionService.togglePromotionStatus(id, !current, 'admin_codebau');
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Sigur doriți să ștergeți această promoție?')) {
      PromotionService.deletePromotion(id, 'Admin CodeBau');
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#D9E2E1] shadow-xs">
        <div>
          <h2 className="text-xl font-black text-[#0D1B2A] flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-500 fill-current" />
            <span>Administrare Campania Promoțională CodeBau</span>
          </h2>
          <p className="text-xs text-[#5C6670] mt-0.5 font-medium">
            Gestionare discount-uri, reguli speciale pe roluri (Retail/Meister/B2B) și stocuri pe magazine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetForm();
              setIsCreating(!isCreating);
            }}
            className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? 'Anulează' : 'Creează Promoție Nouă'}</span>
          </button>
        </div>
      </div>

      {/* Sub tabs: Promos vs Audit Logs */}
      <div className="flex border-b border-[#D9E2E1] text-xs font-bold uppercase tracking-wider gap-4">
        <button
          onClick={() => setActiveSubTab('promos')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'promos' ? 'border-[#087F5B] text-[#087F5B] font-extrabold' : 'border-transparent text-[#5C6670]'
          }`}
        >
          Campanii Active ({promotions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'logs' ? 'border-[#087F5B] text-[#087F5B] font-extrabold' : 'border-transparent text-[#5C6670]'
          }`}
        >
          Jurnal Audit & Modificări ({auditLogs.length})
        </button>
      </div>

      {/* Create / Edit Form */}
      {isCreating && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#D9E2E1] space-y-5 shadow-sm animate-in fade-in duration-200">
          <h3 className="text-base font-extrabold text-[#0D1B2A] border-b border-[#D9E2E1] pb-3 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#087F5B]" />
            <span>{editingId ? 'Editează Promoția' : 'Configurare Promoție Nouă'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            {/* Name */}
            <div>
              <label className="block font-bold text-[#0D1B2A] mb-1">Nume Promoție *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="ex: Reducere Primăvară Adezivi"
                className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#087F5B]"
              />
            </div>

            {/* Code */}
            <div>
              <label className="block font-bold text-[#0D1B2A] mb-1">Cod Promo (Opțional)</label>
              <input
                type="text"
                value={formCode}
                onChange={e => setFormCode(e.target.value)}
                placeholder="ex: CODEBAU2026"
                className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-2 font-mono uppercase focus:outline-none focus:border-[#087F5B]"
              />
            </div>

            {/* Badge Text */}
            <div>
              <label className="block font-bold text-[#0D1B2A] mb-1">Text Badge Card</label>
              <input
                type="text"
                value={formBadgeText}
                onChange={e => setFormBadgeText(e.target.value)}
                placeholder="ex: PROMOȚIE, OFERTĂ MEȘTER"
                className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-[#087F5B]"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block font-bold text-[#0D1B2A] mb-1">Tip Discount *</label>
              <select
                value={formType}
                onChange={e => setFormType(e.target.value as PromotionType)}
                className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#087F5B]"
              >
                <option value="percentage">Procentual (%)</option>
                <option value="fixed_amount">Suma Fixă Redusă (MDL/unitate)</option>
                <option value="fixed_price">Preț Fix Final (MDL)</option>
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="block font-bold text-[#0D1B2A] mb-1">Valoare Discount *</label>
              <input
                type="number"
                required
                min={0}
                step={0.5}
                value={formValue}
                onChange={e => setFormValue(Number(e.target.value))}
                className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-2 font-black focus:outline-none focus:border-[#087F5B]"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block font-bold text-[#0D1B2A] mb-1">Prioritate Conflict (Mai mare = se aplică prima)</label>
              <input
                type="number"
                value={formPriority}
                onChange={e => setFormPriority(Number(e.target.value))}
                className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-[#087F5B]"
              />
            </div>

            {/* Dates */}
            <div>
              <label className="block font-bold text-[#0D1B2A] mb-1">Data Început *</label>
              <input
                type="date"
                required
                value={formStartDate}
                onChange={e => setFormStartDate(e.target.value)}
                className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-2 focus:outline-none focus:border-[#087F5B]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0D1B2A] mb-1">Data Sfârșit (Expirare) *</label>
              <input
                type="date"
                required
                value={formEndDate}
                onChange={e => setFormEndDate(e.target.value)}
                className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-2 focus:outline-none focus:border-[#087F5B]"
              />
            </div>

            {/* Max Qty */}
            <div>
              <label className="block font-bold text-[#0D1B2A] mb-1">Limită Cantitate / Comandă (Opțional)</label>
              <input
                type="number"
                value={formMaxQty || ''}
                onChange={e => setFormMaxQty(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="fără limită"
                className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl px-3 py-2 focus:outline-none focus:border-[#087F5B]"
              />
            </div>

          </div>

          {/* Description */}
          <div className="text-xs">
            <label className="block font-bold text-[#0D1B2A] mb-1">Descriere / Condiții Comertial</label>
            <textarea
              rows={2}
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              placeholder="Descrie regulile de aplicare..."
              className="w-full bg-[#F8FAF9] border border-[#D9E2E1] rounded-xl p-3 focus:outline-none focus:border-[#087F5B]"
            />
          </div>

          {/* Target Roles */}
          <div className="text-xs space-y-1.5 border-t border-[#D9E2E1] pt-3">
            <label className="block font-bold text-[#0D1B2A]">Grup Țintă (Roluri Elegibile):</label>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'all', label: 'Toate Rolurile (Retail + Meister + B2B)' },
                { id: 'client', label: 'Numai Client Retail (PF)' },
                { id: 'meister', label: 'Numai Meșteri (Meister Club)' },
                { id: 'b2b', label: 'Numai Companii (B2B Pro)' }
              ].map(r => (
                <label key={r.id} className="flex items-center gap-1.5 cursor-pointer bg-[#F8FAF9] px-3 py-1.5 rounded-xl border border-[#D9E2E1]">
                  <input
                    type="checkbox"
                    checked={formTargetRoles.includes(r.id as any)}
                    onChange={e => {
                      if (r.id === 'all') {
                        setFormTargetRoles(['all']);
                      } else {
                        const filtered = formTargetRoles.filter(x => x !== 'all');
                        if (e.target.checked) {
                          setFormTargetRoles([...filtered, r.id as any]);
                        } else {
                          setFormTargetRoles(filtered.filter(x => x !== r.id));
                        }
                      }
                    }}
                    className="accent-[#087F5B]"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Store Scope */}
          <div className="text-xs space-y-1.5 border-t border-[#D9E2E1] pt-3">
            <label className="block font-bold text-[#0D1B2A]">Arie Magazine Elegibile:</label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="storeScope"
                  checked={formStoreScope === 'all'}
                  onChange={() => setFormStoreScope('all')}
                  className="accent-[#087F5B]"
                />
                <span>Toate magazinele CodeBau (Cahul, Cantemir, Vulcănești, Taraclia)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="storeScope"
                  checked={formStoreScope === 'specific'}
                  onChange={() => setFormStoreScope('specific')}
                  className="accent-[#087F5B]"
                />
                <span>Numai magazine selectate</span>
              </label>
            </div>

            {formStoreScope === 'specific' && (
              <div className="flex flex-wrap gap-2 pt-2">
                {MOCK_STORES.map(s => (
                  <label key={s.id} className="flex items-center gap-1.5 bg-[#F8FAF9] px-3 py-1 rounded-lg border border-[#D9E2E1] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formStores.includes(s.name)}
                      onChange={e => {
                        if (e.target.checked) {
                          setFormStores([...formStores, s.name]);
                        } else {
                          setFormStores(formStores.filter(x => x !== s.name));
                        }
                      }}
                      className="accent-[#087F5B]"
                    />
                    <span>{s.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D9E2E1]">
            <button
              type="button"
              onClick={resetForm}
              className="bg-[#E9ECEF] text-[#5C6670] hover:text-[#0D1B2A] font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              Anulează
            </button>

            <button
              type="submit"
              className="bg-[#087F5B] hover:bg-[#066B4D] text-white font-extrabold px-6 py-2 rounded-xl text-xs shadow-xs cursor-pointer"
            >
              Salvează Promoția
            </button>
          </div>
        </form>
      )}

      {/* Promos Table */}
      {activeSubTab === 'promos' && (
        <div className="bg-white rounded-2xl border border-[#D9E2E1] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAF9] border-b border-[#D9E2E1] text-[#5C6670] font-extrabold uppercase">
                  <th className="p-3.5">Denumire & Cod</th>
                  <th className="p-3.5">Tip / Valoare</th>
                  <th className="p-3.5">Perioadă Valabilitate</th>
                  <th className="p-3.5">Grup Țintă</th>
                  <th className="p-3.5">Magazine</th>
                  <th className="p-3.5">Prioritate</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2E1] text-[#0D1B2A]">
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[#5C6670]">
                      Nu există nicio promoție definită.
                    </td>
                  </tr>
                ) : (
                  promotions.map(p => (
                    <tr key={p.id} className="hover:bg-[#F8FAF9]/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-extrabold text-[#0D1B2A]">{p.name}</div>
                        {p.code && <span className="font-mono text-[10px] bg-[#E9ECEF] text-[#0D1B2A] px-1.5 py-0.5 rounded uppercase">{p.code}</span>}
                        {p.description && <p className="text-[10px] text-[#5C6670] line-clamp-1 mt-0.5">{p.description}</p>}
                      </td>

                      <td className="p-3.5 font-bold">
                        {p.type === 'percentage' && <span className="text-[#087F5B] font-black">{p.value}% Reducere</span>}
                        {p.type === 'fixed_amount' && <span className="text-[#087F5B] font-black">−{p.value} MDL / unitate</span>}
                        {p.type === 'fixed_price' && <span className="text-[#087F5B] font-black">Preț Fix {p.value} MDL</span>}
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-[11px]">
                        <div>De la: <strong>{p.startDate}</strong></div>
                        <div>Până la: <strong>{p.endDate}</strong></div>
                      </td>

                      <td className="p-3.5">
                        <span className="bg-[#DDF5EE] text-[#087F5B] font-extrabold text-[10px] px-2 py-0.5 rounded">
                          {p.targetRoles.includes('all') ? 'Toate Rolurile' : p.targetRoles.join(', ').toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3.5 text-[11px]">
                        {p.storeScope === 'all' ? 'Toate Magazinele' : p.stores?.join(', ') || 'Selectate'}
                      </td>

                      <td className="p-3.5 font-mono font-bold text-center">
                        {p.priority}
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleToggleActive(p.id, p.isActive)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer transition-colors ${
                            p.isActive ? 'bg-[#087F5B] text-white' : 'bg-[#E9ECEF] text-[#5C6670]'
                          }`}
                        >
                          {p.isActive ? 'ACTIVĂ' : 'INACTIVĂ'}
                        </button>
                      </td>

                      <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 rounded-lg bg-[#E9ECEF] hover:bg-[#D9E2E1] text-[#0D1B2A] cursor-pointer"
                          title="Editează"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                          title="Șterge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Logs SubTab */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-[#D9E2E1] p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-extrabold text-[#0D1B2A] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#087F5B]" />
            <span>Jurnal Audit & Istoric Modificări Promoții</span>
          </h3>

          <div className="space-y-2 text-xs">
            {auditLogs.length === 0 ? (
              <p className="text-[#5C6670] italic">Nu există înregistrări în jurnal.</p>
            ) : (
              auditLogs.map((log, idx) => (
                <div key={idx} className="p-3 bg-[#F8FAF9] rounded-xl border border-[#D9E2E1] flex items-center justify-between gap-4">
                  <div>
                    <span className="font-extrabold text-[#0D1B2A]">{log.action.toUpperCase()}</span>
                    {log.promotionName && <span className="ml-2 font-bold text-[#087F5B]">[{log.promotionName}]</span>}
                    <p className="text-[11px] text-[#5C6670] mt-0.5">{log.details}</p>
                  </div>
                  <div className="text-right whitespace-nowrap text-[10px] text-[#5C6670]">
                    <p className="font-mono">{new Date(log.timestamp).toLocaleString('ro-MD')}</p>
                    <p className="font-bold text-[#0D1B2A]">{log.performedBy}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
