import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { BLOG_POSTS, getPostBySlug, slugifyCategory } from "@/lib/blogData";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24">
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/ressources/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour au blog
          </Link>

          <div className="mt-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs text-amber-400">
              <Tag size={12} />
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-6">
            {post.title}
          </h1>
          <p className="text-xl text-slate-300 mb-8">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-10">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-slate-800 mb-10">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover grayscale"
              loading="lazy"
            />
          </div>

          <article className="space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="text-2xl font-bold">{section.heading}</h2>
                {section.paragraphs.map((paragraph, idx) => (
                  <p key={idx} className="text-slate-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="list-disc list-inside space-y-2 text-slate-300">
                    {section.bullets.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          <div className="mt-12 pt-8 border-t border-slate-800">
            <Link
              href={`/ressources/blog/categorie/${slugifyCategory(post.category)}`}
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              Voir tous les articles « {post.category} »
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
