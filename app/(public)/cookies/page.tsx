import { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr";

export const metadata: Metadata = {
  title: "Gestion des cookies | Cozetik",
  description:
    "Informations sur l'utilisation des cookies sur le site cozetik.fr et la gestion de votre consentement.",
  alternates: { canonical: `${baseUrl}/cookies` },
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Gestion des cookies" updated="13 juin 2026">
      <p>
        {
          "Un cookie est un petit fichier déposé sur votre terminal lors de la visite d'un site. Il permet d'assurer le bon fonctionnement du site et, dans certains cas, d'en mesurer l'audience."
        }
      </p>

      <h2>Cookies strictement nécessaires</h2>
      <p>
        {
          "Le site utilise les cookies indispensables à son bon fonctionnement et à votre navigation. Ils ne nécessitent pas votre consentement et ne servent pas à vous suivre à des fins publicitaires."
        }
      </p>

      <h2>Cookies de mesure d'audience</h2>
      <p>
        {
          "Si des outils de mesure d'audience venaient à être ajoutés, ils ne seraient déposés qu'après recueil de votre consentement, que vous pourriez retirer à tout moment."
        }
      </p>

      <h2>Gérer vos cookies</h2>
      <p>
        {
          "Vous pouvez à tout moment configurer votre navigateur pour accepter ou refuser les cookies, ou être averti de leur dépôt. Le refus des cookies strictement nécessaires peut toutefois altérer le fonctionnement du site."
        }
      </p>

      <h2>En savoir plus</h2>
      <p>
        {"Consultez également notre "}
        <a href="/politique-confidentialite">politique de confidentialité</a>
        {"."}
      </p>
    </LegalLayout>
  );
}
