import { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr";

export const metadata: Metadata = {
  title: "Accessibilité | Cozetik",
  description:
    "Déclaration d'accessibilité du site cozetik.fr et engagement de Cozetik en faveur de l'accessibilité, y compris pour les personnes en situation de handicap.",
  alternates: { canonical: `${baseUrl}/accessibilite` },
};

export default function AccessibilitePage() {
  return (
    <LegalLayout title="Accessibilité" updated="13 juin 2026">
      <h2>Notre engagement</h2>
      <p>
        {
          "Cozetik s'efforce de rendre son site accessible au plus grand nombre. Nous travaillons à améliorer en continu l'expérience de navigation (contrastes, lisibilité, navigation au clavier, alternatives textuelles)."
        }
      </p>

      <h2>État de conformité</h2>
      <p>
        {
          "Le site n'a pas encore fait l'objet d'un audit de conformité complet au Référentiel général d'amélioration de l'accessibilité (RGAA). Des points d'amélioration peuvent subsister ; ils sont traités au fil des évolutions du site."
        }
      </p>

      <h2>Handicap et formation</h2>
      <p>
        {
          "Au-delà du site, Cozetik s'engage à étudier les adaptations nécessaires pour rendre ses formations accessibles aux personnes en situation de handicap. N'hésitez pas à nous contacter en amont de votre inscription afin de construire ensemble une solution adaptée."
        }
      </p>

      <h2>Signaler un problème</h2>
      <p>
        {"Si vous rencontrez une difficulté d'accès à un contenu ou à un service, écrivez-nous à "}
        <a href="mailto:nicolas.morby@cozetik.com">nicolas.morby@cozetik.com</a>
        {" : nous reviendrons vers vous et chercherons une alternative."}
      </p>
    </LegalLayout>
  );
}
