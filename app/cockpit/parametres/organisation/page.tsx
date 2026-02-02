'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Building2, Globe, DollarSign, Languages, Upload, Save } from 'lucide-react';

/**
 * Page Configuration Organisation
 * Paramètres : Nom, Logo, Fuseau horaire, Devise, Langue
 * Restrictions : Demo = même accès, mais sans branding avancé
 */
export default function OrganisationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OrganisationContent />
    </Suspense>
  );
}

function OrganisationContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    timezone: 'Europe/Paris',
    currency: 'EUR',
    language: 'fr',
  });

  const timezones = [
    { value: 'Europe/Paris', label: 'Europe/Paris (GMT+1)' },
    { value: 'Europe/London', label: 'Europe/London (GMT+0)' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin (GMT+1)' },
    { value: 'America/New_York', label: 'America/New_York (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (GMT-8)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (GMT+9)' },
  ];

  const currencies = [
    { value: 'EUR', label: '€ Euro (EUR)' },
    { value: 'USD', label: '$ Dollar (USD)' },
    { value: 'GBP', label: '£ Livre (GBP)' },
    { value: 'CHF', label: 'CHF Franc suisse' },
    { value: 'NOK', label: 'kr Couronne norvégienne' },
  ];

  const languages = [
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'en', label: '🇬🇧 English' },
    { value: 'de', label: '🇩🇪 Deutsch' },
    { value: 'no', label: '🇳🇴 Norsk' },
    { value: 'es', label: '🇪🇸 Español' },
    { value: 'it', label: '🇮🇹 Italiano' },
  ];

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Non connecté');

      // Récupérer le profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, plan, pro_active')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setIsDemo(profile.plan === 'demo' || !profile.pro_active);
      setOrganizationId(profile.organization_id);

      // Récupérer l'organisation
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single();

      if (orgError) throw orgError;

      setFormData({
        name: org.name || '',
        logo_url: org.logo_url || '',
        timezone: org.timezone || 'Europe/Paris',
        currency: org.currency || 'EUR',
        language: org.language || 'fr',
      });
    } catch (err: any) {
      console.error('Erreur chargement:', err);
      alert(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !organizationId) return;

    try {
      // Upload vers Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${organizationId}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('organizations')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from('organizations')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, logo_url: urlData.publicUrl }));
    } catch (err: any) {
      console.error('Erreur upload:', err);
      alert(err.message || 'Erreur upload logo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: formData.name,
          logo_url: formData.logo_url,
          timezone: formData.timezone,
          currency: formData.currency,
          language: formData.language,
        })
        .eq('id', organizationId);

      if (error) throw error;

      alert('✅ Configuration sauvegardée');
    } catch (err: any) {
      console.error('Erreur sauvegarde:', err);
      alert(err.message || 'Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Configuration de l'organisation
          </h1>
          <p className="text-slate-400">
            Personnalisez les paramètres de votre organisation
          </p>
          {isDemo && (
            <div className="mt-4 bg-blue-500/10 border border-blue-500/50 rounded-lg p-3 text-sm text-blue-400">
              📌 Mode Demo — Fonctionnalités de branding avancé disponibles en Pro
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1C1F26] rounded-2xl p-8 space-y-6">
          {/* Nom de l'entreprise */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <Building2 className="w-5 h-5 text-[#D4AF37]" />
              Nom de l'entreprise
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
              placeholder="Votre Entreprise SA"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <Upload className="w-5 h-5 text-[#D4AF37]" />
              Logo de l'entreprise
            </label>
            <div className="flex items-center gap-4">
              {formData.logo_url && (
                <img
                  src={formData.logo_url}
                  alt="Logo"
                  className="w-16 h-16 rounded-lg object-cover bg-white"
                />
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoUpload}
                className="flex-1 px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#D4AF37] file:text-[#0A0F1C] file:font-semibold hover:file:bg-[#C4A037] transition"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              PNG, JPEG ou SVG. Taille recommandée : 200x200px
            </p>
          </div>

          {/* Fuseau horaire */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <Globe className="w-5 h-5 text-[#D4AF37]" />
              Fuseau horaire
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
            >
              {timezones.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          {/* Devise */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <DollarSign className="w-5 h-5 text-[#D4AF37]" />
              Devise
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
            >
              {currencies.map(curr => (
                <option key={curr.value} value={curr.value}>{curr.label}</option>
              ))}
            </select>
          </div>

          {/* Langue */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <Languages className="w-5 h-5 text-[#D4AF37]" />
              Langue
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0A0F1C] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Bouton Sauvegarder */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0A0F1C] font-semibold rounded-lg transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/cockpit')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
      <div className="text-white animate-pulse">Chargement de la configuration...</div>
    </div>
  );
}
