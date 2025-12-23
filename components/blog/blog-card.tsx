import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    imageUrl: string | null;
    publishedAt: Date | null;
    themes?: {
      name: string;
      slug: string;
    }[];
  };
  className?: string;
  index?: number;
}

export function BlogCard({ post, className, index = 0 }: BlogCardProps) {
  // Truncate excerpt
  const truncatedExcerpt = post.excerpt
    ? post.excerpt.length > 120
      ? post.excerpt.substring(0, 120) + "..."
      : post.excerpt
    : "Découvrez cet article...";

  const wordCount = post?.content ? post.content.split(" ").length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-5 hover:shadow-xl",
        index % 2 === 0 ? "shadow-blog-blue" : "shadow-blog-green",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {post.themes && post.themes.length > 0 && (
          <div className="absolute right-4 top-4 z-20 flex flex-wrap gap-2">
            {post.themes.slice(0, 2).map((theme) => (
              <span
                key={theme.slug}
                className="rounded-full bg-white/90 shadow-md border-[#0000004f] border px-3 py-1 text-xs font-sans font-semibold "
              >
                {theme.name}
              </span>
            ))}
          </div>
        )}

        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100">
            <span className="text-6xl font-bold text-slate-200">
              {post.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {/* Meta Data */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {post.publishedAt && (
            <div className="flex items-center gap-1.5 font-sans">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.publishedAt.toISOString()}>
                {format(new Date(post.publishedAt), "d MMM yyyy", {
                  locale: fr,
                })}
              </time>
            </div>
          )}
          <div className="flex items-center font-sans gap-1.5">
            <Clock className="h-3.5 w-3.5 " />
            <span>{readingTime} min</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-xl font-bold font-sans leading-tight text-slate-900 transition-colors group-hover:text-primary md:text-2xl">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-6 line-clamp-3 text-base font-sans leading-relaxed text-muted-foreground">
          {truncatedExcerpt}
        </p>

        {/* "Footer" Action */}
        <div className="mt-auto flex items-center text-sm font-bold text-primary">
          <span className="relative font-sans after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
            Lire l&apos;article
          </span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
