import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_POSTS, getPostsByCategorySlug } from "@/lib/blogData";

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export default function BlogCategoryPage({ params }: { params: { slug: string } }) {
  const posts = getPostsByCategorySlug(params.slug);
  const category = BLOG_CATEGORIES.find((cat) => cat.slug === params.slug);

  if (!category || posts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/ressources/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour au blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
            Catégorie : {category.name}
          </h1>
          <p className="text-slate-300 mb-10">
            {category.count} article{category.count > 1 ? "s" : ""} dans cette catégorie.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/ressources/blog/${post.slug}`}
                className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all group"
              >
                <div className="relative h-44 w-full overflow-hidden rounded-lg border border-slate-800 mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
