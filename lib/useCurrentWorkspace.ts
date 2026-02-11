"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export function useCurrentWorkspace() {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        setWorkspaceId(null);
        setLoading(false);
        return;
      }

      // 1. Essayer workspace_id depuis user_metadata
      let ws = user.user_metadata?.workspace_id || null;

      // 2. Si pas trouvé, essayer de récupérer depuis la table users
      if (!ws && user.id) {
        const { data: userData } = await supabase
          .from('users')
          .select('tenant_id')
          .eq('id', user.id)
          .maybeSingle();
        
        ws = userData?.tenant_id || null;
      }

      setWorkspaceId(ws);
      setLoading(false);
    }

    load();
  }, []);

  return { workspaceId, loading };
}
