"use client";

import { useState } from "react";
import { Upload, File, FileText, Image as ImageIcon, Download, Trash2, Eye, Clock } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  url: string;
}

interface DocumentManagerProps {
  projectId: string;
}

export function DocumentManager({ projectId }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Specifications_v2.pdf",
      size: 2500000,
      type: "application/pdf",
      uploadedBy: "Jean Dupont",
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      version: 2,
      url: "#",
    },
    {
      id: "2",
      name: "Architecture_Diagram.png",
      size: 850000,
      type: "image/png",
      uploadedBy: "Marie Martin",
      uploadedAt: new Date(Date.now() - 172800000).toISOString(),
      version: 1,
      url: "#",
    },
  ]);
  const [dragOver, setDragOver] = useState(false);
  const { showToast } = useToast();

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  }

  function getFileIcon(type: string) {
    if (type.startsWith("image/")) return <ImageIcon size={20} className="text-blue-400" />;
    if (type === "application/pdf") return <FileText size={20} className="text-red-400" />;
    return <File size={20} className="text-slate-400" />;
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }

  function handleFiles(files: File[]) {
    files.forEach((file) => {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: "Vous",
        uploadedAt: new Date().toISOString(),
        version: 1,
        url: URL.createObjectURL(file),
      };
      setDocuments((prev) => [...prev, newDoc]);
    });
    showToast("success", "Documents ajoutés", `${files.length} fichier(s) uploadé(s)`);
  }

  function deleteDocument(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast("info", "Document supprimé", "Le document a été retiré du projet");
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Documents ({documents.length})</h3>
        <label className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-medium cursor-pointer flex items-center gap-2 transition-colors">
          <Upload size={18} />
          Upload
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(Array.from(e.target.files));
            }}
          />
        </label>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-all ${
          dragOver
            ? "border-amber-500 bg-amber-500/10"
            : "border-slate-700 hover:border-slate-600"
        }`}
      >
        <Upload size={48} className="mx-auto text-slate-500 mb-3" />
        <p className="text-slate-400">
          Glissez-déposez vos fichiers ici ou cliquez sur Upload
        </p>
        <p className="text-sm text-slate-600 mt-1">
          PDF, PNG, JPG, DOCX... max 10 MB
        </p>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-800 rounded-lg p-4 flex items-center gap-4 hover:bg-slate-750 transition-colors"
          >
            {/* Icon */}
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
              {getFileIcon(doc.type)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate">{doc.name}</h4>
              <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                <span>{formatFileSize(doc.size)}</span>
                <span>•</span>
                <span>v{doc.version}</span>
                <span>•</span>
                <span>{doc.uploadedBy}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(doc.uploadedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                title="Prévisualiser"
                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-900 rounded-lg transition-colors"
              >
                <Eye size={18} />
              </button>
              <button
                title="Télécharger"
                className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-900 rounded-lg transition-colors"
              >
                <Download size={18} />
              </button>
              <button
                title="Supprimer"
                onClick={() => deleteDocument(doc.id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {documents.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            Aucun document. Uploadez votre premier fichier !
          </div>
        )}
      </div>
    </div>
  );
}
