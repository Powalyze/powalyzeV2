'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface PBIXUploaderProps {
  projectId: string;
  onUploadComplete?: (reportId: string) => void;
  onClose?: () => void;
}

export default function PBIXUploader({
  projectId,
  onUploadComplete,
  onClose
}: PBIXUploaderProps) {
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportName, setReportName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Gérer la sélection de fichier
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier l'extension
    if (!file.name.endsWith('.pbix')) {
      setError('Le fichier doit être au format .pbix');
      setSelectedFile(null);
      return;
    }

    // Vérifier la taille (max 100 MB)
    const maxSize = 100 * 1024 * 1024; // 100 MB
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux (max 100 MB)');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Pré-remplir le nom du rapport avec le nom du fichier (sans .pbix)
    if (!reportName) {
      const nameWithoutExt = file.name.replace('.pbix', '');
      setReportName(nameWithoutExt);
    }
  };

  // Gérer le drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.pbix')) {
      setSelectedFile(file);
      setError(null);

      if (!reportName) {
        const nameWithoutExt = file.name.replace('.pbix', '');
        setReportName(nameWithoutExt);
      }
    } else {
      setError('Veuillez déposer un fichier .pbix');
    }
  }, [reportName]);

  // Upload du fichier
  const handleUpload = async () => {
    if (!selectedFile || !reportName.trim()) {
      setError('Veuillez sélectionner un fichier et saisir un nom');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Créer le FormData
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('reportName', reportName.trim());
      formData.append('projectId', projectId);

      // Simuler la progression
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Envoyer la requête
      const response = await fetch('/api/powerbi/import', {
        method: 'POST',
        body: formData,
        headers: {
          // Les headers d'auth sont ajoutés automatiquement par le middleware
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de l\'import');
      }

      // Succès
      setSuccess(true);
      showToast('success', '✅ Rapport importé', `Le rapport "${reportName}" a été importé avec succès dans Power BI`);

      // Callback
      if (onUploadComplete) {
        onUploadComplete(data.reportId);
      }

      // Fermer après 2 secondes
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (err) {
      console.error('Error uploading PBIX:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      showToast('error', 'Erreur d\'import', errorMessage);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // Reset
  const handleReset = () => {
    setSelectedFile(null);
    setReportName('');
    setError(null);
    setUploadProgress(0);
    setSuccess(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Importer un rapport Power BI
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Fermer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Success State */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900">Import réussi !</p>
            <p className="text-sm text-green-700">
              Le rapport "{reportName}" est maintenant disponible dans Power BI.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !success && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">Erreur</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {!success && (
        <>
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 mb-6 text-center transition
              ${selectedFile 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
              }
            `}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center space-x-3">
                <FileText className="w-12 h-12 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-red-100 rounded-lg transition"
                  disabled={isUploading}
                  title="Supprimer le fichier"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Glissez-déposez votre fichier .pbix ici
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  ou cliquez pour sélectionner
                </p>
                <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                  <input
                    type="file"
                    accept=".pbix"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                  Choisir un fichier
                </label>
              </>
            )}
          </div>

          {/* Report Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du rapport *
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Ex: Rapport Financier Q1 2026"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Ce nom sera affiché dans Power BI et dans Powalyze
            </p>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Import en cours...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                  role="progressbar"
                  aria-label="Progression de l'import"
                  aria-valuenow={uploadProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                L'import peut prendre quelques minutes selon la taille du fichier
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            {onClose && (
              <button
                onClick={onClose}
                disabled={isUploading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Annuler
              </button>
            )}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !reportName.trim() || isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Import en cours...' : 'Importer dans Power BI'}
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">
              ℹ️ À propos de l'import
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Formats acceptés : .pbix uniquement</li>
              <li>Taille maximale : 100 MB</li>
              <li>Le fichier sera automatiquement publié dans votre workspace Power BI</li>
              <li>Un token d'embed sera généré pour afficher le rapport dans Powalyze</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
