import { ReactNode } from "react";

/**
 * Gabarit commun des pages légales / informationnelles (texte long).
 */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-cozetik-beige">
      <section className="bg-cozetik-black px-4 py-16 md:px-10 md:py-20 lg:px-20">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-white md:text-5xl">
            {title}
          </h1>
          {updated && (
            <p className="mt-3 font-sans text-sm text-white/60">
              Dernière mise à jour : {updated}
            </p>
          )}
        </div>
      </section>
      <section className="px-4 py-12 md:px-10 md:py-16 lg:px-20">
        <div className="container mx-auto max-w-3xl space-y-4 font-sans text-[15px] leading-relaxed text-cozetik-black/80 [&_a]:font-medium [&_a]:text-cozetik-black [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-cozetik-black [&_li]:ml-1 [&_strong]:text-cozetik-black [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          {children}
        </div>
      </section>
    </main>
  );
}
