import React, { useState } from 'react';
import { ProductRepository } from '../../services/ProductRepository';
import { Download, Upload, CheckCircle2, AlertTriangle, FileText, RefreshCw, X } from 'lucide-react';

interface ExportImportModalProps {
  onClose: () => void;
  onRefreshProducts: () => Promise<void>;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  onClose,
  onRefreshProducts
}) => {
  const [strategy, setStrategy] = useState<'keep' | 'replace' | 'duplicate'>('keep');
  const [importStatus, setImportStatus] = useState<{ count?: number; errors?: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Export Catalog JSON
  const handleExportJSON = async () => {
    try {
      const jsonStr = await ProductRepository.exportProductsJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CodeBau_Catalog_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error exporting JSON:', e);
    }
  };

  // Handle Import JSON
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setImportStatus(null);
    try {
      const text = await file.text();
      const result = await ProductRepository.importProductsJSON(text, strategy);
      setImportStatus({ count: result.importedCount, errors: result.errors });
      await onRefreshProducts();
    } catch (err: any) {
      setImportStatus({ errors: [`Eroare citire fișier: ${err.message}`] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#D9E2E1] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#0D1B2A] rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-lg font-black text-[#0D1B2A]">Export și Import Siguranță Catalog</h3>
          <p className="text-xs text-slate-500">
            Exportați întregul catalog în format JSON sau restaurați backup-ul pe alte dispozitive de testare.
          </p>
        </div>

        {/* Section 1: Export */}
        <div className="bg-[#F8FAF9] border border-[#D9E2E1] p-5 rounded-2xl space-y-3">
          <div className="font-extrabold text-xs text-[#0D1B2A] uppercase flex items-center gap-2">
            <Download className="w-4 h-4 text-[#00A878]" />
            <span>1. Export Backup Catalog (JSON)</span>
          </div>
          <p className="text-xs text-slate-600">
            Descarcă toate produsele pilot, caracteristicile tehnice și configurațiile de preț sub formă de arhivă JSON.
          </p>
          <button
            onClick={handleExportJSON}
            className="bg-[#0D1B2A] hover:bg-[#1A3448] text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Descarcă Backup JSON</span>
          </button>
        </div>

        {/* Section 2: Import */}
        <div className="bg-[#F8FAF9] border border-[#D9E2E1] p-5 rounded-2xl space-y-4">
          <div className="font-extrabold text-xs text-[#0D1B2A] uppercase flex items-center gap-2">
            <Upload className="w-4 h-4 text-sky-600" />
            <span>2. Import Backup Catalog</span>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase mb-1">Strategie în caz de conflict SKU / ID</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as any)}
              className="w-full bg-white border border-[#D9E2E1] text-xs font-bold p-2.5 rounded-xl outline-none"
            >
              <option value="keep">Păstrează existent (ignorați duplicatele)</option>
              <option value="replace">Înlocuiește produsul existent cu datele din fișier</option>
              <option value="duplicate">Creează produs nou cu cod unic diferit</option>
            </select>
          </div>

          <label className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-xs transition-all">
            <Upload className="w-4 h-4" />
            <span>Selectează Fișier JSON</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>

          {isLoading && (
            <div className="text-xs font-bold text-sky-600 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Se procesează fișierul...</span>
            </div>
          )}

          {importStatus && (
            <div className="bg-white border border-slate-200 p-3 rounded-xl text-xs space-y-1">
              {importStatus.count !== undefined && (
                <div className="text-emerald-700 font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Import reușit: {importStatus.count} produse restaurate/actualizate!</span>
                </div>
              )}
              {importStatus.errors && importStatus.errors.length > 0 && (
                <div className="text-rose-600 space-y-1 pt-1">
                  {importStatus.errors.map((err, i) => (
                    <div key={i} className="flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{err}</span>
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
