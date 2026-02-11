"use client";

import React, { useEffect, useRef, useState } from "react";

type DocumentRow = {
  id: string;
  name: string;
  size: number;
  type: string;
  version: number;
  storage_path: string;
  created_at: string;
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      setDocs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error();
      await fetchDocs();
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce document ?")) return;
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    fetchDocs();
  };

  return (
    <div className="px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#D4AF37]">Documents</h1>
          <p className="text-sm text-slate-400">
            Centralise les documents clés de tes projets.
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-blue-500/30 hover:bg-blue-500 transition"
        >
          {uploading ? "Upload en cours…" : "Uploader un document"}
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center transition hover:border-slate-500 hover:bg-slate-900/40"
      >
        <p className="text-slate-300 text-sm mb-1">Glisse-dépose un fichier ici</p>
        <p className="text-slate-500 text-xs">ou utilise le bouton "Uploader un document".</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-900/60 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="border border-dashed border-slate-700 p-6 rounded-xl text-center text-slate-400 text-sm">
          Aucun document pour l'instant.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 bg-slate-950/60">
                <th className="px-4 py-2 text-left">Nom</th>
                <th className="px-4 py-2 text-left">Taille</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Version</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-slate-900/60 last:border-0 hover:bg-slate-900/40 transition"
                >
                  <td className="px-4 py-2 text-slate-100">{doc.name}</td>
                  <td className="px-4 py-2 text-slate-300">
                    {(doc.size / 1024).toFixed(1)} Ko
                  </td>
                  <td className="px-4 py-2 text-slate-300">{doc.type}</td>
                  <td className="px-4 py-2 text-slate-300">v{doc.version}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => remove(doc.id)}
                      className="rounded-full border border-red-700/70 px-3 py-1 text-[11px] text-red-300 hover:bg-red-900/40 transition"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
