// hooks/useLogin.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(email: string, password: string) {
    setLoading(true);
    setError(null);

    const { error } = await login(email, password);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/cockpit'); // redirection après login
  }

  return { handleLogin, loading, error };
}
