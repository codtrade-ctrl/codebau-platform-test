import React, { useState } from 'react';
import { CatalogProduct, ProductStatus } from '../../types/catalog';
import { ProductFilterParams } from '../../services/ProductRepository';
import { Search, Filter, Edit3, Eye, Copy, CheckCircle, XCircle, Trash2, Archive, AlertTriangle, Layers, Image as ImageIcon, Globe, DollarSign, Box, Check, RefreshCw, FileText } from 'lucide-react';

interface ProductListTableProps {
  products: CatalogProduct[];
  filterParams: ProductFilterParams;
  onFilterChange: (params: ProductFilterParams) => void;
  onEdit: (product: CatalogProduct) => void;
  onPreview: (product: CatalogProduct) => void;
  onDuplicate: (productId: string) => void;
  onPublish: (productId: string) => void;
  onUnpublish: (productId: string) => void;
  onArchive: (productId: string) => void;
  onDeleteDraft: (productId: string) => void;
  onExportProductJSON: (product: CatalogProduct) => void;
}

export const ProductListTable: React.FC<ProductListTableProps> = ({
  products,
  filterParams,
  onFilterChange,
  onEdit,
  onPreview,
  onDuplicate,
  onPublish,
  onUnpublish,
  onArchive,
  onDeleteDraft,
  onExportProductJSON
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Calculate Summary KPI Stats
  const totalCount = products.length;
  const activeCount = products.filter(p => p.status === 'active').length;
  const draftCount = products.filter(p => p.status === 'draft').length;
  const demoCount = products.filter(p => p.status === 'demo').length;
  const missingImagesCount = products.filter(p => !p.images || p.images.length === 0).length;
  const incompleteRuCount = products.filter(p => !p.name.ru || p.name.ru === p.name.ro || !p.shortDescription.ru).length;
  const unvalidatedCount = products.filter(p => p.dataValidationStatus !== 'validated').length;

  const categories = Array.from(new Set(products.map(p => p.categoryId)));
  const brands = Array.from(new Set(products.map(p => p.brandName)));

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case 'active':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-max"><Check className="w-3 h-3" /> Publicat</span>;
      case 'draft':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-max"><Edit3 className="w-3 h-3" /> Ciornă (Draft)</span>;
      case 'demo':
        return <span className="bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-max"><Layers className="w-3 h-3" /> Date Demo</span>;
      case 'inactive':
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-max"><XCircle className="w-3 h-3" /> Inactiv</span>;
      case 'review':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3" /> În Verificare</span>;
      case 'archived':
        return <span className="bg-gray-100 text-gray-600 border border-gray-300 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-max"><Archive className="w-3 h-3" /> Arhivat</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white border border-[#D9E2E1] p-3 rounded-2xl shadow-xs">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Produse</div>
          <div className="text-xl font-black text-[#0D1B2A] mt-0.5">{totalCount}</div>
        </div>
        <div className="bg-white border border-emerald-200 bg-emerald-50/30 p-3 rounded-2xl shadow-xs">
          <div className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">Active (Publicate)</div>
          <div className="text-xl font-black text-emerald-700 mt-0.5">{activeCount}</div>
        </div>
        <div className="bg-white border border-amber-200 bg-amber-50/30 p-3 rounded-2xl shadow-xs">
          <div className="text-[11px] font-black text-amber-600 uppercase tracking-wider">Drafts (Ciorne)</div>
          <div className="text-xl font-black text-amber-700 mt-0.5">{draftCount}</div>
        </div>
        <div className="bg-white border border-sky-200 bg-sky-50/30 p-3 rounded-2xl shadow-xs">
          <div className="text-[11px] font-black text-sky-600 uppercase tracking-wider">Demo Datasets</div>
          <div className="text-xl font-black text-sky-700 mt-0.5">{demoCount}</div>
        </div>
        <div className="bg-white border border-[#D9E2E1] p-3 rounded-2xl shadow-xs">
          <div className="text-[11px] font-black text-rose-500 uppercase tracking-wider">Fără Imagini</div>
          <div className="text-xl font-black text-rose-600 mt-0.5">{missingImagesCount}</div>
        </div>
        <div className="bg-white border border-[#D9E2E1] p-3 rounded-2xl shadow-xs">
          <div className="text-[11px] font-black text-indigo-500 uppercase tracking-wider">Incomplete (RU)</div>
          <div className="text-xl font-black text-indigo-600 mt-0.5">{incompleteRuCount}</div>
        </div>
        <div className="bg-white border border-[#D9E2E1] p-3 rounded-2xl shadow-xs">
          <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Nevalidate</div>
          <div className="text-xl font-black text-slate-700 mt-0.5">{unvalidatedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D9E2E1] p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Căutare după denumire, SKU, cod de bare, brand sau slug..."
              value={filterParams.searchQuery || ''}
              onChange={(e) => onFilterChange({ ...filterParams, searchQuery: e.target.value })}
              className="w-full bg-[#F8FAF9] border border-[#D9E2E1] focus:border-[#00A878] text-xs font-bold pl-9 pr-4 py-2.5 rounded-xl outline-none transition-all"
            />
          </div>

          {/* Quick Select Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs font-bold">
            <select
              value={filterParams.status || 'all'}
              onChange={(e) => onFilterChange({ ...filterParams, status: e.target.value })}
              className="bg-[#F8FAF9] border border-[#D9E2E1] px-3 py-2 rounded-xl outline-none"
            >
              <option value="all">Toate Statuturile</option>
              <option value="active">Active (Publicate)</option>
              <option value="draft">Draft (Ciornă)</option>
              <option value="demo">Demo Datasets</option>
              <option value="review">În Verificare</option>
              <option value="inactive">Inactiv</option>
              <option value="archived">Arhivat</option>
            </select>

            <select
              value={filterParams.categoryId || 'all'}
              onChange={(e) => onFilterChange({ ...filterParams, categoryId: e.target.value })}
              className="bg-[#F8FAF9] border border-[#D9E2E1] px-3 py-2 rounded-xl outline-none"
            >
              <option value="all">Toate Categoriile</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filterParams.brandName || 'all'}
              onChange={(e) => onFilterChange({ ...filterParams, brandName: e.target.value })}
              className="bg-[#F8FAF9] border border-[#D9E2E1] px-3 py-2 rounded-xl outline-none"
            >
              <option value="all">Toate Brandurile</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select
              value={filterParams.level || 'all'}
              onChange={(e) => onFilterChange({ ...filterParams, level: e.target.value })}
              className="bg-[#F8FAF9] border border-[#D9E2E1] px-3 py-2 rounded-xl outline-none"
            >
              <option value="all">Toate Nivelurile</option>
              <option value="economic">Economic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>

            {/* Toggle View Mode */}
            <div className="flex items-center bg-[#F8FAF9] border border-[#D9E2E1] p-1 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${viewMode === 'table' ? 'bg-[#0D1B2A] text-white' : 'text-slate-600'}`}
              >
                Tabel
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${viewMode === 'grid' ? 'bg-[#0D1B2A] text-white' : 'text-slate-600'}`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Quick Audit Checkboxes */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-600">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={!!filterParams.missingImages}
              onChange={(e) => onFilterChange({ ...filterParams, missingImages: e.target.checked })}
              className="rounded text-[#00A878] focus:ring-0"
            />
            <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3 text-rose-500" /> Fără imagini</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={!!filterParams.missingRuTranslation}
              onChange={(e) => onFilterChange({ ...filterParams, missingRuTranslation: e.target.checked })}
              className="rounded text-[#00A878] focus:ring-0"
            />
            <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-indigo-500" /> Traducere RU lipsă</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={!!filterParams.missingPrice}
              onChange={(e) => onFilterChange({ ...filterParams, missingPrice: e.target.checked })}
              className="rounded text-[#00A878] focus:ring-0"
            />
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-amber-500" /> Fără preț valid</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={!!filterParams.missingStock}
              onChange={(e) => onFilterChange({ ...filterParams, missingStock: e.target.checked })}
              className="rounded text-[#00A878] focus:ring-0"
            />
            <span className="flex items-center gap-1"><Box className="w-3 h-3 text-slate-500" /> Stoc 0</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={!!filterParams.missingDocs}
              onChange={(e) => onFilterChange({ ...filterParams, missingDocs: e.target.checked })}
              className="rounded text-[#00A878] focus:ring-0"
            />
            <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-teal-500" /> Fără documente PDF</span>
          </label>
        </div>
      </div>

      {/* Main Content Area: Table / Grid */}
      {products.length === 0 ? (
        <div className="bg-white border border-[#D9E2E1] rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#0D1B2A]">Niciun produs găsit</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Nu au fost găsite produse care să se potrivească filtrelor selectate. Încearcă să resetezi filtrele sau să creezi un produs nou pilot.
          </p>
          <button
            onClick={() => onFilterChange({})}
            className="bg-[#0D1B2A] text-white text-xs font-extrabold px-4 py-2 rounded-xl"
          >
            Resetează Filtrele
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white border border-[#D9E2E1] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D1B2A] text-slate-300 font-extrabold text-[11px] uppercase tracking-wider border-b border-[#1A3448]">
                <tr>
                  <th className="py-3 px-4">Imagine</th>
                  <th className="py-3 px-4">Denumire & Slug</th>
                  <th className="py-3 px-4">SKU / Cod Bare</th>
                  <th className="py-3 px-4">Brand & Nivel</th>
                  <th className="py-3 px-4">Preț & Promo</th>
                  <th className="py-3 px-4">Stoc Total</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2E1] font-medium text-[#0D1B2A]">
                {products.map((prod) => {
                  const mainImage = prod.images.find(img => img.type === 'main')?.url || prod.images[0]?.url;
                  const totalStock = prod.inventory.reduce((sum, i) => sum + (i.physicalStock || 0), 0);

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-[#D9E2E1] overflow-hidden relative flex items-center justify-center shrink-0">
                          {mainImage ? (
                            <img src={mainImage} alt={prod.name.ro} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                      </td>

                      {/* Name & Slug */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-extrabold text-xs text-[#0D1B2A] line-clamp-2">{prod.name.ro}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 font-bold truncate">/{prod.slug}</div>
                        {!prod.name.ru || prod.name.ru === prod.name.ro ? (
                          <span className="text-[9px] text-rose-500 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 mt-1 inline-block">
                            RU necompletat
                          </span>
                        ) : null}
                      </td>

                      {/* SKU & Barcode */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="font-extrabold text-slate-800">{prod.sku}</div>
                        <div className="text-slate-400 text-[10px]">{prod.barcode || 'Fără cod de bare'}</div>
                      </td>

                      {/* Brand & Quality Level */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold">{prod.brandName}</div>
                        <div className="mt-0.5">
                          {prod.level === 'economic' && <span className="bg-slate-100 text-slate-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border">Economic</span>}
                          {prod.level === 'standard' && <span className="bg-sky-100 text-sky-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-sky-300">Standard</span>}
                          {prod.level === 'premium' && <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-300">Premium</span>}
                        </div>
                      </td>

                      {/* Price & Promo */}
                      <td className="py-3 px-4">
                        {prod.price.promotionalPrice && prod.price.promotionActive ? (
                          <div>
                            <span className="font-black text-rose-600 text-xs">{prod.price.promotionalPrice.toFixed(2)} MDL</span>
                            <div className="text-[10px] text-slate-400 line-through">{prod.price.regularPrice.toFixed(2)} MDL</div>
                          </div>
                        ) : (
                          <span className="font-black text-xs text-[#0D1B2A]">{prod.price.regularPrice ? `${prod.price.regularPrice.toFixed(2)} MDL` : 'Fără preț'}</span>
                        )}
                        <div className="text-[10px] text-slate-500">/{prod.salesUnitDisplay?.ro || prod.salesUnit}</div>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4 font-bold">
                        <div className={`text-xs ${totalStock > 0 ? 'text-emerald-700' : 'text-rose-600 font-extrabold'}`}>
                          {totalStock} buc
                        </div>
                        <div className="text-[9px] text-slate-400 flex gap-1 font-mono">
                          <span>Cahul: {prod.inventory.find(i => i.storeId === 'cahul')?.physicalStock || 0}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {getStatusBadge(prod.status)}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPreview(prod)}
                            title="Previzualizează în magazin"
                            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-[#0D1B2A] transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(prod)}
                            title="Editează produsul"
                            className="p-1.5 bg-slate-100 hover:bg-[#00A878] hover:text-white rounded-lg text-[#0D1B2A] font-extrabold transition-all cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDuplicate(prod.id)}
                            title="Duplică produsul"
                            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {prod.status === 'active' ? (
                            <button
                              onClick={() => onUnpublish(prod.id)}
                              title="Dezactivează din magazin"
                              className="px-2 py-1 text-[10px] font-black bg-slate-200 hover:bg-amber-200 text-slate-800 rounded-lg cursor-pointer"
                            >
                              Dezactivează
                            </button>
                          ) : (
                            <button
                              onClick={() => onPublish(prod.id)}
                              title="Publică în magazin"
                              className="px-2 py-1 text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs cursor-pointer"
                            >
                              Publică
                            </button>
                          )}

                          {prod.status === 'draft' && (
                            <button
                              onClick={() => onDeleteDraft(prod.id)}
                              title="Șterge ciorna"
                              className="p-1.5 hover:bg-rose-100 text-rose-500 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((prod) => {
            const mainImage = prod.images.find(img => img.type === 'main')?.url || prod.images[0]?.url;

            return (
              <div key={prod.id} className="bg-white border border-[#D9E2E1] rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 relative overflow-hidden">
                <div className="space-y-2">
                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                    {mainImage ? (
                      <img src={mainImage} alt={prod.name.ro} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(prod.status)}
                    </div>
                  </div>

                  <div className="text-xs font-black text-[#0D1B2A] line-clamp-2">{prod.name.ro}</div>
                  <div className="text-[10px] font-mono text-slate-400">SKU: {prod.sku}</div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-[#0D1B2A]">{prod.price.regularPrice.toFixed(2)} MDL</span>
                    <span className="text-[10px] text-slate-500">{prod.brandName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onEdit(prod)}
                    className="flex-1 bg-[#0D1B2A] hover:bg-[#1A3448] text-white text-xs font-extrabold py-2 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Editează
                  </button>
                  <button
                    onClick={() => onPreview(prod)}
                    className="p-2 border border-[#D9E2E1] hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
