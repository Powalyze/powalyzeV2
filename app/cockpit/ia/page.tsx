"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useState, useRef, useEffect } from "react";
import { Brain, Send, Sparkles, MessageSquare, Zap, Shield, Globe, TrendingUp } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function IACopilotePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Bonjour ! Je suis votre IA Copilote Powalyze. Je peux vous aider à analyser votre portefeuille, prendre des décisions, détecter des risques, générer des rapports et bien plus. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <CockpitShell>
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

          {/* Capabilities */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <CapabilityChip icon={<Brain size={16} />} label="Analyse globale" />
            <CapabilityChip icon={<Sparkles size={16} />} label="Suggestions" />
            <CapabilityChip icon={<Shield size={16} />} label="Détection risques" />
            <CapabilityChip icon={<TrendingUp size={16} />} label="Prédictions" />
            <CapabilityChip icon={<MessageSquare size={16} />} label="Rapports auto" />
            <CapabilityChip icon={<Zap size={16} />} label="Décisions IA" />
            <CapabilityChip icon={<Globe size={16} />} label="Multilingue" />
            <CapabilityChip icon={<Brain size={16} />} label="Coaching" />
          </div>
        </div>

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
