'use client';

import { CockpitShell } from '@/components/cockpit/CockpitShell';
import { Users, Mail, UserPlus, Shield, Settings } from 'lucide-react';

export default function EquipePage() {
  return (
    <CockpitShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestion d'équipe</h1>
            <p className="text-slate-400 mt-1">
              Invitez et gérez les membres de votre organisation
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg transition-all">
            <UserPlus size={18} />
            Inviter un membre
          </button>
        </div>

        {/* Équipe actuelle */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users size={20} className="text-amber-400" />
            Membres de l'équipe
          </h2>

          <div className="space-y-3">
            {/* Membre 1 - Toi */}
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <span className="text-slate-950 font-bold">V</span>
                </div>
                <div>
                  <p className="text-white font-medium">Vous</p>
                  <p className="text-sm text-slate-400">Admin • Propriétaire</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                  Admin
                </span>
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <Settings size={18} className="text-slate-400" />
                </button>
              </div>
            </div>

            {/* Message pour inviter */}
            <div className="p-6 text-center border-2 border-dashed border-slate-700 rounded-lg">
              <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-3">
                Invitez des collaborateurs pour partager vos projets et rapports
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all">
                <UserPlus size={16} />
                Envoyer une invitation
              </button>
            </div>
          </div>
        </div>

        {/* Rôles disponibles */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield size={20} className="text-emerald-400" />
            Rôles et permissions
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-white mb-2">Admin</h3>
              <p className="text-sm text-slate-400">
                Accès complet à tous les modules et la gestion d'équipe
              </p>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-white mb-2">Éditeur</h3>
              <p className="text-sm text-slate-400">
                Peut créer et modifier des projets, risques et décisions
              </p>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-white mb-2">Lecteur</h3>
              <p className="text-sm text-slate-400">
                Consultation uniquement des rapports et du cockpit
              </p>
            </div>
          </div>
        </div>
      </div>
    </CockpitShell>
  );
}
