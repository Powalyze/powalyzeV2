'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Search, Filter, Star, Download, Eye, Users, 
  TrendingUp, Building2, Heart, Rocket, Code, DollarSign,
  Award, Crown, ChevronDown, Check, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'tech' | 'pharma' | 'btp' | 'finance' | 'marketing';
  author: string;
  authorAvatar: string;
  downloads: number;
  rating: number;
  reviews: number;
  price: 'free' | 'pro';
  badge?: 'featured' | 'trending' | 'new';
  projects: number;
  preview: string;
}

const templates: Template[] = [
  {
    id: '1',
    title: 'Migration Cloud Azure',
    description: 'Template complet pour migrer infrastructure on-premise vers Azure avec phases, risques et budget pré-configurés',
    category: 'tech',
    author: 'Sarah Chen',
    authorAvatar: 'SC',
    downloads: 2847,
    rating: 4.9,
    reviews: 124,
    price: 'free',
    badge: 'featured',
    projects: 12,
    preview: '/templates/azure-migration.png'
  },
  {
    id: '2',
    title: 'Lancement Produit Pharma',
    description: 'Conforme FDA/EMA avec validation, essais cliniques phases I-III, et documentation réglementaire',
    category: 'pharma',
    author: 'Dr. Martin',
    authorAvatar: 'DM',
    downloads: 1456,
    rating: 5.0,
    reviews: 67,
    price: 'pro',
    badge: 'trending',
    projects: 8,
    preview: '/templates/pharma-launch.png'
  },
  {
    id: '3',
    title: 'Construction Immeuble',
    description: 'Planning BTP avec phases chantier, gestion sous-traitants, contrôles qualité et suivi budget matériaux',
    category: 'btp',
    author: 'Pierre Dubois',
    authorAvatar: 'PD',
    downloads: 3201,
    rating: 4.8,
    reviews: 189,
    price: 'free',
    badge: 'featured',
    projects: 15,
    preview: '/templates/construction.png'
  },
  {
    id: '4',
    title: 'Audit Financier Complet',
    description: 'Template audit avec contrôles internes, revue comptable, analyse risques fraude et rapports conformité',
    category: 'finance',
    author: 'Emma Laurent',
    authorAvatar: 'EL',
    downloads: 892,
    rating: 4.7,
    reviews: 43,
    price: 'pro',
    projects: 6,
    preview: '/templates/audit.png'
  },
  {
    id: '5',
    title: 'Campagne Marketing 360°',
    description: 'Multi-canal avec social media, SEO/SEM, content marketing, tracking ROI et A/B testing intégré',
    category: 'marketing',
    author: 'Alex Martin',
    authorAvatar: 'AM',
    downloads: 4521,
    rating: 4.9,
    reviews: 276,
    price: 'free',
    badge: 'trending',
    projects: 18,
    preview: '/templates/marketing.png'
  },
  {
    id: '6',
    title: 'Développement App Mobile',
    description: 'Sprint Agile pré-configuré avec backlog, user stories, review/retro et intégration CI/CD',
    category: 'tech',
    author: 'Kevin Zhang',
    authorAvatar: 'KZ',
    downloads: 3876,
    rating: 4.8,
    reviews: 198,
    price: 'free',
    badge: 'new',
    projects: 20,
    preview: '/templates/mobile-app.png'
  },
  {
    id: '7',
    title: 'Essai Clinique Phase III',
    description: 'Protocole complet avec randomisation, suivi patients, analyse statistique et monitoring DSMB',
    category: 'pharma',
    author: 'Dr. Sophie',
    authorAvatar: 'DS',
    downloads: 687,
    rating: 5.0,
    reviews: 34,
    price: 'pro',
    projects: 4,
    preview: '/templates/clinical.png'
  },
  {
    id: '8',
    title: 'Rénovation Énergétique',
    description: 'Audit thermique, isolation, chauffage, aide CEE et certification énergétique A/B/C',
    category: 'btp',
    author: 'Julien Roux',
    authorAvatar: 'JR',
    downloads: 1923,
    rating: 4.6,
    reviews: 87,
    price: 'free',
    projects: 10,
    preview: '/templates/renovation.png'
  }
];

const categories = [
  { id: 'all', label: 'Tous', icon: Sparkles, color: 'blue' },
  { id: 'tech', label: 'Tech & IT', icon: Code, color: 'purple' },
  { id: 'pharma', label: 'Pharma & Santé', icon: Heart, color: 'red' },
  { id: 'btp', label: 'BTP & Construction', icon: Building2, color: 'amber' },
  { id: 'finance', label: 'Finance & Audit', icon: DollarSign, color: 'emerald' },
  { id: 'marketing', label: 'Marketing & Growth', icon: TrendingUp, color: 'pink' }
];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'recent'>('popular');

  const filteredTemplates = templates
    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
    .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'popular') return b.downloads - a.downloads;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const stats = [
    { label: 'Templates', value: '156', icon: Sparkles },
    { label: 'Téléchargements', value: '47K+', icon: Download },
    { label: 'Note moyenne', value: '4.8/5', icon: Star },
    { label: 'Secteurs', value: '12', icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Navigation Premium - Aligned with homepage */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#E5C158] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <span className="text-2xl font-bold text-[#0A0F1C]">P</span>
              </div>
              <span className="text-xl font-bold text-white">POWALYZE</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#cockpit" className="text-[#9CA3AF] hover:text-white transition-colors">
                Cockpit
              </Link>
              <Link href="/templates" className="text-white font-semibold">
                Templates
              </Link>
              <Link href="/#tarifs" className="text-[#9CA3AF] hover:text-white transition-colors">
                Tarifs
              </Link>
              <Link href="/parrainage" className="text-[#9CA3AF] hover:text-white transition-colors">
                Parrainage
              </Link>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <Link 
                href="/pro" 
                className="text-[#9CA3AF] hover:text-white transition-colors text-sm"
              >
                Dashboard
              </Link>
              <Link 
                href="/auth/demo/signup" 
                className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#0A0F1C] font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
              >
                Essayer gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3BA9FF]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block px-6 py-2 mb-6 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30"
          >
            <span className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Template Marketplace
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Démarrez en <span className="bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] bg-clip-text text-transparent">30 secondes</span>
          </h1>
          
          <p className="text-xl text-[#9CA3AF] max-w-3xl mx-auto mb-8">
            156 templates sectoriels créés par des experts. Import 1-clic, personnalisable à l'infini.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#111827] to-[#020617] border border-[#1F2937] rounded-xl p-4"
              >
                <stat.icon className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#D4AF37] mb-1">{stat.value}</div>
                <div className="text-sm text-[#6B7280]">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Rechercher un template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#111827] border border-[#1F2937] text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2
                  ${isActive 
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30' 
                    : 'bg-[#111827] text-[#9CA3AF] border border-[#1F2937] hover:bg-[#1F2937]'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </motion.button>
            );
          })}
        </div>

        {/* Sort & Filter */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-[#9CA3AF]">
            <span className="font-medium text-white">{filteredTemplates.length}</span> templates trouvés
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-lg bg-[#111827] border border-[#1F2937] text-[#9CA3AF] hover:bg-[#1F2937] transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Trier par"
              className="px-4 py-2 rounded-lg bg-[#111827] border border-[#1F2937] text-white focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option value="popular">Plus populaires</option>
              <option value="rating">Meilleures notes</option>
              <option value="recent">Plus récents</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#111827] to-[#020617] border border-[#1F2937] rounded-xl overflow-hidden hover:border-[#D4AF37]/30 transition-all group shadow-lg"
            >
              {/* Preview Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-[#1F2937] to-[#111827] flex items-center justify-center">
                {template.badge && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-white border border-white/20">
                    {template.badge === 'featured' && '⭐ Vedette'}
                    {template.badge === 'trending' && '🔥 Tendance'}
                    {template.badge === 'new' && '✨ Nouveau'}
                  </div>
                )}
                
                {template.price === 'pro' && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Crown className="w-3 h-3 inline mr-1" />
                    PRO
                  </div>
                )}

                <div className="text-6xl opacity-20">
                  {template.category === 'tech' && '💻'}
                  {template.category === 'pharma' && '💊'}
                  {template.category === 'btp' && '🏗️'}
                  {template.category === 'finance' && '💰'}
                  {template.category === 'marketing' && '📈'}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                  {template.title}
                </h3>
                
                <p className="text-[#9CA3AF] text-sm mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-[#6B7280]">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                    <span className="text-white font-medium">{template.rating}</span>
                    <span>({template.reviews})</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{template.downloads.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Rocket className="w-4 h-4" />
                    <span>{template.projects} projets</span>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#1F2937]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E5C158] flex items-center justify-center text-[#0A0F1C] text-xs font-bold">
                    {template.authorAvatar}
                  </div>
                  <span className="text-sm text-[#9CA3AF]">{template.author}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#0A0F1C] font-semibold transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Utiliser
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-[#111827] border border-[#1F2937] text-[#9CA3AF] hover:bg-[#1F2937] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-br from-[#111827] to-[#020617] rounded-2xl border border-[#D4AF37]/30 p-8 md:p-12 text-center"
        >
          <Award className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Partagez vos templates
          </h2>
          <p className="text-[#9CA3AF] mb-6 max-w-2xl mx-auto">
            Devenez créateur et gagnez des badges exclusifs. Les meilleurs templates sont mis en vedette.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#0A0F1C] font-semibold transition-all shadow-lg shadow-[#D4AF37]/20 inline-flex items-center gap-2"
          >
            Publier un template
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
        </div>
      </section>
    </div>
  );
}
