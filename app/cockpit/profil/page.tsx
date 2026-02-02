"use client";

import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { User, Mail, Building, Globe, Bell, Shield, Palette, Save, LogOut } from "lucide-react";

type Language = "fr" | "en" | "de" | "it";
type Theme = "dark" | "light" | "auto";

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security" | "notifications">("profile");
  const [language, setLanguage] = useState<Language>("fr");
  const [theme, setTheme] = useState<Theme>("dark");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    role: "member"
  });

  const initials = useMemo(() => {
    const first = profile.firstName?.trim()?.[0] || "";
    const last = profile.lastName?.trim()?.[0] || "";
    return (first + last).toUpperCase() || "P";
  }, [profile.firstName, profile.lastName]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          setError("Impossible de charger le profil");
          setLoading(false);
          return;
        }

        const user = userData.user;
        const { data: dbProfile } = await supabase
          .from("profiles")
          .select("first_name,last_name,company,role,email")
          .eq("id", user.id)
          .single();

        setProfile({
          firstName: dbProfile?.first_name || user.user_metadata?.first_name || "",
          lastName: dbProfile?.last_name || user.user_metadata?.last_name || "",
          company: dbProfile?.company || user.user_metadata?.company || "",
          email: dbProfile?.email || user.email || "",
          role: dbProfile?.role || "member"
        });
      } catch {
        setError("Impossible de charger le profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setError("Session invalide");
        return;
      }

      const user = userData.user;
      // Tenter insert, puis update si existe déjà
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: profile.email || user.email,
          first_name: profile.firstName,
          last_name: profile.lastName,
          company: profile.company || null,
          role: profile.role
        });

      // Si duplicate (23505), faire un update à la place
      if (insertError?.code === '23505') {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            email: profile.email || user.email,
            first_name: profile.firstName,
            last_name: profile.lastName,
            company: profile.company || null,
            role: profile.role
          })
          .eq('id', user.id);
        
        if (updateError) {
          setError(updateError.message);
          return;
        }
      } else if (insertError) {
        setError(insertError.message);
        return;
      }

      await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          company: profile.company || null
        }
      });
    } catch {
      setError("Impossible d'enregistrer le profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CockpitShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profil & Paramètres</h1>
          <p className="text-slate-400">Gérez vos informations personnelles et préférences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto">
          <TabButton
            label="Profil"
            icon={<User size={18} />}
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <TabButton
            label="Préférences"
            icon={<Palette size={18} />}
            active={activeTab === "preferences"}
            onClick={() => setActiveTab("preferences")}
          />
          <TabButton
            label="Sécurité"
            icon={<Shield size={18} />}
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
          />
          <TabButton
            label="Notifications"
            icon={<Bell size={18} />}
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          />
        </div>

        {/* Content */}
        {activeTab === "profile" && (
          <ProfileTab
            loading={loading}
            saving={saving}
            error={error}
            initials={initials}
            profile={profile}
            setProfile={setProfile}
            onSave={handleSave}
          />
        )}
        {activeTab === "preferences" && <PreferencesTab language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "notifications" && <NotificationsTab />}
      </div>
    </CockpitShell>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
        active
          ? "bg-amber-500 text-slate-950"
          : "text-slate-400 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ProfileTab({
  loading,
  saving,
  error,
  initials,
  profile,
  setProfile,
  onSave
}: {
  loading: boolean;
  saving: boolean;
  error: string | null;
  initials: string;
  profile: { firstName: string; lastName: string; company: string; email: string; role: string };
  setProfile: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string; company: string; email: string; role: string }>>;
  onSave: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-slate-950">{initials}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : "Utilisateur"}
            </h2>
            <p className="text-slate-400">{profile.role === "admin" ? "Administrateur" : "Membre"}</p>
          </div>
        </div>

        {loading && (
          <div className="mb-6 text-slate-400">Chargement du profil...</div>
        )}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <FormField
            label="Prénom"
            icon={<User size={20} />}
            value={profile.firstName}
            onChange={(value) => setProfile((prev) => ({ ...prev, firstName: value }))}
          />
          <FormField
            label="Nom"
            icon={<User size={20} />}
            value={profile.lastName}
            onChange={(value) => setProfile((prev) => ({ ...prev, lastName: value }))}
          />
          <FormField
            label="Email"
            icon={<Mail size={20} />}
            value={profile.email}
            readonly
          />
          <FormField
            label="Société"
            icon={<Building size={20} />}
            value={profile.company}
            onChange={(value) => setProfile((prev) => ({ ...prev, company: value }))}
            placeholder="Votre société"
          />
          <FormField
            label="Rôle"
            icon={<Shield size={20} />}
            value={profile.role === "admin" ? "Administrateur" : "Membre"}
            readonly
          />
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-semibold transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <Save size={20} />
            <span>{saving ? "Enregistrement..." : "Enregistrer"}</span>
          </button>
          <button className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors">
            Annuler
          </button>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30">
        <h3 className="text-lg font-bold text-red-400 mb-2">Zone dangereuse</h3>
        <p className="text-slate-400 mb-4">
          Supprimer votre compte et toutes vos données de manière permanente
        </p>
        <button className="px-6 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 font-semibold transition-colors">
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}

function PreferencesTab({ language, setLanguage, theme, setTheme }: { language: Language; setLanguage: (l: Language) => void; theme: Theme; setTheme: (t: Theme) => void }) {
  return (
    <div className="space-y-6">
      {/* Language */}
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <Globe size={24} className="text-amber-400" />
          <h3 className="text-xl font-bold">Langue de l'interface</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <LanguageOption
            code="fr"
            label="Français"
            flag="🇫🇷"
            selected={language === "fr"}
            onClick={() => setLanguage("fr")}
          />
          <LanguageOption
            code="en"
            label="English"
            flag="🇬🇧"
            selected={language === "en"}
            onClick={() => setLanguage("en")}
          />
          <LanguageOption
            code="de"
            label="Deutsch"
            flag="🇩🇪"
            selected={language === "de"}
            onClick={() => setLanguage("de")}
          />
          <LanguageOption
            code="it"
            label="Italiano"
            flag="🇮🇹"
            selected={language === "it"}
            onClick={() => setLanguage("it")}
          />
        </div>
      </div>

      {/* Theme */}
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <Palette size={24} className="text-purple-400" />
          <h3 className="text-xl font-bold">Thème visuel</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <ThemeOption
            value="dark"
            label="Sombre"
            selected={theme === "dark"}
            onClick={() => setTheme("dark")}
          />
          <ThemeOption
            value="light"
            label="Clair"
            selected={theme === "light"}
            onClick={() => setTheme("light")}
          />
          <ThemeOption
            value="auto"
            label="Automatique"
            selected={theme === "auto"}
            onClick={() => setTheme("auto")}
          />
        </div>
      </div>

      {/* Other Preferences */}
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-6">Autres préférences</h3>
        <div className="space-y-4">
          <ToggleOption
            label="Activer les animations"
            description="Transitions et effets visuels"
            enabled={true}
          />
          <ToggleOption
            label="Format date européen"
            description="DD/MM/YYYY au lieu de MM/DD/YYYY"
            enabled={true}
          />
          <ToggleOption
            label="Afficher les tooltips"
            description="Bulles d'aide sur les éléments interactifs"
            enabled={true}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-bold transition-all flex items-center gap-2">
          <Save size={20} />
          <span>Enregistrer les préférences</span>
        </button>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-6">Changer le mot de passe</h3>
        <div className="space-y-4">
          <label htmlFor="current-password" className="sr-only">Mot de passe actuel</label>
          <input
            id="current-password"
            type="password"
            placeholder="Mot de passe actuel"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <label htmlFor="new-password" className="sr-only">Nouveau mot de passe</label>
          <input
            id="new-password"
            type="password"
            placeholder="Nouveau mot de passe"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <label htmlFor="confirm-password" className="sr-only">Confirmer le nouveau mot de passe</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <button className="mt-6 px-6 py-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
          Mettre à jour le mot de passe
        </button>
      </div>

      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-4">Authentification à deux facteurs (2FA)</h3>
        <p className="text-slate-400 mb-6">
          Ajoutez une couche de sécurité supplémentaire avec la double authentification
        </p>
        <button className="px-6 py-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 hover:text-green-300 font-semibold transition-colors">
          Activer la 2FA
        </button>
      </div>

      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-4">Sessions actives</h3>
        <div className="space-y-3">
          <SessionCard
            device="Chrome sur Windows"
            location="Genève, Suisse"
            current={true}
          />
          <SessionCard
            device="Safari sur iPhone"
            location="Zurich, Suisse"
            current={false}
          />
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-6">Notifications par email</h3>
        <div className="space-y-4">
          <ToggleOption
            label="Nouveaux risques critiques"
            description="Recevoir un email quand un risque critique est détecté"
            enabled={true}
          />
          <ToggleOption
            label="Décisions en attente"
            description="Rappel quotidien des décisions à valider"
            enabled={true}
          />
          <ToggleOption
            label="Rapports générés"
            description="Notification quand un rapport est prêt"
            enabled={false}
          />
          <ToggleOption
            label="Résumé hebdomadaire"
            description="Résumé du portefeuille tous les lundis"
            enabled={true}
          />
        </div>
      </div>

      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold mb-6">Notifications in-app</h3>
        <div className="space-y-4">
          <ToggleOption
            label="Mentions et commentaires"
            description="Quand quelqu'un vous mentionne ou commente"
            enabled={true}
          />
          <ToggleOption
            label="Changements de statut"
            description="Quand un projet change de statut"
            enabled={true}
          />
          <ToggleOption
            label="Alertes budget"
            description="Quand un budget dépasse le seuil défini"
            enabled={true}
          />
        </div>
      </div>
    </div>
  );
}

function FormField({ label, icon, value, readonly, onChange, placeholder }: { label: string; icon: React.ReactNode; value: string; readonly?: boolean; onChange?: (value: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-400 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readonly}
          className={`w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 ${
            readonly ? "cursor-not-allowed opacity-50" : ""
          }`}
        />
      </div>
    </div>
  );
}

function LanguageOption({ code, label, flag, selected, onClick }: { code: string; label: string; flag: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        selected
          ? "border-amber-500 bg-amber-500/10"
          : "border-slate-800 bg-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{flag}</span>
        <span className="font-semibold">{label}</span>
      </div>
    </button>
  );
}

function ThemeOption({ value, label, selected, onClick }: { value: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        selected
          ? "border-amber-500 bg-amber-500/10"
          : "border-slate-800 bg-slate-800 hover:border-slate-700"
      }`}
    >
      <span className="font-semibold">{label}</span>
    </button>
  );
}

function ToggleOption({ label, description, enabled }: { label: string; description: string; enabled: boolean }) {
  return (
    <div className="flex items-start justify-between p-4 rounded-lg bg-slate-800">
      <div className="flex-1">
        <h4 className="font-semibold mb-1">{label}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <button
        className={`w-12 h-6 rounded-full transition-colors ${
          enabled ? "bg-green-500" : "bg-slate-700"
        }`}
        aria-label={`Basculer ${label}`}
        title={`Basculer ${label}`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SessionCard({ device, location, current }: { device: string; location: string; current: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-slate-700">
      <div>
        <h4 className="font-semibold mb-1">{device}</h4>
        <p className="text-sm text-slate-400">{location}</p>
        {current && (
          <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            Session actuelle
          </span>
        )}
      </div>
      {!current && (
        <button className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 text-sm font-semibold transition-colors flex items-center gap-2">
          <LogOut size={14} />
          <span>Déconnecter</span>
        </button>
      )}
    </div>
  );
}
