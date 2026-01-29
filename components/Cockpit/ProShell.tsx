"use client";

import { ReactNode } from "react";

export function ProShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        {children}
      </div>
    </div>
  );
}
