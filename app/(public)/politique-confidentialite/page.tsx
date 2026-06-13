import { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Cozetik collecte, utilise et protège vos données personnelles, conformément au RGPD.",
  alternates: { canonical: `${baseUrl}/politique-confidentialite` },
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updated="13 juin 2026">
      <p>
        {
          "Cozetik accorde une grande importance à la protection de vos données personnelles. Cette politique explique quelles données nous collectons, pourquoi, et quels sont vos droits, conformément au Règlement général sur la protection des données (RGPD)."
        }
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        {"COZÉTIK (SAS à mission), 41 rue Paul Berthelot, 33300 Bordeaux. Pour toute question relative à vos données : "}
        <a href="mailto:nicolas.morby@cozetik.com">nicolas.morby@cozetik.com</a>
        {"."}
      </p>

      <h2>Données collectées</h2>
      <p>
        {"Nous collectons uniquement les données que vous nous transmettez via nos formulaires (contact, candidature, inscription) :"}
      </p>
      <ul>
        <li>{"Identité : nom, prénom"}</li>
        <li>{"Coordonnées : adresse e-mail, numéro de téléphone"}</li>
        <li>{"Informations relatives à votre projet de formation"}</li>
        <li>{"Le cas échéant, les pièces que vous nous transmettez"}</li>
      </ul>

      <h2>Finalités et base légale</h2>
      <ul>
        <li>
          {"Répondre à vos demandes et traiter votre candidature ou inscription — base légale : mesures précontractuelles et votre consentement."}
        </li>
        <li>
          {"Gérer la relation de formation et nos obligations administratives (Qualiopi, financeurs) — base légale : exécution du contrat et obligation légale."}
        </li>
      </ul>

      <h2>Destinataires</h2>
      <p>
        {"Vos données sont destinées aux équipes de Cozetik. Nous faisons appel à des prestataires techniques (sous-traitants au sens du RGPD) pour faire fonctionner le service :"}
      </p>
      <ul>
        <li>{"Envoi d'e-mails transactionnels (prestataire de messagerie)"}</li>
        <li>{"Hébergement de la base de données au sein de l'Union européenne"}</li>
        <li>{"Hébergement du site"}</li>
      </ul>
      <p>
        {"Nous ne vendons ni ne louons vos données à des tiers. Des données peuvent être transmises aux financeurs (par ex. la Caisse des Dépôts pour le CPF) lorsque cela est nécessaire à votre financement."}
      </p>

      <h2>Durée de conservation</h2>
      <p>
        {"Vos données sont conservées le temps nécessaire au traitement de votre demande, puis archivées conformément aux durées légales applicables (notamment les obligations comptables et liées aux financements de la formation), avant suppression."}
      </p>

      <h2>Vos droits</h2>
      <p>
        {"Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition, de limitation et de portabilité de vos données. Vous pouvez les exercer à tout moment en écrivant à "}
        <a href="mailto:nicolas.morby@cozetik.com">nicolas.morby@cozetik.com</a>
        {". Vous pouvez également introduire une réclamation auprès de la CNIL ("}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
          cnil.fr
        </a>
        {")."}
      </p>

      <h2>Cookies</h2>
      <p>
        {"La gestion des cookies est décrite sur la page "}
        <a href="/cookies">gestion des cookies</a>
        {"."}
      </p>
    </LegalLayout>
  );
}
