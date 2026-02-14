'use client';

import { useState, useCallback, useMemo } from 'react';
import { CockpitShell } from '@/components/cockpit/CockpitShell';
import { getDemoData, Document as DocType } from '@/lib/cockpitData';
import { useTranslations } from '@/lib/useTranslations';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Search,
  FileIcon,
  Share2,
  HardDrive,
  Plus,
  X,
} from 'lucide-react';

const CATEGORIES = ['rapport', 'presentation', 'contrat', 'analyse', 'documentation', 'autre'] as const;

type CategoryType = typeof CATEGORIES[number];

const CATEGORY_LABELS: Record<CategoryType, { fr: string, en: string }> = {
  rapport: { fr: 'Rapport', en: 'Report' },
  presentation: { fr: 'Présentation', en: 'Presentation' },
  contrat: { fr: 'Contrat', en: 'Contract' },
  analyse: { fr: 'Analyse', en: 'Analysis' },
  documentation: { fr: 'Documentation', en: 'Documentation' },
  autre: { fr: 'Autre', en: 'Other' }
};

export default function DocumentsPage() {
  const { t, locale } = useTranslations();
  const demoData = getDemoData();
  
  const [documents, setDocuments] = useState<DocType[]>(demoData.documents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const totalDocs = documents.length;
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
  const sharedDocs = documents.filter(d => d.shared).length;

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [documents, searchQuery, selectedCategory]);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIconColor = (type: string): string => {
    if (type.includes('pdf')) return 'text-red-400';
    if (type.includes('word') || type.includes('document')) return 'text-blue-400';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'text-green-400';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'text-orange-400';
    return 'text-slate-400';
  };

  const handleUpload = useCallback((file: File) => {
    setUploading(true);
    setTimeout(() => {
      const newDoc: DocType = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type,
        category: 'autre',
        size: file.size,
        uploadedAt: new Date().toISOString().split('T')[0],
        uploadedBy: 'Current User',
        version: 1,
        tags: [],
        shared: false,
        source: 'real'
      };
      setDocuments(prev => [newDoc, ...prev]);
      setUploading(false);
      setShowUploadModal(false);
    }, 1000);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (confirm(locale === 'fr' ? 'Supprimer ce document ?' : 'Delete this document?')) {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  }, [locale]);

  const handleDownload = useCallback((doc: DocType) => {
    alert(locale === 'fr' ? `Téléchargement de "${doc.name}"` : `Downloading "${doc.name}"`);
  }, [locale]);

  return (
    <CockpitShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {locale === 'fr' ? 'Documents' : 'Documents'}
          </h1>
          <p className="text-slate-400 text-sm">
            {locale === 'fr' 
              ? 'Gérez et organisez tous vos documents de projet'
              : 'Manage and organize all your project documents'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalDocs}</p>
                <p className="text-xs text-slate-400">
                  {locale === 'fr' ? 'Documents' : 'Documents'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <HardDrive className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{formatSize(totalSize)}</p>
                <p className="text-xs text-slate-400">
                  {locale === 'fr' ? 'Espace utilisé' : 'Storage used'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Share2 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{sharedDocs}</p>
                <p className="text-xs text-slate-400">
                  {locale === 'fr' ? 'Partagés' : 'Shared'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={locale === 'fr' ? 'Rechercher un document...' : 'Search documents...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryType | 'all')}
              className="px-4 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              aria-label={locale === 'fr' ? 'Catégorie' : 'Category'}
            >
              <option value="all">{locale === 'fr' ? 'Toutes catégories' : 'All categories'}</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {locale === 'fr' ? CATEGORY_LABELS[cat].fr : CATEGORY_LABELS[cat].en}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
              aria-label={locale === 'fr' ? 'Ajouter un document' : 'Add document'}
            >
              <Plus className="h-4 w-4" />
              {locale === 'fr' ? 'Ajouter' : 'Add'}
            </button>
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                    {locale === 'fr' ? 'Document' : 'Document'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                    {locale === 'fr' ? 'Catégorie' : 'Category'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                    {locale === 'fr' ? 'Taille' : 'Size'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                    {locale === 'fr' ? 'Date' : 'Date'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">
                    {locale === 'fr' ? 'Par' : 'By'}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      {locale === 'fr' ? 'Aucun document trouvé' : 'No documents found'}
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map(doc => (
                    <tr
                      key={doc.id}
                      className="border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <FileIcon className={`h-5 w-5 ${getFileIconColor(doc.type)}`} />
                          <div>
                            <p className="text-white font-medium">{doc.name}</p>
                            {doc.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {doc.tags.slice(0, 2).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-slate-800/60 text-slate-400 text-[10px] rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-slate-800/60 text-slate-300 text-xs rounded">
                          {locale === 'fr' ? CATEGORY_LABELS[doc.category].fr : CATEGORY_LABELS[doc.category].en}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{formatSize(doc.size)}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {new Date(doc.uploadedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{doc.uploadedBy}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {doc.shared && (
                            <Share2 className="h-4 w-4 text-green-400" />
                          )}
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-1.5 hover:bg-slate-800 rounded transition"
                            title={locale === 'fr' ? 'Télécharger' : 'Download'}
                          >
                            <Download className="h-4 w-4 text-slate-400 hover:text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 hover:bg-red-900/20 rounded transition"
                            title={locale === 'fr' ? 'Supprimer' : 'Delete'}
                          >
                            <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                {locale === 'fr' ? 'Ajouter un document' : 'Add document'}
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-slate-800 rounded transition"
                aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div
              className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500/50 transition cursor-pointer"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-white mb-1">
                {locale === 'fr' ? 'Cliquez pour parcourir' : 'Click to browse'}
              </p>
              <p className="text-xs text-slate-500">
                {locale === 'fr' ? 'ou glissez-déposez vos fichiers' : 'or drag and drop your files'}
              </p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                aria-label={locale === 'fr' ? 'Choisir un fichier' : 'Choose file'}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
            </div>

            {uploading && (
              <div className="mt-4 text-center text-sm text-slate-400">
                {locale === 'fr' ? 'Upload en cours...' : 'Uploading...'}
              </div>
            )}
          </div>
        </div>
      )}
    </CockpitShell>
  );
}
