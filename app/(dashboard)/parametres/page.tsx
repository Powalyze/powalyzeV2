"use client";

import React, { useState } from "react";
import { User, Bell, Shield, Key, Globe, Palette, Database, Code } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "api", label: "API & Webhooks", icon: Code },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
        <p className="text-slate-400">Gérez votre compte et vos préférences</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="xl:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-amber-500 text-slate-950"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <tab.icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="xl:col-span-3 space-y-6">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "api" && <APISettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Informations personnelles</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  defaultValue="Jean"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  defaultValue="Dupont"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="jean.dupont@powalyze.com"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fonction
              </label>
              <input
                type="text"
                defaultValue="Chef de Projet"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Entreprise
              </label>
              <input
                type="text"
                defaultValue="Acme Corporation"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="primary">Enregistrer</Button>
            <Button variant="outline">Annuler</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Préférences</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Langue
              </label>
              <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option>Français</option>
                <option>English</option>
                <option>Deutsch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fuseau horaire
              </label>
              <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option>Europe/Paris (GMT+1)</option>
                <option>America/New_York (GMT-5)</option>
                <option>Asia/Tokyo (GMT+9)</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="primary">Enregistrer</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-white">Préférences de notification</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <SettingToggle
            label="Notifications par email"
            description="Recevoir des notifications par email"
            defaultChecked={true}
          />
          <SettingToggle
            label="Notifications desktop"
            description="Afficher les notifications desktop"
            defaultChecked={true}
          />
          <SettingToggle
            label="Notifications de projet"
            description="Mises à jour des projets auxquels vous participez"
            defaultChecked={true}
          />
          <SettingToggle
            label="Notifications d'équipe"
            description="Mentions et messages de l'équipe"
            defaultChecked={true}
          />
          <SettingToggle
            label="Rapports hebdomadaires"
            description="Résumé hebdomadaire de l'activité"
            defaultChecked={false}
          />
          <SettingToggle
            label="Alertes de risques"
            description="Alertes en cas de détection de risques"
            defaultChecked={true}
          />
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="primary">Enregistrer</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SecuritySettings() {
  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Mot de passe</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe actuel
              </label>
              <input
                type="password"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="primary">Modifier le mot de passe</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Authentification à deux facteurs</h2>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 mb-4">
            Ajoutez une couche de sécurité supplémentaire à votre compte
          </p>
          <SettingToggle
            label="Activer 2FA"
            description="Utiliser une application d'authentification"
            defaultChecked={false}
          />
          <div className="flex gap-3 mt-6">
            <Button variant="primary">Configurer 2FA</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Sessions actives</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <SessionItem
              device="Windows 11 - Chrome"
              location="Paris, France"
              lastActive="Actif maintenant"
              current={true}
            />
            <SessionItem
              device="iPhone 15 Pro - Safari"
              location="Paris, France"
              lastActive="Il y a 2 heures"
              current={false}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline">Déconnecter toutes les sessions</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function APISettings() {
  const [apiKeys, setApiKeys] = React.useState([
    {
      id: 1,
      name: "Production API Key",
      key_preview: "pk_live_**********************abc123",
      created: "2026-01-15",
      lastUsed: "2026-02-14"
    },
    {
      id: 2,
      name: "Development API Key",
      key_preview: "pk_test_**********************def456",
      created: "2026-01-10",
      lastUsed: "2026-02-13"
    }
  ]);

  const generateNewKey = () => {
    const newKey = {
      id: apiKeys.length + 1,
      name: `API Key ${apiKeys.length + 1}`,
      key_preview: `pk_${Date.now()}_**********************${Math.random().toString(36).substring(7)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Jamais utilisée"
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const revokeKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Clés API</h2>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 mb-4">
            Générez des clés API pour intégrer Powalyze avec vos applications
          </p>
          <div className="space-y-3 mb-6">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div>
                  <div className="font-semibold text-white mb-1">{key.name}</div>
                  <div className="text-sm text-slate-400 font-mono">{key.key_preview}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Créée le {new Date(key.created).toLocaleDateString('fr-FR')} • 
                    {key.lastUsed === "Jamais utilisée" ? " Jamais utilisée" : ` Utilisée le ${new Date(key.lastUsed).toLocaleDateString('fr-FR')}`}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => revokeKey(key.id)}>Révoquer</Button>
              </div>
            ))}
          </div>
          <Button variant="primary" onClick={generateNewKey}>
            <Key size={18} />
            Générer une nouvelle clé
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Webhooks</h2>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 mb-4">
            Configurez des webhooks pour recevoir des événements en temps réel
          </p>
          <div className="space-y-3 mb-6">
            <WebhookItem
              url="https://api.example.com/webhooks"
              events={["project.created", "project.updated", "risk.detected"]}
              status="active"
            />
          </div>
          <Button variant="primary">Ajouter un webhook</Button>
        </CardContent>
      </Card>
    </>
  );
}

function SettingToggle({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-start justify-between p-4 bg-slate-800/30 rounded-lg">
      <div>
        <div className="font-semibold text-white mb-1">{label}</div>
        <div className="text-sm text-slate-400">{description}</div>
      </div>
      <label className="relative inline-block w-12 h-6">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
      </label>
    </div>
  );
}

function SessionItem({
  device,
  location,
  lastActive,
  current,
}: {
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
      <div>
        <div className="font-semibold text-white mb-1">{device}</div>
        <div className="text-sm text-slate-400">{location} • {lastActive}</div>
      </div>
      {current ? (
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">
          Session actuelle
        </span>
      ) : (
        <Button variant="ghost" size="sm">Révoquer</Button>
      )}
    </div>
  );
}

function APIKeyItem({
  name,
  key_preview,
  created,
  lastUsed,
}: {
  name: string;
  key_preview: string;
  created: string;
  lastUsed: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
      <div>
        <div className="font-semibold text-white mb-1">{name}</div>
        <div className="text-sm text-slate-400 font-mono">{key_preview}</div>
        <div className="text-xs text-slate-500 mt-1">
          Créée le {new Date(created).toLocaleDateString('fr-FR')} • 
          Utilisée le {new Date(lastUsed).toLocaleDateString('fr-FR')}
        </div>
      </div>
      <Button variant="outline" size="sm">Révoquer</Button>
    </div>
  );
}

function WebhookItem({
  url,
  events,
  status,
}: {
  url: string;
  events: string[];
  status: string;
}) {
  return (
    <div className="flex items-start justify-between p-4 bg-slate-800/30 rounded-lg">
      <div className="flex-1">
        <div className="font-semibold text-white mb-1">{url}</div>
        <div className="text-xs text-slate-400 mb-2">{events.length} événements</div>
        <div className="flex flex-wrap gap-1">
          {events.map((event, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-800/50 rounded text-xs text-slate-300"
            >
              {event}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">
          Actif
        </span>
        <Button variant="ghost" size="sm">Modifier</Button>
      </div>
    </div>
  );
}

