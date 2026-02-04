"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { BackButton } from "@/components/BackButton";
import { useState, useRef, useEffect } from "react";
import { Brain, Send, Upload, FileText, X, CheckCircle, Shield, TrendingUp, MessageSquare, Zap, Globe } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type PreviewRow = Record<string, string>;

export default function IACopilotePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Bonjour ! Je suis votre IA Copilote Powalyze. Je peux analyser vos fichiers CSV/Excel, générer des rapports, et vous aider dans vos décisions. Importez un fichier pour commencer.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function parseCSV(text: string): PreviewRow[] {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    
    const [headerLine, ...dataLines] = lines;
    const headers = headerLine.split(/[;,\t]/).map(h => h.trim());
    
    return dataLines.slice(0, 20).map(line => {
      const values = line.split(/[;,\t]/);
      const row: PreviewRow = {};
      headers.forEach((h, i) => (row[h] = values[i]?.trim() || ''));
      return row;
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    
    setFile(f);
    const text = await f.text();
    const rows = parseCSV(text);
    setPreview(rows);
    setShowPreview(true);
  }

  async function handleCreateReport() {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/connectors/file', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        const msg: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `✅ Fichier importé avec succès !\n\n${data.imported} lignes ont été ajoutées à votre portefeuille.\n\nVous pouvez maintenant analyser ces données dans le cockpit executive.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, msg]);
        setShowPreview(false);
        setFile(null);
        setPreview([]);
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      alert('Erreur lors de l\'import du fichier');
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (in production, call OpenAI API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <CockpitShell hideFooter={true}>
      <div className="h-[calc(100vh-4rem)] flex flex-col max-w-7xl mx-auto">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">IA Copilote</h1>
              <p className="text-slate-400">Votre assistant intelligent pour la gestion de portefeuille</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-green-400 font-semibold">En ligne</span>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Upload className="text-amber-400" size={20} />
                <h3 className="font-semibold">Import de fichier</h3>
              </div>
              <label className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold cursor-pointer transition-all text-sm">
                Choisir un fichier
                <input
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {file && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <FileText size={14} />
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          {/* Import Fichier */}
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center gap-2 text-purple-400"
            >
              <Upload size={18} />
              Importer un fichier
            </button>
            {file && <span className="text-sm text-slate-400">{file.name}</span>}
          </div>
        </div>

        {/* File Preview Modal */}
        {showPreview && preview.length > 0 && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-6xl w-full max-h-[80vh] overflow-auto">
              <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Prévisualisation - {preview.length} lignes</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {Object.keys(preview[0]).map(key => (
                        <th key={key} className="text-left p-2 text-slate-400 font-medium">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="p-2 text-slate-300">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-4 flex items-center gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateReport}
                  className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all"
                >
                  Créer un rapport avec ces données
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                <Brain className="text-slate-950" size={20} />
              </div>
              <div className="flex-1">
                <div className="inline-block px-6 py-3 rounded-2xl bg-slate-800 border border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce delay-75" />
                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-8 border-t border-slate-800">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Posez-moi une question sur votre portefeuille..."
              className="flex-1 px-6 py-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center gap-2"
            >
              <Send size={20} />
              <span className="hidden sm:inline">Envoyer</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <QuickActionButton
              label="Analyser mon portefeuille"
              onClick={() => setInput("Analyse complète de mon portefeuille avec insights clés")}
            />
            <QuickActionButton
              label="Détecter les risques"
              onClick={() => setInput("Quels sont les risques critiques actuels ?")}
            />
            <QuickActionButton
              label="Générer rapport COMEX"
              onClick={() => setInput("Génère un rapport exécutif pour le COMEX de cette semaine")}
            />
            <QuickActionButton
              label="Prioriser les projets"
              onClick={() => setInput("Comment prioriser mes projets selon leur ROI ?")}
            />
          </div>
        </div>
      </div>
    </CockpitShell>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-gradient-to-br from-slate-700 to-slate-800"
            : "bg-gradient-to-br from-amber-400 to-amber-600"
        }`}
      >
        {isUser ? (
          <span className="text-slate-200 font-bold text-sm">U</span>
        ) : (
          <Brain className="text-slate-950" size={20} />
        )}
      </div>
      <div className="flex-1 max-w-3xl">
        <div
          className={`px-6 py-4 rounded-2xl ${
            isUser
              ? "bg-slate-800 border border-slate-700 ml-auto"
              : "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700"
          }`}
        >
          <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`mt-2 text-xs text-slate-500 ${isUser ? "text-right" : ""}`}>
          {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

function CapabilityChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-sm">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function QuickActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-sm transition-colors"
    >
      {label}
    </button>
  );
}

function generateMockResponse(userInput: string): string {
  const lowerInput = userInput.toLowerCase();

  if (lowerInput.includes("portefeuille") || lowerInput.includes("analyse")) {
    return `📊 **Analyse de votre portefeuille**

Voici une vue d'ensemble de vos 42 projets actifs :

✅ **Santé globale** : 78% en bonne santé
- 28 projets verts (en bonne voie)
- 10 projets orange (attention requise)
- 4 projets rouges (critiques)

💰 **Budget** : 7.8M€ / 8M€ (98% consommé)
- Économies réalisées : 450K€
- Dépassements : 120K€ (projet ERP)

⚡ **Vélocité** : +15% vs trimestre dernier
- Meilleure équipe : Mobile App (+32%)
- À améliorer : Legacy System (-8%)

🎯 **3 actions recommandées** :
1. Organiser comité d'arbitrage ERP (budget critique)
2. Réaffecter 2 ressources vers Mobile App
3. Anticiper sprint planning avec 3 jours d'avance

Souhaitez-vous des détails sur un projet spécifique ?`;
  }

  if (lowerInput.includes("risque")) {
    return `⚠️ **Détection de risques actifs**

J'ai identifié **12 risques** dans votre portefeuille, dont **3 critiques** :

🔴 **Risques critiques** :
1. **Budget ERP dépassé de 8%** (120K€)
   - Impact : 15 jours de retard supplémentaires
   - Recommandation : Arbitrage COMEX urgent

2. **Vulnérabilité npm CVE-2024-1234** (Mobile App)
   - Impact : Sécurité compromise
   - Recommandation : Mise à jour immédiate

3. **Perte de compétence clé** (Legacy System)
   - Impact : Projet bloqué si départ
   - Recommandation : Documentation + formation

🟡 **Risques en surveillance** : 7
🟢 **Risques mitigés ce mois** : 7

Voulez-vous les plans de mitigation détaillés ?`;
  }

  if (lowerInput.includes("rapport") || lowerInput.includes("comex")) {
    return `📄 **Génération de rapport COMEX**

Je génère votre rapport exécutif avec les éléments clés :

**Points forts cette semaine** :
✅ Cloud Migration avance 15% plus vite que prévu
✅ 7 risques mitigés avec succès
✅ Vélocité globale en hausse de 12%

**Alertes** :
🔴 ERP : Budget dépassé de 8%, nécessite arbitrage
🟡 Mobile App : Manque de ressources front-end

**Décisions requises** :
1. Réallocation budget ERP → Mobile (120K€)
2. Report Sprint 12 de 3 jours (sécurité)
3. Recrutement 2 devs seniors React Native

**Prochains jalons** :
- Cloud Migration : livraison anticipée possible (J-15)
- Mobile App v2 : release Q1 maintenue
- ERP : revue complète budget la semaine prochaine

Le rapport complet (24 pages) sera prêt dans 2 minutes. Export PDF, PowerBI ou envoi direct ?`;
  }

  if (lowerInput.includes("prioris") || lowerInput.includes("roi")) {
    return `🎯 **Priorisation intelligente de vos projets**

Selon l'analyse ROI et impact business :

**Priorité 1 - Critique** :
1. **Mobile App v2** : ROI 340%, impact CA direct
2. **Cloud Migration** : Économies 450K€/an + scalabilité

**Priorité 2 - Important** :
3. **ERP Refonte** : Réduction 30% coûts opérationnels
4. **Analytics Platform** : Amélioration prise de décision

**Priorité 3 - Maintenance** :
5. **Legacy System** : Stabilité opérationnelle
6. **Documentation** : Réduction dette technique

**Recommandation IA** :
Concentrez 60% des ressources sur Mobile + Cloud (ROI maximal), 30% sur ERP (criticité business), 10% sur maintenance.

Réallocation suggérée :
- Mobile App : +2 devs front-end
- Cloud : garder vélocité actuelle
- ERP : geler features non-critiques

Voulez-vous le plan d'action détaillé ?`;
  }

  return `Je comprends votre question sur : "${userInput}"

Je peux vous aider à :
- Analyser votre portefeuille complet
- Détecter et mitiger les risques
- Générer des rapports automatiques
- Prioriser vos projets selon le ROI
- Prendre des décisions éclairées
- Prédire les tendances futures

Précisez ce dont vous avez besoin et je vous fournirai une analyse détaillée avec des recommandations actionnables.`;
}
