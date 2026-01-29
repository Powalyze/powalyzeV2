'use client';

import { useState, useRef } from 'react';
import { Upload, X, File, FileText, FileSpreadsheet, FileImage, Download, Check } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface FileUploadProps {
  onFileUpload?: (file: File) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

export function FileUpload({ 
  onFileUpload, 
  acceptedTypes = '.xlsx,.xls,.doc,.docx,.pdf,.pptx,.pbix', 
  maxSize = 50,
  multiple = false 
}: FileUploadProps) {
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet size={20} className="text-green-400" />;
      case 'pdf':
        return <FileText size={20} className="text-red-400" />;
      case 'doc':
      case 'docx':
        return <FileText size={20} className="text-blue-400" />;
      case 'pbix':
        return <FileImage size={20} className="text-amber-400" />;
      default:
        return <File size={20} className="text-slate-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSize) {
        showToast('error', 'Fichier trop volumineux', `${file.name} dépasse ${maxSize}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
      validFiles.forEach(file => {
        onFileUpload?.(file);
        showToast('success', '✅ Fichier uploadé', `${file.name} (${formatFileSize(file.size)})`);
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    showToast('info', 'Fichier retiré', 'Fichier supprimé de la liste');
  };

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', '⬇️ Téléchargement', `${file.name} téléchargé`);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-slate-700 hover:border-purple-500/50 bg-slate-900/50'
          }
        `}
      >
        <Upload size={48} className={`mx-auto mb-4 ${isDragging ? 'text-purple-400' : 'text-slate-400'}`} />
        <h3 className="text-lg font-semibold mb-2">
          {isDragging ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          ou cliquez pour parcourir
        </p>
        <p className="text-xs text-slate-500">
          Formats supportés: Excel, Word, PDF, PowerPoint, Power BI (.pbix)
          <br />
          Taille max: {maxSize}MB par fichier
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-400">Fichiers uploadés ({uploadedFiles.length})</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <Check size={16} className="text-green-400 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleDownloadFile(file)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Télécharger"
                >
                  <Download size={16} className="text-blue-400" />
                </button>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <X size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
