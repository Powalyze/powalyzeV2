import "../globals.css";
import { Sidebar } from "@/components/cockpit/Sidebar";
import { Topbar } from "@/components/cockpit/Topbar";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function CockpitLayout({ children }: { children: React.ReactNode }) {
  // 🔒 MODE PRO: Vérifier authentification Supabase
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900/40">
          {children}
        </main>
      </div>
    </div>
  );
}

