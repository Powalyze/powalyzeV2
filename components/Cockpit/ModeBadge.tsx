"use client";

import { useEffect, useState } from "react";
import { Shield, Zap } from "lucide-react";

export function ModeBadge() {
  const [mode, setMode] = useState<"demo" | "pro">("demo");

  useEffect(() => {
    // TODO: Récupérer le mode depuis getModeConfig()
    setMode("demo");
  }, []);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
      mode === "demo" 
        ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" 
        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
    }`}>
      {mode === "demo" ? <Shield className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
      <span className="text-xs font-semibold uppercase">
        {mode === "demo" ? "MODE DÉMO" : "MODE PRO"}
      </span>
    </div>
  );
}
