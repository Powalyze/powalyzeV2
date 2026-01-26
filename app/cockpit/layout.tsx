import "../globals.css";
import { Sidebar } from "@/components/cockpit/Sidebar";
import { Topbar } from "@/components/cockpit/Topbar";

export default function CockpitLayout({ children }: { children: React.ReactNode }) {
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

