import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

const menuLinks = [
  { href: "/", label: "Accueil" },
  { href: "/formations", label: "Formations" },
  { href: "/a-propos", label: "À propos" },
  { href: "/entreprises", label: "Entreprises" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const formationLinks = [
  { href: "/formations/informatique", label: "Informatique" },
  { href: "/formations/prise-de-parole", label: "Prise de Parole" },
  {
    href: "/formations/intelligence-emotionnelle",
    label: "Intelligence Émotionnelle",
  },
  { href: "/formations/business", label: "Business" },
  {
    href: "/formations/kizomba-bien-etre-connexion",
    label: "Kizomba Bien-Être & Connexion",
  },
  { href: "/formations", label: "Formation entreprise" },
];

const aboutLinks = [
  { href: "/a-propos#histoire", label: "Notre histoire" },
  { href: "/a-propos#valeurs", label: "Nos valeurs" },
  { href: "/a-propos#equipe", label: "L'équipe" },
  { href: "/a-propos#partenaires", label: "Partenaires" },
  { href: "/blog", label: "Actualités (Blog)" },
  { href: "/candidater", label: "Nous rejoindre" },
];

const infoLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/candidater", label: "Candidater" },
  { href: "/contact", label: "Contact" },
  { href: "/sitemap", label: "Plan du site" },
  { href: "/accessibilite", label: "Accessibilité" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-confidentialite", label: "Politique de confidentialité" },
  { href: "/cgv", label: "CGV" },
  { href: "/cookies", label: "Gestion des cookies" },
];

async function getFooterFormations() {
  try {
    // Évite les erreurs Prisma en environnement sans base configurée
    if (!process.env.DATABASE_URL) {
      return [];
    }

    const formations = await prisma.formation.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      take: 5,
      select: { title: true, slug: true },
    });
    return formations;
  } catch (error) {
    console.error("Error fetching footer formations:", error);
    return [];
  }
}

export async function Footer() {
  const formations = await getFooterFormations();

  return (
    <footer className="bg-cozetik-black">
      <div className="container w-full px-4 py-12">
        <div className="flex flex-col gap-12 px-10 lg:flex-row lg:justify-between">
          {/* Colonne 1 : Cozetik */}
          <div className="space-y-4 lg:max-w-[300px]">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-footer.png"
                alt="Logo Cozetik"
                width={150}
                height={60}
                className="h-auto w-[150px]"
                priority
              />
            </Link>
            <p
              className="font-sans text-sm text-cozetik-white/80"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Formez-vous aux métiers de demain
            </p>
            <p
              className="font-sans text-xs leading-relaxed text-cozetik-white/70"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Centre de formation d&apos;apprentis innovant, Cozetik forme les
              talents de demain avec des parcours uniques.
            </p>
            {/* Réseaux sociaux - à ajouter plus tard */}
          </div>

          {/* Colonnes Liens */}
          <div className="grid grid-cols-2 gap-8 lg:ml-auto lg:gap-10 sm:grid-cols-3">
            {/* Colonne 2 : Formations */}
            <div>
              <h3
                className="mb-4 font-sans text-base font-bold text-cozetik-white"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                FORMATIONS
              </h3>
              <ul>
                {formationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm font-normal leading-[1.8] text-cozetik-white transition-colors duration-200 hover:text-cozetik-beige"
                      style={{
                        fontFamily: "var(--font-bricolage), sans-serif",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 : À propos */}
            <div className="lg:justify-self-center">
              <h3
                className="mb-4 font-sans text-base font-bold text-cozetik-white"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                À PROPOS
              </h3>
              <ul>
                {aboutLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm font-normal leading-[1.8] text-cozetik-white transition-colors duration-200 hover:text-cozetik-beige"
                      style={{
                        fontFamily: "var(--font-bricolage), sans-serif",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 4 : Informations */}
            <div className="">
              <h3
                className="mb-4 font-sans text-base font-bold text-cozetik-white"
                style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
              >
                INFORMATIONS
              </h3>
              <ul>
                {infoLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm font-normal leading-[1.8] text-cozetik-white transition-colors duration-200 hover:text-cozetik-beige"
                      style={{
                        fontFamily: "var(--font-bricolage), sans-serif",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full border-t border-cozetik-white/20 pt-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p
              className="font-sans text-sm font-normal text-[#888888]"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              © {new Date().getFullYear()} Cozetik - Centre de Formation
              d&apos;Apprentis. Tous droits réservés.
            </p>
            <p
              className="font-sans text-sm font-normal text-[#888888]"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              4 Rue Sarah Bernhardt, 92600 Asnières-sur-Seine
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
