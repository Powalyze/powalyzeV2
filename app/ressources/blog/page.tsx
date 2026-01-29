import Link from "next/link";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_POSTS, getFeaturedPost } from "@/lib/blogData";

export default function BlogPage() {
  const featured = getFeaturedPost() ?? BLOG_POSTS[0];
  const recentPosts = BLOG_POSTS.filter((post) => post.slug !== featured?.slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Blog Powalyze</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Analyses, retours d'expérience et bonnes pratiques sur la gouvernance de portefeuilles complexes.
            Retrouvez ici tous les articles publiés par nos experts PMO, Data & IA.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {featured && (
            <FeaturedArticle
              title={featured.title}
              excerpt={featured.excerpt}
              author={featured.author}
              date={featured.date}
              category={featured.category}
              readTime={featured.readTime}
              image={featured.image}
              href={`/ressources/blog/${featured.slug}`}
            />
          )}
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Tous les articles</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <ArticleCard
                key={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                author={post.author}
                date={post.date}
                readTime={post.readTime}
                category={post.category}
                image={post.image}
                href={`/ressources/blog/${post.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Catégories</h2>

          <div className="grid md:grid-cols-4 gap-4">
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/ressources/blog/categorie/${cat.slug}`}
                className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all text-center"
              >
                <div className="font-semibold mb-1">{cat.name}</div>
                <div className="text-sm text-slate-400">{cat.count} articles</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Restez informé
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Recevez nos derniers articles et analyses directement dans votre boîte mail (1x par mois)
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <label className="sr-only" htmlFor="newsletter-email">Adresse email</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="votre@email.com"
              className="px-6 py-4 rounded-lg bg-slate-900 border border-slate-800 focus:border-amber-500 outline-none flex-1"
            />
            <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold transition-all">
              S'abonner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedArticle({ title, excerpt, author, date, category, readTime, image, href }: {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block p-12 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/30 hover:border-amber-500/50 transition-all group"
    >
      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-amber-500/20 mb-6">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all"
          loading="lazy"
        />
      </div>
      <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-semibold mb-6">
        ⭐ Article phare
      </div>
      <h2 className="text-4xl font-bold mb-6 group-hover:text-amber-400 transition-colors">
        {title}
      </h2>
      <p className="text-xl text-slate-300 mb-8 leading-relaxed">
        {excerpt}
      </p>
      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{author}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{readTime}</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-slate-800 text-amber-400">
          {category}
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ title, excerpt, author, date, readTime, category, image, href }: {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group"
    >
      <div className="relative h-44 w-full overflow-hidden rounded-lg border border-slate-800 mb-4">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all"
          loading="lazy"
        />
      </div>
      <div className="mb-4">
        <span className="px-2 py-1 rounded-full bg-slate-800 text-xs text-slate-400">{category}</span>
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
        {excerpt}
      </p>
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
        <div className="flex items-center gap-1">
          <User size={14} />
          <span>{author}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{readTime}</span>
        </div>
      </div>
      <div className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm group-hover:gap-3 transition-all">
        Lire l'article
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}
