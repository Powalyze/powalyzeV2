"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { name: "Cockpit", href: "/cockpit", icon: "📊" },
  { name: "Portefeuille", href: "/cockpit/portefeuille", icon: "🗂️", count: 42 },
  { name: "Risques", href: "/cockpit/risques", icon: "⚠️", count: 12 },
  { name: "Décisions", href: "/cockpit/decisions", icon: "🧭", count: 7 },
  { name: "Anomalies", href: "/cockpit/anomalies", icon: "🐞", count: 3 },
  { name: "Rapports", href: "/cockpit/rapports", icon: "📄" },
  { name: "Connecteurs", href: "/cockpit/connecteurs", icon: "🔌" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="px-5 py-4 text-lg font-bold tracking-tight">
        Powalyze
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition 
                ${active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/60"}`}
            >
              <span className="flex items-center gap-2">
                <span>{item.icon}</span>
                {item.name}
              </span>

              {item.count && (
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
