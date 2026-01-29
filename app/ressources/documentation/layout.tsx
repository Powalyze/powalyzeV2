import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { Book, Home, ChevronRight } from 'lucide-react';

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
              <Link href="/" className="hover:text-amber-400 transition-colors">
                <Home size={16} />
              </Link>
              <ChevronRight size={14} />
              <Link href="/ressources/documentation" className="hover:text-amber-400 transition-colors">
                Documentation
              </Link>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-8">
              {/* Sidebar */}
              <aside className="lg:sticky lg:top-24 h-fit space-y-6">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center">
                      <Book className="text-amber-400" size={20} />
                    </div>
                    <h3 className="font-bold">Documentation</h3>
                  </div>
                  
                  <nav className="space-y-1">
                    <SidebarSection title="Tutoriels vidéo">
                      <SidebarLink href="/ressources/documentation/configuration-initiale">Configuration initiale</SidebarLink>
                      <SidebarLink href="/ressources/documentation/cockpit-agile">Cockpit Agile</SidebarLink>
                      <SidebarLink href="/ressources/documentation/powerbi-integration">Power BI Integration</SidebarLink>
                      <SidebarLink href="/ressources/documentation/ia-narrative">IA narrative</SidebarLink>
                      <SidebarLink href="/ressources/documentation/gestion-multi-projets">Multi-projets</SidebarLink>
                      <SidebarLink href="/ressources/documentation/api-webhooks">API & Webhooks</SidebarLink>
                    </SidebarSection>

                    <SidebarSection title="Bonnes pratiques">
                      <SidebarLink href="/ressources/documentation/cockpit-efficace">Cockpit efficace</SidebarLink>
                      <SidebarLink href="/ressources/documentation/structurer-backlog">Structurer backlog</SidebarLink>
                      <SidebarLink href="/ressources/documentation/matrice-risques">Matrice de risques</SidebarLink>
                      <SidebarLink href="/ressources/documentation/rapports-executifs">Rapports exécutifs</SidebarLink>
                    </SidebarSection>

                    <SidebarSection title="Guides utilisateurs">
                      <SidebarLink href="/ressources/documentation/guide-cockpit">Guide cockpit</SidebarLink>
                      <SidebarLink href="/ressources/documentation/gestion-projets">Gestion projets</SidebarLink>
                      <SidebarLink href="/ressources/documentation/cartographie-risques">Cartographie risques</SidebarLink>
                      <SidebarLink href="/ressources/documentation/registre-decisions">Registre décisions</SidebarLink>
                      <SidebarLink href="/ressources/documentation/rapports-ia">Rapports IA</SidebarLink>
                      <SidebarLink href="/ressources/documentation/methodologies">Méthodologies</SidebarLink>
                    </SidebarSection>

                    <SidebarSection title="API Reference">
                      <SidebarLink href="/ressources/documentation/api-overview">Overview</SidebarLink>
                      <SidebarLink href="/ressources/documentation/api-projects">Projects API</SidebarLink>
                      <SidebarLink href="/ressources/documentation/api-risks">Risks API</SidebarLink>
                      <SidebarLink href="/ressources/documentation/api-decisions">Decisions API</SidebarLink>
                      <SidebarLink href="/ressources/documentation/api-reports">Reports API</SidebarLink>
                      <SidebarLink href="/ressources/documentation/api-webhooks-events">Webhooks</SidebarLink>
                    </SidebarSection>

                    <SidebarSection title="Admin">
                      <SidebarLink href="/ressources/documentation/admin-configuration">Configuration</SidebarLink>
                      <SidebarLink href="/ressources/documentation/admin-utilisateurs">Utilisateurs</SidebarLink>
                      <SidebarLink href="/ressources/documentation/admin-workflows">Workflows</SidebarLink>
                      <SidebarLink href="/ressources/documentation/admin-templates">Templates</SidebarLink>
                      <SidebarLink href="/ressources/documentation/admin-notifications">Notifications</SidebarLink>
                      <SidebarLink href="/ressources/documentation/admin-securite">Sécurité</SidebarLink>
                    </SidebarSection>

                    <SidebarSection title="Intégrations">
                      <SidebarLink href="/ressources/documentation/integration-powerbi">Power BI</SidebarLink>
                      <SidebarLink href="/ressources/documentation/integration-jira">Jira</SidebarLink>
                      <SidebarLink href="/ressources/documentation/integration-azuredevops">Azure DevOps</SidebarLink>
                      <SidebarLink href="/ressources/documentation/integration-teams">Teams</SidebarLink>
                      <SidebarLink href="/ressources/documentation/integration-slack">Slack</SidebarLink>
                      <SidebarLink href="/ressources/documentation/integration-servicenow">ServiceNow</SidebarLink>
                    </SidebarSection>

                    <SidebarSection title="IA & Automatisations">
                      <SidebarLink href="/ressources/documentation/ia-narrative-config">Config IA narrative</SidebarLink>
                      <SidebarLink href="/ressources/documentation/ia-velocite">Vélocité Agile</SidebarLink>
                      <SidebarLink href="/ressources/documentation/ia-anomalies">Détection anomalies</SidebarLink>
                      <SidebarLink href="/ressources/documentation/ia-recommandations">Recommandations</SidebarLink>
                      <SidebarLink href="/ressources/documentation/ia-automatisations">Automatisations</SidebarLink>
                      <SidebarLink href="/ressources/documentation/ia-training">IA personnalisée</SidebarLink>
                    </SidebarSection>

                    <SidebarSection title="Sécurité">
                      <SidebarLink href="/ressources/documentation/securite-architecture">Architecture</SidebarLink>
                      <SidebarLink href="/ressources/documentation/securite-gdpr">GDPR</SidebarLink>
                      <SidebarLink href="/ressources/documentation/securite-certifications">Certifications</SidebarLink>
                      <SidebarLink href="/ressources/documentation/securite-auditlogs">Audit logs</SidebarLink>
                      <SidebarLink href="/ressources/documentation/securite-backup">Backup</SidebarLink>
                      <SidebarLink href="/ressources/documentation/securite-infrastructure">Infrastructure</SidebarLink>
                    </SidebarSection>
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <main>{children}</main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}
