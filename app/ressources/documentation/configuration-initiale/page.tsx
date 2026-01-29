import { Download, Clock, Target, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ConfigurationInitialePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center">
            <Clock className="text-amber-400" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Configuration initiale</h1>
            <p className="text-slate-400 mt-1">Démarrez avec Powalyze en 10 minutes</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <Clock size={16} />
            10 minutes
          </span>
          <span className="flex items-center gap-2">
            <Target size={16} />
            Débutant
          </span>
        </div>
      </div>

      {/* Résumé */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h2 className="text-xl font-bold mb-3">Résumé</h2>
        <p className="text-slate-300 leading-relaxed">
          Ce tutoriel vous guide pas à pas dans la configuration de votre premier cockpit exécutif. 
          Vous apprendrez à créer votre organisation, configurer les paramètres de base, inviter votre équipe 
          et personnaliser votre tableau de bord selon vos besoins.
        </p>
      </div>

      {/* Objectifs */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Objectifs d'apprentissage</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ObjectiveCard
            title="Créer votre compte"
            description="Inscription et activation de votre espace"
          />
          <ObjectiveCard
            title="Configurer l'organisation"
            description="Paramétrer nom, logo et préférences"
          />
          <ObjectiveCard
            title="Inviter votre équipe"
            description="Ajouter des collaborateurs et définir les rôles"
          />
          <ObjectiveCard
            title="Personnaliser le cockpit"
            description="Adapter l'interface à vos besoins"
          />
        </div>
      </div>

      {/* Étapes détaillées */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Étapes détaillées</h2>
        <div className="space-y-6">
          <Step
            number={1}
            title="Créer votre compte Powalyze"
            content={
              <div className="space-y-3">
                <p>1. Rendez-vous sur <Link href="/inscription" className="text-amber-400 hover:underline">www.powalyze.com/inscription</Link></p>
                <p>2. Remplissez le formulaire avec vos informations professionnelles</p>
                <p>3. Validez votre email via le lien envoyé dans votre boîte de réception</p>
                <p>4. Choisissez votre forfait (Demo, Pro ou Enterprise)</p>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mt-4">
                  <p className="text-sm text-amber-200">
                    💡 <strong>Astuce :</strong> Commencez avec le forfait Demo gratuit pour explorer toutes les fonctionnalités sans engagement.
                  </p>
                </div>
              </div>
            }
          />

          <Step
            number={2}
            title="Configurer votre organisation"
            content={
              <div className="space-y-3">
                <p>1. Accédez à <strong>Paramètres → Organisation</strong></p>
                <p>2. Renseignez le nom de votre entreprise</p>
                <p>3. Téléchargez votre logo (format PNG ou SVG recommandé)</p>
                <p>4. Définissez votre fuseau horaire et devise</p>
                <p>5. Configurez vos préférences linguistiques</p>
                <CodeBlock>
{`// Exemple de structure organisation
{
  "nom": "Votre Entreprise SA",
  "logo": "https://...",
  "fuseau_horaire": "Europe/Paris",
  "devise": "EUR",
  "langue": "fr"
}`}
                </CodeBlock>
              </div>
            }
          />

          <Step
            number={3}
            title="Inviter votre équipe"
            content={
              <div className="space-y-3">
                <p>1. Allez dans <strong>Cockpit → Équipe</strong></p>
                <p>2. Cliquez sur "Inviter un membre"</p>
                <p>3. Saisissez l'email du collaborateur</p>
                <p>4. Attribuez un rôle : Admin, Éditeur ou Lecteur</p>
                <p>5. Personnalisez le message d'invitation (optionnel)</p>
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-amber-400">Rôles disponibles :</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li><strong>Admin :</strong> Accès complet, gestion utilisateurs et facturation</li>
                    <li><strong>Éditeur :</strong> Création et modification des projets, risques, décisions</li>
                    <li><strong>Lecteur :</strong> Consultation uniquement, aucune modification</li>
                  </ul>
                </div>
              </div>
            }
          />

          <Step
            number={4}
            title="Personnaliser votre cockpit"
            content={
              <div className="space-y-3">
                <p>1. Accédez à <strong>Cockpit → Accueil</strong></p>
                <p>2. Cliquez sur "Personnaliser" en haut à droite</p>
                <p>3. Organisez les widgets par glisser-déposer</p>
                <p>4. Activez/désactivez les modules selon vos besoins</p>
                <p>5. Configurez les KPI prioritaires à afficher</p>
                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  <FeatureCard
                    title="Projets actifs"
                    description="Suivi temps réel des initiatives"
                  />
                  <FeatureCard
                    title="Matrice des risques"
                    description="Cartographie visuelle des menaces"
                  />
                  <FeatureCard
                    title="Registre des décisions"
                    description="Traçabilité complète"
                  />
                  <FeatureCard
                    title="Power BI"
                    description="Rapports et dashboards"
                  />
                </div>
              </div>
            }
          />

          <Step
            number={5}
            title="Créer votre premier projet"
            content={
              <div className="space-y-3">
                <p>1. Allez dans <strong>Cockpit → Projets</strong></p>
                <p>2. Cliquez sur "Nouveau projet"</p>
                <p>3. Remplissez les informations essentielles :</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                  <li>Nom du projet</li>
                  <li>Description et objectifs</li>
                  <li>Chef de projet / Owner</li>
                  <li>Date de début et échéance</li>
                  <li>Budget alloué</li>
                  <li>Statut initial (Planification, En cours, etc.)</li>
                </ul>
                <p>4. Associez des tags pour faciliter le filtrage</p>
                <p>5. Validez et accédez au détail du projet</p>
              </div>
            }
          />
        </div>
      </div>

      {/* Bonnes pratiques */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
        <h2 className="text-2xl font-bold mb-4">Bonnes pratiques</h2>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
            <span><strong>Commencez simple :</strong> Configurez d'abord les éléments essentiels avant d'activer les fonctionnalités avancées</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
            <span><strong>Définissez les rôles clairement :</strong> Attribuez les permissions selon les responsabilités réelles</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
            <span><strong>Personnalisez progressivement :</strong> Testez les widgets un par un pour comprendre leur valeur</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
            <span><strong>Formez votre équipe :</strong> Organisez une session de 30 minutes pour présenter l'outil</span>
          </li>
        </ul>
      </div>

      {/* Liens */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Modules associés</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <RelatedLink
            href="/ressources/documentation/guide-cockpit"
            title="Guide complet du cockpit"
            description="Explorez toutes les fonctionnalités"
          />
          <RelatedLink
            href="/ressources/documentation/gestion-projets"
            title="Gestion des projets"
            description="Apprenez à piloter vos initiatives"
          />
          <RelatedLink
            href="/ressources/documentation/admin-utilisateurs"
            title="Gestion des utilisateurs"
            description="Maîtrisez les permissions"
          />
        </div>
      </div>

      {/* Download */}
      <div className="flex justify-center pt-8">
        <a
          href="/docs/configuration-initiale.pdf"
          className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
        >
          <Download size={20} />
          Télécharger le guide PDF
        </a>
      </div>
    </div>
  );
}

function ObjectiveCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function Step({ number, title, content }: { number: number; title: string; content: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <div className="text-slate-300">{content}</div>
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto text-sm">
      <code className="text-green-400">{children}</code>
    </pre>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}

function RelatedLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="block p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-colors group"
    >
      <h3 className="font-semibold mb-1 group-hover:text-amber-400 transition-colors">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </Link>
  );
}
