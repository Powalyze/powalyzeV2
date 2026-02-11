"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Ne pas afficher le footer dans les pages cockpit
  if (pathname?.startsWith('/cockpit')) {
    return null;
  }
  
  return <Footer />;
}
