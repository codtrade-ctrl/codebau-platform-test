import React, { useState, useEffect } from 'react';
import { CatalogProduct, ProductStatus, DataValidationStatus, InventoryStatus, ProductLevel } from '../../types/catalog';
import { MediaRepository } from '../../services/MediaRepository';
import { DocumentRepository } from '../../services/DocumentRepository';
import {
  Save, Eye, CheckCircle, AlertTriangle, ArrowLeft, Image as ImageIcon, FileText, Upload, Trash2, Plus,
  Layers, Package, DollarSign, Box, ShieldCheck, Tag, Sliders, Sparkles, Check, Globe, HelpCircle, AlertCircle
} from 'lucide-react';

interface ProductEditorWizardProps {
  product: CatalogProduct;
  allProducts: CatalogProduct[];
  onSave: (updatedProduct: CatalogProduct) => Promise<void>;
  onPublish: (productId: string) => Promise<void>;
  onPreview: (product: CatalogProduct) => void;
  onClose: () => void;
}

export const ProductEditorWizard: React.FC<ProductEditorWizardProps> = ({
  product: initialProduct,
  allProducts,
  onSave,
  onPublish,
  onPreview,
  onClose
}) => {
  const [formData, setFormData] = useState<CatalogProduct>(JSON.parse(JSON.stringify(initialProduct)));
  const [activeTab, setActiveTab] = useState<number>(1);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [uploadingDoc, setUploadingDoc] = useState<boolean>(false);

  // Auto-save draft locally on change
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setIsSaving(true);
        await onSave(formData);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastAutoSaveTime(timeStr);
      } catch (e) {
        console.error('Auto-save error:', e);
      } finally {
        setIsSaving(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [formData]);

  // Derived calculations for Price Tab
  const regPrice = formData.price.regularPrice || 0;
  const promoPrice = formData.price.promotionalPrice || 0;
  const isPromoActive = !!formData.price.promotionActive && promoPrice > 0 && promoPrice < regPrice;
  const discountAmount = isPromoActive ? regPrice - promoPrice : 0;
  const discountPercent = isPromoActive && regPrice > 0 ? Math.round((discountAmount / regPrice) * 100) : 0;

  // Translation completion calculations
  const hasNameRo = !!formData.name.ro;
  const hasNameRu = !!formData.name.ru && formData.name.ru !== formData.name.ro;
  const hasDescRo = !!formData.shortDescription.ro;
  const hasDescRu = !!formData.shortDescription.ru;
  const translationProgressRo = (hasNameRo ? 50 : 0) + (hasDescRo ? 50 : 0);
  const translationProgressRu = (hasNameRu ? 50 : 0) + (hasDescRu ? 50 : 0);

  // Validation Checklist for Tab 11
  const requiredValidation = [
    { key: 'sku', label: 'SKU definit și unic', passed: !!formData.sku },
    { key: 'nameRo', label: 'Denumire în limba română (RO)', passed: !!formData.name.ro },
    { key: 'category', label: 'Categorie selectată', passed: !!formData.categoryId },
    { key: 'unit', label: 'Unitate de vânzare setată', passed: !!formData.salesUnit },
    { key: 'price', label: 'Preț obișnuit pozitiv (> 0 MDL)', passed: regPrice > 0 },
    { key: 'mainImage', label: 'Imagine principală încărcată', passed: formData.images.some(img => img.type === 'main') || formData.images.length > 0 },
    { key: 'slug', label: 'Slug URL definit', passed: !!formData.slug }
  ];

  const recommendedValidation = [
    { key: 'nameRu', label: 'Denumire în limba rusă (RU)', passed: hasNameRu },
    { key: 'descRu', label: 'Descriere în limba rusă (RU)', passed: hasDescRu },
    { key: 'techDoc', label: 'Fișă tehnică PDF atașată', passed: formData.documents.some(d => d.type === 'technical_sheet') },
    { key: 'barcode', label: 'Cod de bare (EAN / Barcode)', passed: !!formData.barcode },
    { key: 'techSpecs', label: 'Atribute tehnice adăugate', passed: formData.technicalAttributes.length >= 2 },
    { key: 'alternatives', label: 'Alternative Economic/Standard/Premium asociate', passed: !!(formData.alternativeProductIds.economic || formData.alternativeProductIds.standard || formData.alternativeProductIds.premium) }
  ];

  const canPublish = requiredValidation.every(v => v.passed);

  // Tab titles
  const tabs = [
    { id: 1, title: '1. Identificare' },
    { id: 2, title: '2. Vânzare & Ambalaj' },
    { id: 3, title: '3. Preț & Promoție' },
    { id: 4, title: '4. Stoc' },
    { id: 5, title: '5. Imagini' },
    { id: 6, title: '6. Descrieri' },
    { id: 7, title: '7. Caracteristici' },
    { id: 8, title: '8. Documente' },
    { id: 9, title: '9. Relații Comerciale' },
    { id: 10, title: '10. SEO & Căutare' },
    { id: 11, title: '11. Verificare & Publicare' }
  ];

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const newImages = [...formData.images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isFirst = newImages.length === 0;
        const imgDetail = await MediaRepository.uploadImage(
          formData.id,
          file,
          isFirst ? 'main' : 'detail',
          { ro: formData.name.ro, ru: formData.name.ru }
        );
        newImages.push(imgDetail);
      }
      setFormData({ ...formData, images: newImages });
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // PDF Document Upload Handler
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: any = 'technical_sheet') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingDoc(true);
    try {
      const newDocs = [...formData.documents];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const docDetail = await DocumentRepository.uploadDocument(
          formData.id,
          file,
          docType,
          { ro: file.name.replace('.pdf', ''), ru: file.name.replace('.pdf', '') },
          'ro'
        );
        newDocs.push(docDetail);
      }
      setFormData({ ...formData, documents: newDocs });
    } catch (err) {
      console.error('Error uploading document:', err);
    } finally {
      setUploadingDoc(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Sticky Bar */}
      <div className="bg-white border-b border-[#D9E2E1] sticky top-0 z-20 shadow-xs px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-[#0D1B2A] line-clamp-1">
                  {formData.name.ro || 'Produs Fără Denumire'}
                </h2>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold">
                  SKU: {formData.sku || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span>Editează date PIM</span>
                {lastAutoSaveTime && (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Salvat automat la {lastAutoSaveTime}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreview(formData)}
              className="bg-slate-100 hover:bg-slate-200 text-[#0D1B2A] font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Previzualizează</span>
            </button>

            <button
              onClick={async () => {
                await onSave(formData);
                alert('Produsul a fost salvat cu succes!');
              }}
              className="bg-[#0D1B2A] hover:bg-[#1A3448] text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvează Draft</span>
            </button>

            <button
              disabled={!canPublish}
              onClick={async () => {
                await onSave({ ...formData, status: 'active', publishedAt: new Date().toISOString() });
                alert('Produsul a fost PUBLICAT cu succes în catalog!');
                onClose();
              }}
              className={`font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all ${
                canPublish ? 'bg-[#00A878] hover:bg-[#008f66] text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Publică în Magazin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-2 border-b border-[#D9E2E1] mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#0D1B2A] text-white shadow-xs'
                  : 'bg-white border border-[#D9E2E1] text-slate-600 hover:text-[#0D1B2A] hover:border-[#00A878]'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* TAB CONTENT AREAS */}
        <div className="bg-white border border-[#D9E2E1] rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* TAB 1: IDENTIFICARE */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0D1B2A]">1. Identificare Produs</h3>
                <p className="text-xs text-slate-500">Informații de bază, coduri unice, clasificare și nivel de calitate.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Denumire Română (RO) *</label>
                  <input
                    type="text"
                    value={formData.name.ro}
                    onChange={(e) => {
                      const newRo = e.target.value;
                      const slug = newRo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setFormData({
                        ...formData,
                        name: { ...formData.name, ro: newRo },
                        slug: formData.slug || slug
                      });
                    }}
                    placeholder="Ex: Adeziv Flexibil Ceresit CM 17..."
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Denumire Rusă (RU)</label>
                  <input
                    type="text"
                    value={formData.name.ru}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ru: e.target.value } })}
                    placeholder="Ex: Эластичный клей Ceresit CM 17..."
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">SKU (Cod Produs Unic) *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Ex: CER-CM17-25"
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Cod de Bare (EAN / Barcode)</label>
                  <input
                    type="text"
                    value={formData.barcode || ''}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="Ex: 5900000000000"
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value, brandId: e.target.value.toLowerCase() })}
                    placeholder="Ex: Ceresit, Knauf, Caparol..."
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Categorie Principală *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setFormData({
                        ...formData,
                        categoryId: cat,
                        categoryName: { ro: cat, ru: cat }
                      });
                    }}
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  >
                    <option value="adezivi">Adezivi și Chituril</option>
                    <option value="grunduri">Grunduri și Amorse</option>
                    <option value="vopsele">Vopsele și Tencuieli</option>
                    <option value="termoizolatie">Termoizolații și Sistem Fațadă</option>
                    <option value="scule">Scule și Unelte Profesionale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">URL Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Nivel Calitativ (Budget Tier)</label>
                  <select
                    value={formData.level || 'standard'}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as ProductLevel })}
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  >
                    <option value="economic">Economic (Gama Accesibilă)</option>
                    <option value="standard">Standard (Gama Profesională)</option>
                    <option value="premium">Premium (Gama Superioră / Master)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Statut Curent</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  >
                    <option value="draft">Draft (Ciornă - nepublicat)</option>
                    <option value="review">În Verificare</option>
                    <option value="active">Active (Publicat în Magazin)</option>
                    <option value="inactive">Inactiv (Oprit de la vânzare)</option>
                    <option value="demo">Demo Dataset</option>
                    <option value="archived">Arhivat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Validare Date</label>
                  <select
                    value={formData.dataValidationStatus}
                    onChange={(e) => setFormData({ ...formData, dataValidationStatus: e.target.value as DataValidationStatus })}
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  >
                    <option value="draft">În lucru (Draft)</option>
                    <option value="validated">Validat de PIM Specialist</option>
                    <option value="demo">Date Demonstrative</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VÂNZARE & AMBALAJ */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0D1B2A]">2. Vânzare și Ambalare</h3>
                <p className="text-xs text-slate-500">Unitate de măsură, dimensiuni de ambalaj și caracteristici logistice.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Unitate de Vânzare (salesUnit)</label>
                  <select
                    value={formData.salesUnit}
                    onChange={(e) => setFormData({ ...formData, salesUnit: e.target.value })}
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  >
                    <option value="bag">Sac (bag)</option>
                    <option value="can">Bidon / Ciupercă (can)</option>
                    <option value="bucket">Găleată (bucket)</option>
                    <option value="box">Pachet / Cutie (box)</option>
                    <option value="piece">Bucată (piece)</option>
                    <option value="roll">Rolă (roll)</option>
                    <option value="sqm">Metru Pătrat (m²)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Etichetă Afișată RO</label>
                  <input
                    type="text"
                    value={formData.salesUnitDisplay?.ro || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      salesUnitDisplay: { ro: e.target.value, ru: formData.salesUnitDisplay?.ru || '' }
                    })}
                    placeholder="Ex: sac 25kg, bidon 10L, pachet 500 buc"
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Etichetă Afișată RU</label>
                  <input
                    type="text"
                    value={formData.salesUnitDisplay?.ru || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      salesUnitDisplay: { ro: formData.salesUnitDisplay?.ro || '', ru: e.target.value }
                    })}
                    placeholder="Ex: мешок 25кг, канистра 10л"
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Greutate Ambalaj (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.packageWeightKg || ''}
                    onChange={(e) => setFormData({ ...formData, packageWeightKg: parseFloat(e.target.value) || undefined })}
                    placeholder="Ex: 25"
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Consum per m² (calculator)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.consumptionPerSqM || ''}
                    onChange={(e) => setFormData({ ...formData, consumptionPerSqM: parseFloat(e.target.value) || undefined })}
                    placeholder="Ex: 4.5"
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Unitate Consum</label>
                  <input
                    type="text"
                    value={formData.consumptionUnit || 'kg/m²'}
                    onChange={(e) => setFormData({ ...formData, consumptionUnit: e.target.value })}
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Logistics Checkboxes */}
              <div className="bg-[#F8FAF9] border border-[#D9E2E1] p-4 rounded-2xl space-y-3">
                <div className="text-xs font-black text-[#0D1B2A] uppercase">Specificații de Livrare & Ambalaj Paletat</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.logistics.heavyProduct}
                      onChange={(e) => setFormData({ ...formData, logistics: { ...formData.logistics, heavyProduct: e.target.checked } })}
                      className="rounded text-[#00A878]"
                    />
                    <span>Produs Greu (&gt; 20kg)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.logistics.lockerEligible}
                      onChange={(e) => setFormData({ ...formData, logistics: { ...formData.logistics, lockerEligible: e.target.checked } })}
                      className="rounded text-[#00A878]"
                    />
                    <span>Eligibil Locker 24/7</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.logistics.craneDeliveryRecommended}
                      onChange={(e) => setFormData({ ...formData, logistics: { ...formData.logistics, craneDeliveryRecommended: e.target.checked } })}
                      className="rounded text-[#00A878]"
                    />
                    <span>Recomandat Livrare cu Macara</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.logistics.bulkyProduct}
                      onChange={(e) => setFormData({ ...formData, logistics: { ...formData.logistics, bulkyProduct: e.target.checked } })}
                      className="rounded text-[#00A878]"
                    />
                    <span>Produs Voluminos</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PREȚ & PROMOȚIE */}
          {activeTab === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0D1B2A]">3. Preț și Promoții Centralizate</h3>
                <p className="text-xs text-slate-500">Toate prețurile sunt exprimate în MDL cu TVA inclus.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Preț Obișnuit (MDL) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.price.regularPrice || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      price: { ...formData.price, regularPrice: parseFloat(e.target.value) || 0 }
                    })}
                    placeholder="Ex: 74.90"
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Preț Meșter Club (MDL Pro)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.price.pricePro || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      price: { ...formData.price, pricePro: parseFloat(e.target.value) || undefined }
                    })}
                    placeholder="Ex: 69.50"
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Cotă TVA (%)</label>
                  <input
                    type="number"
                    value={formData.price.vatRate * 100}
                    onChange={(e) => setFormData({
                      ...formData,
                      price: { ...formData.price, vatRate: (parseFloat(e.target.value) || 20) / 100 }
                    })}
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Promo Section */}
              <div className="bg-amber-50/50 border border-amber-200 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-black text-[#0D1B2A] uppercase">Configurare Promoție Activă</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={!!formData.price.promotionActive}
                      onChange={(e) => setFormData({
                        ...formData,
                        price: { ...formData.price, promotionActive: e.target.checked }
                      })}
                      className="rounded text-amber-600"
                    />
                    <span>Activează Promoție</span>
                  </label>
                </div>

                {formData.price.promotionActive && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Preț Promoțional (MDL)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.price.promotionalPrice || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          price: { ...formData.price, promotionalPrice: parseFloat(e.target.value) || undefined }
                        })}
                        placeholder="Ex: 69.90"
                        className="w-full bg-white border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Data Început Promoție</label>
                      <input
                        type="date"
                        value={formData.price.promotionStart || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          price: { ...formData.price, promotionStart: e.target.value }
                        })}
                        className="w-full bg-white border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Data Sfârșit Promoție</label>
                      <input
                        type="date"
                        value={formData.price.promotionEnd || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          price: { ...formData.price, promotionEnd: e.target.value }
                        })}
                        className="w-full bg-white border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold p-3 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Calculated Preview Box */}
                <div className="bg-white border border-amber-200 p-3 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500">Preț Calculat Magazin: </span>
                    <span className="font-extrabold text-[#0D1B2A]">
                      {isPromoActive ? `${promoPrice.toFixed(2)} MDL` : `${regPrice.toFixed(2)} MDL`}
                    </span>
                  </div>
                  {isPromoActive && (
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                        Reducere: {discountPercent}%
                      </span>
                      <span className="text-emerald-700 font-extrabold">
                        Economie: {discountAmount.toFixed(2)} MDL/unitate
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STOC */}
          {activeTab === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0D1B2A]">4. Gestionare Stoc pe Magazine Sud Moldova</h3>
                <p className="text-xs text-slate-500">Setați stocul fizic și rezervat pentru fiecare magazin teritorial.</p>
              </div>

              <div className="space-y-4">
                {formData.inventory.map((inv, idx) => {
                  const available = Math.max(0, (inv.physicalStock || 0) - (inv.reservedStock || 0));

                  return (
                    <div key={inv.storeId} className="bg-[#F8FAF9] border border-[#D9E2E1] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="w-full md:w-1/4">
                        <div className="font-extrabold text-xs text-[#0D1B2A]">{inv.storeName}</div>
                        <span className="text-[10px] font-mono text-slate-400">ID: {inv.storeId}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 w-full md:w-1/2">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase">Stoc Fizic</label>
                          <input
                            type="number"
                            value={inv.physicalStock}
                            onChange={(e) => {
                              const newInv = [...formData.inventory];
                              newInv[idx].physicalStock = parseInt(e.target.value) || 0;
                              newInv[idx].availableOnline = Math.max(0, newInv[idx].physicalStock - newInv[idx].reservedStock);
                              setFormData({ ...formData, inventory: newInv });
                            }}
                            className="w-full bg-white border border-[#D9E2E1] text-xs font-bold p-2 rounded-xl outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase">Rezervat</label>
                          <input
                            type="number"
                            value={inv.reservedStock}
                            onChange={(e) => {
                              const newInv = [...formData.inventory];
                              newInv[idx].reservedStock = parseInt(e.target.value) || 0;
                              newInv[idx].availableOnline = Math.max(0, newInv[idx].physicalStock - newInv[idx].reservedStock);
                              setFormData({ ...formData, inventory: newInv });
                            }}
                            className="w-full bg-white border border-[#D9E2E1] text-xs font-bold p-2 rounded-xl outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase">Disponibil</label>
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black p-2 rounded-xl text-center">
                            {available} buc
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="bg-sky-100 text-sky-800 text-[10px] font-black uppercase px-2 py-1 rounded-md">
                          Stoc Test
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: IMAGINI */}
          {activeTab === 5 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0D1B2A]">5. Galerie Imagini Produs</h3>
                  <p className="text-xs text-slate-500">Prima imagine marcată ca "Main" este afișată ca imagine de copertă.</p>
                </div>

                <label className="bg-[#00A878] hover:bg-[#008f66] text-white text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>Încarcă Imagini</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Upload Drag Drop Area */}
              <div className="border-2 border-dashed border-[#D9E2E1] hover:border-[#00A878] bg-[#F8FAF9] p-8 rounded-2xl text-center space-y-2">
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-[#0D1B2A]">Trage imaginile aici sau apasă butonul de încărcare</div>
                <p className="text-[11px] text-slate-400">Recomandat: minimum 1200x1200px, fundal alb sau curat, format WebP / JPEG / PNG</p>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={img.id} className="bg-white border border-[#D9E2E1] rounded-2xl p-3 relative space-y-2 shadow-xs group">
                    <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative">
                      <img src={img.url} alt={img.alt.ro} className="w-full h-full object-cover" />
                      {img.type === 'main' && (
                        <span className="absolute top-2 left-2 bg-[#00A878] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                          Copertă (Main)
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <select
                        value={img.type}
                        onChange={(e) => {
                          const newType = e.target.value as any;
                          const newImages = formData.images.map(i => {
                            if (i.id === img.id) return { ...i, type: newType };
                            if (newType === 'main' && i.type === 'main') return { ...i, type: 'detail' as any };
                            return i;
                          });
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="w-full bg-[#F8FAF9] border border-[#D9E2E1] text-[10px] font-bold p-1.5 rounded-lg outline-none"
                      >
                        <option value="main">Copertă (Main)</option>
                        <option value="front">Ambalaj Frontal</option>
                        <option value="back">Ambalaj Spate</option>
                        <option value="label">Etichetă Date</option>
                        <option value="detail">Detaliu Material</option>
                        <option value="application">Mod de Aplicare</option>
                        <option value="result">Rezultat Final</option>
                      </select>

                      <button
                        onClick={() => {
                          const newImages = formData.images.filter(i => i.id !== img.id);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="w-full text-rose-600 hover:bg-rose-50 p-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Șterge Imaginea</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DESCRIERI */}
          {activeTab === 6 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0D1B2A]">6. Descrieri și Texte Comerciale (RO / RU)</h3>
                  <p className="text-xs text-slate-500">Setați descrierea scurtă, avantajele cheie și domeniile de aplicare.</p>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-1">
                    <span>RO:</span>
                    <span className="text-emerald-700 font-extrabold">{translationProgressRo}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>RU:</span>
                    <span className="text-indigo-600 font-extrabold">{translationProgressRu}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* RO Column */}
                <div className="space-y-4 bg-[#F8FAF9] p-4 rounded-2xl border border-[#D9E2E1]">
                  <div className="font-black text-xs text-[#0D1B2A] uppercase flex items-center gap-1.5">
                    <span>🇷🇴 Versiune Limba Română (RO)</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Descriere Scurtă</label>
                    <textarea
                      rows={3}
                      value={formData.shortDescription.ro}
                      onChange={(e) => setFormData({
                        ...formData,
                        shortDescription: { ...formData.shortDescription, ro: e.target.value }
                      })}
                      className="w-full bg-white border border-[#D9E2E1] text-xs font-medium p-3 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Descriere Detaliată / Tehnică</label>
                    <textarea
                      rows={6}
                      value={formData.fullDescription.ro}
                      onChange={(e) => setFormData({
                        ...formData,
                        fullDescription: { ...formData.fullDescription, ro: e.target.value }
                      })}
                      className="w-full bg-white border border-[#D9E2E1] text-xs font-medium p-3 rounded-xl outline-none"
                    />
                  </div>
                </div>

                {/* RU Column */}
                <div className="space-y-4 bg-[#F8FAF9] p-4 rounded-2xl border border-[#D9E2E1]">
                  <div className="font-black text-xs text-[#0D1B2A] uppercase flex items-center gap-1.5">
                    <span>🇲🇩/🇷🇺 Versiune Limba Rusă (RU)</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Краткое Описание</label>
                    <textarea
                      rows={3}
                      value={formData.shortDescription.ru}
                      onChange={(e) => setFormData({
                        ...formData,
                        shortDescription: { ...formData.shortDescription, ru: e.target.value }
                      })}
                      className="w-full bg-white border border-[#D9E2E1] text-xs font-medium p-3 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Полное Описание</label>
                    <textarea
                      rows={6}
                      value={formData.fullDescription.ru}
                      onChange={(e) => setFormData({
                        ...formData,
                        fullDescription: { ...formData.fullDescription, ru: e.target.value }
                      })}
                      className="w-full bg-white border border-[#D9E2E1] text-xs font-medium p-3 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CARACTERISTICI TEHNICE */}
          {activeTab === 7 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0D1B2A]">7. Caracteristici Tehnice Dinamice</h3>
                  <p className="text-xs text-slate-500">Atribute tehnice relevante pentru căutare, comparare și calculator.</p>
                </div>

                <button
                  onClick={() => {
                    const newAttr = {
                      code: `attr_${Date.now()}`,
                      label: { ro: 'Proprietate Nouă', ru: 'Новое свойство' },
                      value: 'Valoare'
                    };
                    setFormData({
                      ...formData,
                      technicalAttributes: [...formData.technicalAttributes, newAttr]
                    });
                  }}
                  className="bg-[#0D1B2A] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adaugă Atribut</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.technicalAttributes.map((attr, idx) => (
                  <div key={idx} className="bg-[#F8FAF9] border border-[#D9E2E1] p-3 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Nume Caracteristică (RO)</label>
                      <input
                        type="text"
                        value={attr.label.ro}
                        onChange={(e) => {
                          const newAttrs = [...formData.technicalAttributes];
                          newAttrs[idx].label.ro = e.target.value;
                          setFormData({ ...formData, technicalAttributes: newAttrs });
                        }}
                        className="w-full bg-white border border-[#D9E2E1] text-xs font-bold p-2 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Valoare Specificație</label>
                      <input
                        type="text"
                        value={String(attr.value)}
                        onChange={(e) => {
                          const newAttrs = [...formData.technicalAttributes];
                          newAttrs[idx].value = e.target.value;
                          setFormData({ ...formData, technicalAttributes: newAttrs });
                        }}
                        className="w-full bg-white border border-[#D9E2E1] text-xs font-bold p-2 rounded-xl outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Unitate (opțional)</label>
                        <input
                          type="text"
                          value={attr.unit || ''}
                          onChange={(e) => {
                            const newAttrs = [...formData.technicalAttributes];
                            newAttrs[idx].unit = e.target.value;
                            setFormData({ ...formData, technicalAttributes: newAttrs });
                          }}
                          placeholder="Ex: kg/m², min, mm"
                          className="w-full bg-white border border-[#D9E2E1] text-xs font-bold p-2 rounded-xl outline-none"
                        />
                      </div>

                      <button
                        onClick={() => {
                          const newAttrs = formData.technicalAttributes.filter((_, i) => i !== idx);
                          setFormData({ ...formData, technicalAttributes: newAttrs });
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer mt-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: DOCUMENTE PDF */}
          {activeTab === 8 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0D1B2A]">8. Documente Tehnice PDF</h3>
                  <p className="text-xs text-slate-500">Fișe tehnice, fișe de securitate (MSDS) și declarații de performanță (DoP).</p>
                </div>

                <label className="bg-[#00A878] hover:bg-[#008f66] text-white text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>Atașează PDF</span>
                  <input type="file" accept="application/pdf" onChange={(e) => handleDocUpload(e, 'technical_sheet')} className="hidden" />
                </label>
              </div>

              <div className="space-y-3">
                {formData.documents.map((doc, idx) => (
                  <div key={doc.id} className="bg-[#F8FAF9] border border-[#D9E2E1] p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xs">
                        PDF
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#0D1B2A]">{doc.title.ro}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{doc.fileName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                        Validat
                      </span>
                      <button
                        onClick={() => {
                          const newDocs = formData.documents.filter(d => d.id !== doc.id);
                          setFormData({ ...formData, documents: newDocs });
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: RELAȚII COMERCIALE */}
          {activeTab === 9 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0D1B2A]">9. Relații Comerciale (Alternative & Complementare)</h3>
                <p className="text-xs text-slate-500">Configurare cross-selling, pachete și alternative pe niveluri bugetare.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Alternativă Economic</label>
                  <select
                    value={formData.alternativeProductIds.economic || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      alternativeProductIds: { ...formData.alternativeProductIds, economic: e.target.value || undefined }
                    })}
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] text-xs font-bold p-3 rounded-xl outline-none"
                  >
                    <option value="">Fără alternativă economică</option>
                    {allProducts.filter(p => p.id !== formData.id).map(p => (
                      <option key={p.id} value={p.id}>{p.name.ro} ({p.sku})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Alternativă Standard</label>
                  <select
                    value={formData.alternativeProductIds.standard || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      alternativeProductIds: { ...formData.alternativeProductIds, standard: e.target.value || undefined }
                    })}
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] text-xs font-bold p-3 rounded-xl outline-none"
                  >
                    <option value="">Fără alternativă standard</option>
                    {allProducts.filter(p => p.id !== formData.id).map(p => (
                      <option key={p.id} value={p.id}>{p.name.ro} ({p.sku})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Alternativă Premium</label>
                  <select
                    value={formData.alternativeProductIds.premium || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      alternativeProductIds: { ...formData.alternativeProductIds, premium: e.target.value || undefined }
                    })}
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] text-xs font-bold p-3 rounded-xl outline-none"
                  >
                    <option value="">Fără alternativă premium</option>
                    {allProducts.filter(p => p.id !== formData.id).map(p => (
                      <option key={p.id} value={p.id}>{p.name.ro} ({p.sku})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SEO & CĂUTARE */}
          {activeTab === 10 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0D1B2A]">10. Optimizare Căutare și SEO Dual RO/RU</h3>
                <p className="text-xs text-slate-500">Termeni de căutare suplimentari pentru regăsire instantă în motorul de căutare.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Termeni de Căutare RO (separați prin virgulă)</label>
                  <input
                    type="text"
                    value={formData.searchTerms.ro.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      searchTerms: { ...formData.searchTerms, ro: e.target.value.split(',').map(s => s.trim()) }
                    })}
                    placeholder="Ex: adeziv, clei, gresie, Ceresit, CM17"
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">Termeni de Căutare RU (separați prin virgulă)</label>
                  <input
                    type="text"
                    value={formData.searchTerms.ru.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      searchTerms: { ...formData.searchTerms, ru: e.target.value.split(',').map(s => s.trim()) }
                    })}
                    placeholder="Ex: клей, плиточный клей, Церезит, CM17"
                    className="w-full bg-[#F8FAF9] border border-[#D9E2E1] text-xs font-bold p-3 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: VERIFICARE & PUBLICARE */}
          {activeTab === 11 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0D1B2A]">11. Raport de Validare & Publicare</h3>
                <p className="text-xs text-slate-500">Checklist automat înainte de lansarea produsului pe site-ul public.</p>
              </div>

              {/* Validation Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50/50 border border-emerald-200 p-5 rounded-2xl space-y-3">
                  <div className="font-extrabold text-xs text-emerald-800 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verificări Obligatorii (Mandatory)</span>
                  </div>

                  <div className="space-y-2">
                    {requiredValidation.map((item) => (
                      <div key={item.key} className="flex items-center justify-between text-xs font-bold py-1 border-b border-emerald-100/60">
                        <span className={item.passed ? 'text-slate-800' : 'text-rose-700'}>{item.label}</span>
                        {item.passed ? (
                          <span className="text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> Valid</span>
                        ) : (
                          <span className="text-rose-600 font-black">Incomplet</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50/50 border border-amber-200 p-5 rounded-2xl space-y-3">
                  <div className="font-extrabold text-xs text-amber-800 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Recomandări PIM (Recommended)</span>
                  </div>

                  <div className="space-y-2">
                    {recommendedValidation.map((item) => (
                      <div key={item.key} className="flex items-center justify-between text-xs font-bold py-1 border-b border-amber-100/60">
                        <span className={item.passed ? 'text-slate-800' : 'text-slate-500'}>{item.label}</span>
                        {item.passed ? (
                          <span className="text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> OK</span>
                        ) : (
                          <span className="text-amber-600 font-extrabold">Recomandat</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Publish Action Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-[#0D1B2A]">Stare Publicare Catalog</div>
                  <p className="text-[11px] text-slate-500">
                    {canPublish
                      ? 'Produsul îndeplinește toate condițiile obligatorii și este gata de lansare.'
                      : 'Completați câmpurile obligatorii din checklist înainte de publicare.'}
                  </p>
                </div>

                <button
                  disabled={!canPublish}
                  onClick={async () => {
                    await onSave({ ...formData, status: 'active', publishedAt: new Date().toISOString() });
                    alert('Produsul a fost PUBLICAT cu succes în catalog!');
                    onClose();
                  }}
                  className={`font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all ${
                    canPublish
                      ? 'bg-[#00A878] hover:bg-[#008f66] text-white active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Aprobă & Publică în Magazin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
