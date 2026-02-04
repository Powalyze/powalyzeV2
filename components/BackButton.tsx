"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Props = {
  fallback?: string;
  label?: string;
};

export function BackButton({ fallback = "/cockpit-executive", label = "Retour" }: Props) {
  const router = useRouter();

  function handleClick() {
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
