import { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr";

export const metadata: Metadata = {
  title: "Mentions légales | Cozetik",
  description:
    "Mentions légales du site cozetik.fr — éditeur, hébergeur et informations légales de l'organisme de formation Cozetik.",
  alternates: { canonical: `${baseUrl}/mentions-legales` },
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updated="13 juin 2026">
      <h2>Éditeur du site</h2>
      <p>
        {
          "Le site cozetik.fr est édité par COZÉTIK, société par actions simplifiée à mission (SAS à mission)."
        }
      </p>
      <ul>
        <li>{"Siège social : 41 rue Paul Berthelot, 33300 Bordeaux"}</li>
        <li>{"SIREN : 982 574 675 — RCS Bordeaux"}</li>
        <li>{"SIRET (siège) : 982 574 675 00012"}</li>
        <li>
          <em>{"Capital social : (à compléter)"}</em>
        </li>
        <li>{"Représentée par sa présidente, la société ETK"}</li>
        <li>
          {"Contact : "}
          <a href="mailto:nicolas.morby@cozetik.com">
            nicolas.morby@cozetik.com
          </a>
        </li>
      </ul>

      <h2>Directeur de la publication</h2>
      <p>{"Nicolas Morby."}</p>

      <h2>Activité de formation professionnelle</h2>
      <p>
        {
          "Cozetik est un organisme de formation. Déclaration d'activité enregistrée sous le numéro 75331600233 auprès du préfet de région. Cet enregistrement ne vaut pas agrément de l'État."
        }
      </p>
      <p>
        {
          "Cozetik est certifié Qualiopi au titre de la catégorie d'actions suivante : actions de formation. La certification qualité a été délivrée au titre de cette catégorie."
        }
      </p>

      <h2>Hébergement</h2>
      <p>
        {"Le site est hébergé par Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis — "}
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          netlify.com
        </a>
        {". La base de données est hébergée au sein de l'Union européenne."}
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        {
          "L'ensemble des contenus présents sur le site (textes, visuels, logos, supports pédagogiques) est protégé par le droit de la propriété intellectuelle et demeure la propriété de Cozetik ou de ses partenaires. Toute reproduction ou réutilisation sans autorisation préalable est interdite."
        }
      </p>

      <h2>Données personnelles</h2>
      <p>
        {"Le traitement de vos données personnelles est décrit dans notre "}
        <a href="/politique-confidentialite">politique de confidentialité</a>
        {"."}
      </p>

      <h2>Cookies</h2>
      <p>
        {"La gestion des cookies est détaillée sur la page "}
        <a href="/cookies">gestion des cookies</a>
        {"."}
      </p>

      <h2>Droit applicable</h2>
      <p>
        {
          "Le présent site est soumis au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents."
        }
      </p>
    </LegalLayout>
  );
}
