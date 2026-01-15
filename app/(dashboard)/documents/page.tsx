"use client";

import React, { useState } from "react";
import { Folder, File, Search, Upload, MoreVertical, Download, Trash2, Eye } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Document {
  id: string;
  name: string;
  type: "folder" | "file";
  size?: number;
  modified: string;
  owner: string;
}

const documents: Document[] = [
  {
    id: "1",
    name: "Projets 2026",
    type: "folder",
    modified: "2026-02-14",
    owner: "Sophie Martin",
  },
  {
    id: "2",
    name: "Rapports Financiers",
    type: "folder",
    modified: "2026-02-13",
    owner: "Claire Moreau",
  },
  {
    id: "3",
    name: "Spécifications Techniques Azure.pdf",
    type: "file",
    size: 2458000,
    modified: "2026-02-14",
    owner: "Thomas Dubois",
  },
  {
    id: "4",
    name: "Budget Q1 2026.xlsx",
    type: "file",
    size: 584000,
    modified: "2026-02-12",
    owner: "Marie Laurent",
  },
  {
    id: "5",
    name: "Architecture Microservices.pptx",
    type: "file",
    size: 8945000,
    modified: "2026-02-11",
    owner: "Pierre Bernard",
  },
  {
    id: "6",
    name: "Contrats & Juridique",
    type: "folder",
    modified: "2026-02-10",
    owner: "Julien Petit",
  },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
          <p className="text-slate-400">Gestion centralisée de vos fichiers et dossiers</p>
        </div>
        <Button variant="primary" size="lg">
          <Upload size={20} />
          Importer
        </Button>
      </div>

      {/* Storage Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Stockage utilisé</h3>
              <p className="text-sm text-slate-400">42.8 Go sur 100 Go</p>
            </div>
            <div className="text-2xl font-bold text-amber-400">43%</div>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
              style={{ width: "43%" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Rechercher un fichier ou dossier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Fichiers récents</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <DocumentItem key={doc.id} document={doc} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DocumentItem({ document }: { document: Document }) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer">
      {/* Icon */}
      <div className={`p-3 rounded-lg ${document.type === "folder" ? "bg-amber-500/10" : "bg-sky-500/10"}`}>
        {document.type === "folder" ? (
          <Folder className="text-amber-400" size={24} />
        ) : (
          <File className="text-sky-400" size={24} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white truncate mb-1">{document.name}</h4>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Modifié le {new Date(document.modified).toLocaleDateString('fr-FR')}</span>
          {document.size && <span>{formatFileSize(document.size)}</span>}
          <span>{document.owner}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Voir">
          <Eye size={18} className="text-slate-400" />
        </button>
        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Télécharger">
          <Download size={18} className="text-slate-400" />
        </button>
        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Plus d'options">
          <MoreVertical size={18} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}
