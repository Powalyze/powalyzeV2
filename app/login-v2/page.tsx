// ============================================================
// POWALYZE V2 — LOGIN PAGE
// ============================================================

import LoginForm from '@/components/auth/LoginFormV2';

export const metadata = {
  title: 'Connexion | Powalyze',
  description: 'Connectez-vous à votre cockpit exécutif Powalyze',
};

export default function LoginPage() {
  return <LoginForm />;
}
