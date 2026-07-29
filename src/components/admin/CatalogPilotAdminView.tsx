import React, { useState, useEffect } from 'react';
import { CatalogProduct } from '../../types/catalog';
import { ProductRepository, ProductFilterParams } from '../../services/ProductRepository';
import { AdminHeader } from './AdminHeader';
import { ProductListTable } from './ProductListTable';
import { ProductEditorWizard } from './ProductEditorWizard';
import { ProductPreviewModal } from './ProductPreviewModal';
import { ExportImportModal } from './ExportImportModal';
import { RefreshCw, Layers, Package, Sliders, FileText, Plus } from 'lucide-react';

interface CatalogPilotAdminViewProps {
  onBackToSite: () => void;
}

export const CatalogPilotAdminView: React.FC<CatalogPilotAdminViewProps> = ({
  onBackToSite
}) => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeHeaderTab, setActiveHeaderTab] = useState<'products' | 'categories' | 'attributes' | 'documents' | 'backup'>('products');

  const [filterParams, setFilterParams] = useState<ProductFilterParams>({});
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [previewingProduct, setPreviewingProduct] = useState<CatalogProduct | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);

  // Load products from ProductRepository
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const all = await ProductRepository.getAllProducts();
      setProducts(all);
      const filtered = await ProductRepository.searchProducts(filterParams);
      setFilteredProducts(filtered);
    } catch (e) {
      console.error('Error loading products for admin:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Re-filter whenever filterParams or products change
  useEffect(() => {
    const applyFilter = async () => {
      const filtered = await ProductRepository.searchProducts(filterParams);
      setFilteredProducts(filtered);
    };
    applyFilter();
  }, [filterParams, products]);

  // Actions
  const handleCreateNewProduct = async () => {
    const newProd = await ProductRepository.createProduct({
      name: { ro: 'Produs Nou Pilot', ru: 'Новый пилотный товар' },
      status: 'draft'
    });
    setEditingProduct(newProd);
    await loadProducts();
  };

  const handleCreateFromTemplate = async (templateIdx: number) => {
    const newProd = await ProductRepository.createFromTemplate(templateIdx);
    setEditingProduct(newProd);
    await loadProducts();
  };

  const handleSaveProduct = async (updatedProduct: CatalogProduct) => {
    await ProductRepository.updateProduct(updatedProduct);
    await loadProducts();
  };

  const handlePublishProduct = async (productId: string) => {
    await ProductRepository.publishProduct(productId);
    await loadProducts();
  };

  const handleUnpublishProduct = async (productId: string) => {
    await ProductRepository.unpublishProduct(productId);
    await loadProducts();
  };

  const handleArchiveProduct = async (productId: string) => {
    await ProductRepository.archiveProduct(productId);
    await loadProducts();
  };

  const handleDeleteDraftProduct = async (productId: string) => {
    if (window.confirm('Sigur doriți să ștergeți definitiv această ciornă? Acțiunea este ireversibilă.')) {
      await ProductRepository.deleteDraftProduct(productId);
      await loadProducts();
    }
  };

  const handleDuplicateProduct = async (productId: string) => {
    const dup = await ProductRepository.duplicateProduct(productId);
    if (dup) {
      setEditingProduct(dup);
      await loadProducts();
    }
  };

  const handleExportProductJSON = (product: CatalogProduct) => {
    const blob = new Blob([JSON.stringify(product, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Produs_${product.sku}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render Editor Mode
  if (editingProduct) {
    return (
      <ProductEditorWizard
        product={editingProduct}
        allProducts={products}
        onSave={handleSaveProduct}
        onPublish={handlePublishProduct}
        onPreview={(p) => setPreviewingProduct(p)}
        onClose={() => setEditingProduct(null)}
      />
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-[#0D1B2A]">
      {/* Admin Top Header */}
      <AdminHeader
        activeTab={activeHeaderTab}
        onTabChange={(tab) => {
          setActiveHeaderTab(tab);
          if (tab === 'backup') setIsBackupModalOpen(true);
        }}
        onNewProduct={handleCreateNewProduct}
        onNewFromTemplate={handleCreateFromTemplate}
        onBackToSite={onBackToSite}
      />

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {isLoading ? (
          <div className="bg-white border border-[#D9E2E1] rounded-3xl p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#00A878] animate-spin mx-auto" />
            <div className="text-xs font-black text-[#0D1B2A]">Se încarcă catalogul PIM...</div>
          </div>
        ) : activeHeaderTab === 'categories' ? (
          /* Categories Manager Tab */
          <div className="bg-white border border-[#D9E2E1] rounded-3xl p-8 space-y-4">
            <h3 className="text-base font-extrabold text-[#0D1B2A] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00A878]" />
              <span>Grupare pe Categorii & Subcategorii PIM</span>
            </h3>
            <p className="text-xs text-slate-500">
              Categoriile active în sistem: Adezivi și Chituril, Grunduri și Amorse, Vopsele și Tencuieli, Termoizolații, Scule și Unelte.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {['adezivi', 'grunduri', 'vopsele', 'termoizolatie', 'scule'].map(cat => (
                <div key={cat} className="bg-[#F8FAF9] border border-[#D9E2E1] p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-extrabold text-xs capitalize">{cat}</span>
                  <span className="bg-slate-200 text-slate-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {products.filter(p => p.categoryId === cat).length} produse
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : activeHeaderTab === 'attributes' ? (
          /* Attributes Schema Tab */
          <div className="bg-white border border-[#D9E2E1] rounded-3xl p-8 space-y-4">
            <h3 className="text-base font-extrabold text-[#0D1B2A] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-500" />
              <span>Atribute Tehnice Dinamice (PIM Schema)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Atribute predefinite configurate pentru catalogul pilot: Clasificare EN 12004 (C1, C1TE, C2TE S1), Consum kg/m², Timp deschis, Încălzire în pardoseală, Suporturi compatibile.
            </p>
          </div>
        ) : activeHeaderTab === 'documents' ? (
          /* Documents Tab */
          <div className="bg-white border border-[#D9E2E1] rounded-3xl p-8 space-y-4">
            <h3 className="text-base font-extrabold text-[#0D1B2A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-500" />
              <span>Gestiune Documente Tehnice PDF</span>
            </h3>
            <p className="text-xs text-slate-500">
              Aici sunt grupate toate fișele tehnice (TDS), fișele de securitate (MSDS) și declarațiile de performanță (DoP).
            </p>
          </div>
        ) : (
          /* Main Products List Table */
          <ProductListTable
            products={filteredProducts}
            filterParams={filterParams}
            onFilterChange={setFilterParams}
            onEdit={(prod) => setEditingProduct(prod)}
            onPreview={(prod) => setPreviewingProduct(prod)}
            onDuplicate={handleDuplicateProduct}
            onPublish={handlePublishProduct}
            onUnpublish={handleUnpublishProduct}
            onArchive={handleArchiveProduct}
            onDeleteDraft={handleDeleteDraftProduct}
            onExportProductJSON={handleExportProductJSON}
          />
        )}
      </main>

      {/* Modals */}
      {previewingProduct && (
        <ProductPreviewModal
          product={previewingProduct}
          allProducts={products}
          onClose={() => setPreviewingProduct(null)}
        />
      )}

      {isBackupModalOpen && (
        <ExportImportModal
          onClose={() => setIsBackupModalOpen(false)}
          onRefreshProducts={loadProducts}
        />
      )}
    </div>
  );
};
