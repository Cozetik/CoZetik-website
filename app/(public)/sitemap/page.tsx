import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LegalLayout } from "@/components/legal/legal-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr";

export const metadata: Metadata = {
  title: "Plan du site",
  description: "Plan du site cozetik.fr : retrouvez l'ensemble des pages.",
  alternates: { canonical: `${baseUrl}/sitemap` },
};

async function getFormations() {
  try {
    if (!process.env.DATABASE_URL) return [];
    return await prisma.formation.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      select: { title: true, slug: true },
    });
  } catch {
    return [];
  }
}

export default async function SitemapPage() {
  const formations = await getFormations();

  return (
    <LegalLayout title="Plan du site">
      <h2>Pages principales</h2>
      <ul>
        <li><Link href="/">Accueil</Link></li>
        <li><Link href="/formations">Nos formations</Link></li>
        <li><Link href="/financement-cpf">Financement CPF</Link></li>
        <li><Link href="/a-propos">À propos</Link></li>
        <li><Link href="/entreprises">Entreprises</Link></li>
        <li><Link href="/blog">Blog</Link></li>
        <li><Link href="/contact">Contact</Link></li>
        <li><Link href="/candidater">Candidater</Link></li>
        <li><Link href="/quiz">Quiz d&apos;orientation</Link></li>
        <li><Link href="/faq">FAQ</Link></li>
      </ul>

      {formations.length > 0 && (
        <>
          <h2>Formations</h2>
          <ul>
            {formations.map((f) => (
              <li key={f.slug}>
                <Link href={`/formations/${f.slug}`}>{f.title}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Informations légales</h2>
      <ul>
        <li><Link href="/mentions-legales">Mentions légales</Link></li>
        <li><Link href="/cgv">Conditions générales de vente</Link></li>
        <li><Link href="/politique-confidentialite">Politique de confidentialité</Link></li>
        <li><Link href="/cookies">Gestion des cookies</Link></li>
        <li><Link href="/accessibilite">Accessibilité</Link></li>
      </ul>
    </LegalLayout>
  );
}
