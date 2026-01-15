import { LayoutDashboard, Layers, AlertTriangle, CheckCircle, Bell, FileText, Settings, Users } from 'lucide-react';

export const navigationItems = [
  {
    id: 'cockpit',
    label: 'Cockpit',
    href: '/cockpit',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: 'portefeuille',
    label: 'Portefeuille',
    href: '/portefeuille',
    icon: Layers,
    badge: '42',
  },
  {
    id: 'risques',
    label: 'Risques',
    href: '/risques',
    icon: AlertTriangle,
    badge: '12',
  },
  {
    id: 'decisions',
    label: 'Décisions',
    href: '/decisions',
    icon: CheckCircle,
    badge: '7',
  },
  {
    id: 'anomalies',
    label: 'Anomalies',
    href: '/anomalies',
    icon: Bell,
    badge: '3',
  },
  {
    id: 'rapports',
    label: 'Rapports',
    href: '/rapports',
    icon: FileText,
    badge: null,
  },
];

export const bottomNavigationItems = [
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin',
    icon: Users,
  },
  {
    id: 'settings',
    label: 'Paramètres',
    href: '/settings',
    icon: Settings,
  },
];
