/**
 * Micro-copies premium pour le cockpit Powalyze
 * FR: Ton exécutif, premium, concis
 * EN: Executive tone
 */

export type Language = 'fr' | 'en';

export const cockpitCopy = {
  fr: {
    // Header LIVE
    header: {
      title: 'Votre cockpit exécutif',
      subtitle: 'Pilotage stratégique en temps réel',
    },
    
    // Empty State LIVE
    emptyState: {
      title: 'Bienvenue dans votre cockpit Powalyze',
      subtitle: 'Créez votre premier projet pour activer votre pilotage exécutif.',
      cta: 'Créer mon premier projet',
      features: {
        analytics: 'Analytics en temps réel',
        analyticsDesc: 'Indicateurs et tendances actualisés',
        collaboration: 'Collaboration d\'équipe',
        collaborationDesc: 'Partagez et pilotez ensemble',
        reports: 'Rapports automatisés',
        reportsDesc: 'Documents exécutifs générés',
      },
      links: {
        demo: 'Voir la démo',
        documentation: 'Documentation',
        support: 'Support',
      },
    },
    
    // Mobile Navigation
    mobileNav: {
      projects: 'Projets',
      risks: 'Risques',
      decisions: 'Décisions',
      profile: 'Profil',
    },
    
    // Create Project Modal
    createProject: {
      title: 'Nouveau projet',
      placeholder: 'Nom du projet',
      description: 'Description (optionnel)',
      budget: 'Budget estimé',
      cta: 'Créer',
      cancel: 'Annuler',
      success: 'Votre projet est prêt',
      error: 'Erreur lors de la création',
    },
    
    // Project Card
    projectCard: {
      tasks: 'tâches',
      risks: 'risques',
      progress: 'Progression',
      status: {
        active: 'En cours',
        pending: 'En attente',
        completed: 'Terminé',
        blocked: 'Bloqué',
      },
    },
    
    // Common
    common: {
      loading: 'Chargement du cockpit...',
      new: 'Nouveau',
      back: 'Retour',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
    },
  },
  
  en: {
    // Header LIVE
    header: {
      title: 'Your Executive Cockpit',
      subtitle: 'Real-time strategic governance',
    },
    
    // Empty State LIVE
    emptyState: {
      title: 'Welcome to your Powalyze Cockpit',
      subtitle: 'Create your first project to activate your executive governance.',
      cta: 'Create my first project',
      features: {
        analytics: 'Real-time Analytics',
        analyticsDesc: 'Updated metrics and trends',
        collaboration: 'Team Collaboration',
        collaborationDesc: 'Share and govern together',
        reports: 'Automated Reports',
        reportsDesc: 'Generated executive documents',
      },
      links: {
        demo: 'View demo',
        documentation: 'Documentation',
        support: 'Support',
      },
    },
    
    // Mobile Navigation
    mobileNav: {
      projects: 'Projects',
      risks: 'Risks',
      decisions: 'Decisions',
      profile: 'Profile',
    },
    
    // Create Project Modal
    createProject: {
      title: 'New Project',
      placeholder: 'Project name',
      description: 'Description (optional)',
      budget: 'Estimated budget',
      cta: 'Create',
      cancel: 'Cancel',
      success: 'Your project is ready',
      error: 'Error creating project',
    },
    
    // Project Card
    projectCard: {
      tasks: 'tasks',
      risks: 'risks',
      progress: 'Progress',
      status: {
        active: 'Active',
        pending: 'Pending',
        completed: 'Completed',
        blocked: 'Blocked',
      },
    },
    
    // Common
    common: {
      loading: 'Loading cockpit...',
      new: 'New',
      back: 'Back',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
    },
  },
} as const;

/**
 * Hook pour récupérer les copies
 * Par défaut: FR (peut être étendu avec détection navigateur/user)
 */
export function useCockpitCopy(lang: Language = 'fr') {
  return cockpitCopy[lang];
}
