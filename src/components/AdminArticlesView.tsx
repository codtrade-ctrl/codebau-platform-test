import React, { useState } from 'react';
import { Article, EditorialAuditLog, EditorialContentStatus, EditorialStatus } from '../types';
import { EditorialService } from '../services/EditorialService';
import { MOCK_PRODUCTS, MOCK_SOLUTIONS } from '../data/mockData';
import { Plus, Edit2, Trash2, Copy, Eye, CheckCircle2, Clock, FileText, Search, Tag, ShieldCheck, ArrowLeft, Save, Send, Archive, RefreshCw } from 'lucide-react';

export const AdminArticlesView: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(EditorialService.getArticles());
  const [categories] = useState(EditorialService.getCategories());
  const [authors] = useState(EditorialService.getAuthors());
  const [auditLogs, setAuditLogs] = useState<EditorialAuditLog[]>(EditorialService.getAuditLogs());

  const [activeTab, setActiveTab] = useState<'list' | 'editor' | 'audit'>('list');
  const [filterCategory, setFilterCategory] = useState<string>('toate');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editor form state
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);

  const reloadData = () => {
    setArticles(EditorialService.getArticles());
    setAuditLogs(EditorialService.getAuditLogs());
  };

  const handleNewArticle = () => {
    setEditingArticle({
      id: `art-${Date.now()}`,
      slug: '',
      title: '',
      subtitle: '',
      excerpt: '',
      content: '## Titlu secțiune\n\nText articol...',
      categoryId: 'ghiduri-practice',
      tags: ['ghid', 'constructii'],
      authorId: 'author-1',
      reviewerId: 'author-2',
      heroImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
      status: 'draft',
      contentStatus: 'draft',
      featured: false,
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      readingTime: '5 min',
      relatedProductIds: ['prod-1'],
      relatedSolutionIds: ['sol-montare-gresie'],
      relatedCalculatorId: 'calculator',
      seoTitle: '',
      seoDescription: '',
      canonicalUrl: '',
      language: 'ro',
      isTestData: true
    });
    setActiveTab('editor');
  };

  const handleEdit = (art: Article) => {
    setEditingArticle({ ...art });
    setActiveTab('editor');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title?.trim()) return;

    const autoSlug = editingArticle.slug?.trim() || editingArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const completeArticle: Article = {
      id: editingArticle.id || `art-${Date.now()}`,
      slug: autoSlug,
      title: editingArticle.title,
      subtitle: editingArticle.subtitle || '',
      excerpt: editingArticle.excerpt || '',
      content: editingArticle.content || '',
      categoryId: editingArticle.categoryId || 'ghiduri-practice',
      tags: editingArticle.tags || [],
      authorId: editingArticle.authorId || 'author-1',
      reviewerId: editingArticle.reviewerId,
      heroImage: editingArticle.heroImage || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
      status: editingArticle.status || 'draft',
      contentStatus: editingArticle.contentStatus || 'draft',
      featured: editingArticle.featured || false,
      publishedAt: editingArticle.publishedAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      readingTime: editingArticle.readingTime || '5 min',
      relatedProductIds: editingArticle.relatedProductIds || [],
      relatedSolutionIds: editingArticle.relatedSolutionIds || [],
      relatedCalculatorId: editingArticle.relatedCalculatorId || '',
      seoTitle: editingArticle.seoTitle || editingArticle.title,
      seoDescription: editingArticle.seoDescription || editingArticle.excerpt,
      canonicalUrl: editingArticle.canonicalUrl || `https://codebau.md/ghiduri/${autoSlug}`,
      language: 'ro',
      isTestData: true,
      createdBy: editingArticle.createdBy || 'admin_user',
      updatedBy: 'admin_user'
    };

    EditorialService.saveArticle(completeArticle, 'admin_codebau', 'Administrator Editorial');
    reloadData();
    setActiveTab('list');
    setEditingArticle(null);
  };

  const handleStatusChange = (id: string, newStatus: EditorialStatus) => {
    EditorialService.updateStatus(id, newStatus, 'admin_codebau', 'Administrator Editorial');
    reloadData();
  };

  const handleDuplicate = (id: string) => {
    EditorialService.duplicateArticle(id, 'admin_codebau', 'Administrator Editorial');
    reloadData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Sigur dorești să ștergi acest articol din Centrul CodeBau?')) {
      EditorialService.deleteArticle(id, 'admin_codebau', 'Administrator Editorial');
      reloadData();
    }
  };

  // Filtering list
  const filteredArticles = articles.filter(a => {
    if (filterCategory !== 'toate' && a.categoryId !== filterCategory) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-[#0D1B2A] text-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#1A3448] shadow-md">
        <div>
          <div className="flex items-center gap-2 text-[#00A878] text-xs font-black uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Panou Redacțional</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Administrare Centrul CodeBau
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Gestionare articole, fluxuri de verificare tehnică, autorat și audit editorial.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'audit' ? 'list' : 'audit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'audit'
                ? 'bg-[#00A878] text-white border-[#00A878]'
                : 'bg-[#13283A] text-slate-300 border-[#1A3448] hover:text-white'
            }`}
          >
            Jurnal Audit ({auditLogs.length})
          </button>

          <button
            onClick={handleNewArticle}
            className="bg-[#087F5B] hover:bg-[#066B4D] text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Articol Nou</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: JURNAL AUDIT */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-3xl border border-[#D9E2E1] space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#0D1B2A] uppercase tracking-wider">
              Istoric modificări & audit editorial
            </h3>
            <button
              onClick={() => setActiveTab('list')}
              className="text-xs font-bold text-[#087F5B] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Înapoi la lista de articole
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#EFFAF6] text-[#0D1B2A] font-extrabold border-b border-[#D9E2E1]">
                  <th className="p-3">Data / Ora</th>
                  <th className="p-3">Articol</th>
                  <th className="p-3">Utilizator / Rol</th>
                  <th className="p-3">Acțiune</th>
                  <th className="p-3">Detalii</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2E1]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-[#5C6670] font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('ro-MD')}
                    </td>
                    <td className="p-3 font-bold text-[#0D1B2A]">
                      {log.articleTitle}
                    </td>
                    <td className="p-3 font-medium text-[#5C6670]">
                      {log.userId} ({log.userRole})
                    </td>
                    <td className="p-3">
                      <span className="bg-[#DDF5EE] text-[#087F5B] font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-[#5C6670]">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: FORMULAR EDITOR */}
      {activeTab === 'editor' && editingArticle && (
        <form onSubmit={handleSaveForm} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E2E1] space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#D9E2E1]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setActiveTab('list'); setEditingArticle(null); }}
                className="text-xs text-[#5C6670] hover:text-[#0D1B2A] font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anulează</span>
              </button>
              <h3 className="text-base font-black text-[#0D1B2A] ml-4">
                {editingArticle.title ? `Editare: ${editingArticle.title}` : 'Creare articol nou'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingArticle({ ...editingArticle, status: 'draft', contentStatus: 'draft' })}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0D1B2A] text-xs font-bold rounded-xl cursor-pointer"
              >
                Salvează ca Draft
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#087F5B] hover:bg-[#066B4D] text-white text-xs font-black rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Save className="w-4 h-4" />
                <span>Salvează Articolul</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Stânga: Date Principale (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Titlu Articol *</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="ex: Cum alegi adezivul potrivit pentru gresie și faianță"
                  className="w-full px-3.5 py-2.5 border border-[#D9E2E1] rounded-xl text-xs font-bold text-[#0D1B2A] focus:outline-none focus:border-[#087F5B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Slug URL (auto-generat)</label>
                  <input
                    type="text"
                    value={editingArticle.slug || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    placeholder="cum-alegi-adezivul-potrivit"
                    className="w-full px-3.5 py-2 border border-[#D9E2E1] rounded-xl text-xs text-[#0D1B2A] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Subtitlu / Slogan</label>
                  <input
                    type="text"
                    value={editingArticle.subtitle || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, subtitle: e.target.value })}
                    placeholder="Ghid tehnic complet pentru clasele C1 și C2"
                    className="w-full px-3.5 py-2 border border-[#D9E2E1] rounded-xl text-xs text-[#0D1B2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Rezumat (Excerpt) *</label>
                <textarea
                  rows={3}
                  required
                  value={editingArticle.excerpt || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  placeholder="Scurt rezumat afișat în cardurile din grilă..."
                  className="w-full px-3.5 py-2 border border-[#D9E2E1] rounded-xl text-xs text-[#0D1B2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Conținut Articol (Markdown / HTML) *</label>
                <textarea
                  rows={14}
                  required
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-[#D9E2E1] rounded-xl text-xs text-[#0D1B2A] font-mono leading-relaxed"
                />
              </div>

              {/* Integrări produse, soluții, calculator */}
              <div className="p-4 bg-slate-50 border border-[#D9E2E1] rounded-2xl space-y-3">
                <h4 className="text-xs font-extrabold text-[#0D1B2A] uppercase">Legături cu catalogul CodeBau</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5C6670] mb-1">ID-uri Produse Asociate (virgulă)</label>
                    <input
                      type="text"
                      value={(editingArticle.relatedProductIds || []).join(', ')}
                      onChange={(e) => setEditingArticle({
                        ...editingArticle,
                        relatedProductIds: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="prod-1, prod-2"
                      className="w-full px-3 py-1.5 border border-[#D9E2E1] rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5C6670] mb-1">ID-uri Soluții Asociate</label>
                    <input
                      type="text"
                      value={(editingArticle.relatedSolutionIds || []).join(', ')}
                      onChange={(e) => setEditingArticle({
                        ...editingArticle,
                        relatedSolutionIds: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="sol-montare-gresie"
                      className="w-full px-3 py-1.5 border border-[#D9E2E1] rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dreapta: Setări & Status (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="p-4 bg-[#EFFAF6] border border-[#00A878]/30 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-[#087F5B] uppercase">Workflow & Status</h4>

                <div>
                  <label className="block text-[11px] font-bold text-[#0D1B2A] mb-1">Status Publicare</label>
                  <select
                    value={editingArticle.status || 'draft'}
                    onChange={(e) => setEditingArticle({
                      ...editingArticle,
                      status: e.target.value as EditorialStatus,
                      contentStatus: e.target.value === 'published' ? 'published' : editingArticle.contentStatus
                    })}
                    className="w-full px-3 py-2 border border-[#D9E2E1] rounded-xl text-xs font-bold text-[#0D1B2A] bg-white"
                  >
                    <option value="draft">Draft (Ciornă)</option>
                    <option value="internal_review">Internal Review</option>
                    <option value="technical_review">Technical Review</option>

                    <option value="approved">Aprobat</option>
                    <option value="published">Publicat</option>
                    <option value="archived">Arhivat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0D1B2A] mb-1">Status Verificare Tehnică</label>
                  <select
                    value={editingArticle.contentStatus || 'draft'}
                    onChange={(e) => setEditingArticle({
                      ...editingArticle,
                      contentStatus: e.target.value as EditorialContentStatus
                    })}
                    className="w-full px-3 py-2 border border-[#D9E2E1] rounded-xl text-xs font-bold text-[#0D1B2A] bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="internal_review">Revizuire internă</option>
                    <option value="technically_verified">Verificat Tehnic Inginer</option>
                    <option value="published">Publicat în Centrul CodeBau</option>
                    <option value="archived">Arhivat</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={editingArticle.featured || false}
                    onChange={(e) => setEditingArticle({ ...editingArticle, featured: e.target.checked })}
                    className="rounded text-[#087F5B]"
                  />
                  <label htmlFor="featuredCheck" className="text-xs font-bold text-[#0D1B2A]">
                    Recomandarea Săptămânii (Featured)
                  </label>
                </div>
              </div>

              {/* Categorie & Autor */}
              <div className="p-4 bg-white border border-[#D9E2E1] rounded-2xl space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Categorie *</label>
                  <select
                    value={editingArticle.categoryId || 'ghiduri-practice'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D9E2E1] rounded-xl text-xs font-bold text-[#0D1B2A]"
                  >
                    {categories.filter(c => c.id !== 'toate').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Autor Redacțional *</label>
                  <select
                    value={editingArticle.authorId || 'author-1'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, authorId: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D9E2E1] rounded-xl text-xs text-[#0D1B2A]"
                  >
                    {authors.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">URL Imagine Principală</label>
                  <input
                    type="text"
                    value={editingArticle.heroImage || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, heroImage: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D9E2E1] rounded-xl text-xs text-[#0D1B2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0D1B2A] mb-1">Timp de citire (ex: 5 min)</label>
                  <input
                    type="text"
                    value={editingArticle.readingTime || '5 min'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, readingTime: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D9E2E1] rounded-xl text-xs text-[#0D1B2A]"
                  />
                </div>
              </div>

              {/* SEO Tags */}
              <div className="p-4 bg-slate-50 border border-[#D9E2E1] rounded-2xl space-y-2">
                <h4 className="text-xs font-extrabold text-[#0D1B2A] uppercase">Meta SEO & Canonical</h4>
                <div>
                  <label className="block text-[11px] font-bold text-[#5C6670] mb-0.5">SEO Title</label>
                  <input
                    type="text"
                    value={editingArticle.seoTitle || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, seoTitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#D9E2E1] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5C6670] mb-0.5">SEO Description</label>
                  <input
                    type="text"
                    value={editingArticle.seoDescription || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, seoDescription: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#D9E2E1] rounded-lg text-xs"
                  />
                </div>
              </div>

            </div>

          </div>
        </form>
      )}

      {/* VIEW 3: LISTA ARTICOLE */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          
          {/* Bară filtre & Căutare */}
          <div className="bg-white p-4 rounded-2xl border border-[#D9E2E1] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-[#D9E2E1] rounded-xl text-xs font-bold text-[#0D1B2A]"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-[#D9E2E1] rounded-xl text-xs font-bold text-[#0D1B2A]"
              >
                <option value="all">Toate statusurile</option>
                <option value="draft">Draft</option>
                <option value="internal_review">Internal Review</option>

                <option value="approved">Aprobat</option>
                <option value="published">Publicat</option>
                <option value="archived">Arhivat</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#5C6670] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Caută în articole..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-[#D9E2E1] rounded-xl text-xs text-[#0D1B2A]"
              />
            </div>
          </div>

          {/* Tabel Articole */}
          <div className="bg-white rounded-3xl border border-[#D9E2E1] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#EFFAF6] text-[#0D1B2A] font-extrabold border-b border-[#D9E2E1]">
                    <th className="p-3.5">Articol & Categorie</th>
                    <th className="p-3.5">Autor</th>
                    <th className="p-3.5">Status Publicare</th>
                    <th className="p-3.5">Verificare Tehnică</th>
                    <th className="p-3.5">Data</th>
                    <th className="p-3.5 text-right">Acțiuni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E2E1]">
                  {filteredArticles.map((art) => {
                    const categoryName = categories.find(c => c.id === art.categoryId)?.name || 'Ghid';
                    const author = EditorialService.getAuthorById(art.authorId);

                    return (
                      <tr key={art.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={art.heroImage}
                              alt={art.title}
                              className="w-12 h-12 object-cover rounded-xl border border-[#D9E2E1] shrink-0"
                            />
                            <div>
                              <span className="text-[10px] font-extrabold text-[#087F5B] uppercase">{categoryName}</span>
                              <p className="font-extrabold text-[#0D1B2A] line-clamp-1">{art.title}</p>
                              {art.featured && (
                                <span className="text-[9px] bg-[#F4B400] text-[#0D1B2A] font-black px-1.5 py-0.2 rounded uppercase">
                                  Recomandat
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-semibold text-[#0D1B2A]">
                          {author.name}
                        </td>

                        <td className="p-3.5">
                          <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase ${
                            art.status === 'published' ? 'bg-green-100 text-green-800 border border-green-300' :
                            art.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {art.status}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="bg-[#EFFAF6] text-[#087F5B] border border-[#00A878]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            {art.contentStatus}
                          </span>
                        </td>

                        <td className="p-3.5 text-[#5C6670] whitespace-nowrap">
                          {art.publishedAt}
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(art)}
                              title="Editează"
                              className="p-1.5 text-slate-600 hover:text-[#087F5B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(art.id)}
                              title="Duplică"
                              className="p-1.5 text-slate-600 hover:text-[#0D1B2A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(art.id)}
                              title="Șterge"
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
