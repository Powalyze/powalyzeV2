import { notFound } from "next/navigation";

export const dynamic = "force-static";

export default function TestSupabasePage() {
  // Route désactivée après nettoyage.
  notFound();
}
