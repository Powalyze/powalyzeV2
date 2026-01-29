import { Download, Shield } from 'lucide-react';
export default function AdminSecuritePage() {
  return (<div className="space-y-8"><div className="border-b border-slate-800 pb-6"><h1 className="text-4xl font-bold">Paramètres de sécurité</h1></div><div className="space-y-6"><p className="text-slate-300">2FA, SSO, IP whitelisting, gestion des sessions, audit logs.</p></div><div className="flex justify-center pt-8"><a href="/docs/admin-securite.pdf" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg"><Download size={20} />Télécharger le PDF</a></div></div>);
}
