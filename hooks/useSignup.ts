// hooks/useSignup.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/services/auth';

export function useSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    company?: string,
    redirectTo?: string
  ) {
    setLoading(true);
    setError(null);

    const { error, needsEmailConfirmation } = await signup(
      email,
      password,
      firstName,
      lastName,
      company
    );

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (needsEmailConfirmation) {
      return { needsEmailConfirmation: true };
    }

    router.push(redirectTo || '/welcome'); // redirection après signup
    return { needsEmailConfirmation: false };
  }

  return { handleSignup, loading, error };
}
