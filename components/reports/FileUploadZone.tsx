'use client';

/**
 * MODULE RAPPORTS - Zone d'upload de fichiers avec drag & drop
 */

import { useState, useCallback } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export default function FileUploadZone({
  onFilesSelected,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/json',
    'image/*',
    'text/plain',
  ],
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      // Vérifier la taille
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Le fichier "${file.name}" dépasse ${maxSizeMB}MB`);
        return false;
      }

      // Vérifier le type
      const isAccepted = acceptedTypes.some((type) => {
        if (type.endsWith('/*')) {
          const prefix = type.split('/')[0];
          return file.type.startsWith(prefix + '/');
        }
        return file.type === type || file.name.toLowerCase().endsWith(type.replace('application/', '.'));
      });

      if (!isAccepted) {
        setError(`Le type de fichier "${file.name}" n'est pas accepté`);
        return false;
      }

      return true;
    },
    [maxSizeMB, acceptedTypes]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      setError(null);
      const filesArray = Array.from(files);

      // Vérifier le nombre de fichiers
      if (selectedFiles.length + filesArray.length > maxFiles) {
        setError(`Vous ne pouvez pas ajouter plus de ${maxFiles} fichiers`);
        return;
      }

      // Valider chaque fichier
      const validFiles = filesArray.filter(validateFile);
      if (validFiles.length === 0) return;

      const newFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    },
    [selectedFiles, maxFiles, validateFile, onFilesSelected]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
      setError(null);
    },
    [selectedFiles, onFilesSelected]
  );

  const clearAll = useCallback(() => {
    setSelectedFiles([]);
    onFilesSelected([]);
    setError(null);
  }, [onFilesSelected]);

  return (
    <div className="space-y-4">
      {/* Zone de drag & drop */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50/10' : 'border-slate-700 hover:border-slate-600'}
        `}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={acceptedTypes.join(',')}
          aria-label="Upload files"
        />

        <div className="pointer-events-none">
          <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />
          <p className="text-lg font-medium text-slate-300 mb-2">
            Glissez vos fichiers ici ou cliquez pour parcourir
          </p>
          <p className="text-sm text-slate-500">
            PDF, Excel, CSV, Word, PowerPoint, JSON, Images, Texte
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Max {maxFiles} fichiers · {maxSizeMB}MB par fichier
          </p>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Liste des fichiers sélectionnés */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">
              Fichiers sélectionnés ({selectedFiles.length})
            </h3>
            <button
              onClick={clearAll}
              className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
            >
              Tout effacer
            </button>
          </div>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
              >
                <File className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-300 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                  title="Retirer ce fichier"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
