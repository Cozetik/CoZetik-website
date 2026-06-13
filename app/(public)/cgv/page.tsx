import { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr";

export const metadata: Metadata = {
  title: "Conditions générales de vente | Cozetik",
  description:
    "Conditions générales de vente des prestations de formation Cozetik : inscription, tarifs, financement CPF, rétractation et réclamations.",
  alternates: { canonical: `${baseUrl}/cgv` },
};

export default function CgvPage() {
  return (
    <LegalLayout title="Conditions générales de vente" updated="13 juin 2026">
      <p>
        <em>
          {
            "Document en cours de finalisation juridique. Certaines mentions (médiateur de la consommation, tarifs détaillés) seront complétées prochainement."
          }
        </em>
      </p>

      <h2>1. Objet</h2>
      <p>
        {
          "Les présentes conditions générales régissent les prestations de formation proposées par COZÉTIK (ci-après « Cozetik ») à ses clients, qu'ils soient particuliers, professionnels ou financeurs. Toute inscription implique l'acceptation des présentes conditions."
        }
      </p>

      <h2>2. Inscription</h2>
      <p>
        {
          "L'inscription se fait via le formulaire de candidature en ligne, puis par la signature d'un contrat (pour les particuliers) ou d'une convention de formation (pour les professionnels). L'inscription est définitive après validation du dossier et, le cas échéant, de son financement."
        }
      </p>

      <h2>3. Tarifs et modalités de financement</h2>
      <p>
        {
          "Les tarifs sont communiqués avant l'inscription. Selon votre situation, nos formations certifiantes éligibles peuvent être financées via le Compte Personnel de Formation (CPF), un OPCO, France Travail, ou par un financement personnel."
        }
      </p>

      <h2>4. Modalités de paiement</h2>
      <p>
        {
          "Le règlement s'effectue selon les modalités précisées au contrat ou à la convention. En cas de financement CPF, le règlement est assuré par la Caisse des Dépôts via Mon Compte Formation."
        }
      </p>

      <h2>5. Droit de rétractation</h2>
      <p>
        {
          "Le client particulier dispose d'un délai légal de rétractation à compter de la signature du contrat de formation, conformément au Code de la consommation et, pour le CPF, aux règles propres à Mon Compte Formation. Les modalités exactes sont rappelées dans le contrat."
        }
      </p>

      <h2>6. Déroulement de la formation</h2>
      <p>
        {
          "Les formations sont dispensées à distance et/ou en présentiel selon les modalités décrites sur la fiche de chaque formation. Cozetik met à disposition les moyens pédagogiques et techniques nécessaires et délivre une attestation de fin de formation."
        }
      </p>

      <h2>7. Annulation et report</h2>
      <p>
        {
          "Toute demande d'annulation ou de report doit être adressée par écrit. Les conditions applicables (délais, frais éventuels) sont précisées au contrat ou à la convention."
        }
      </p>

      <h2>8. Certification</h2>
      <p>
        {
          "Les formations certifiantes préparent au passage d'une certification professionnelle enregistrée à France Compétences, délivrée par l'organisme certificateur compétent. La réussite à la certification dépend de l'évaluation prévue au référentiel."
        }
      </p>

      <h2>9. Réclamations et médiation</h2>
      <p>
        {"Toute réclamation peut être adressée à "}
        <a href="mailto:nicolas.morby@cozetik.com">nicolas.morby@cozetik.com</a>
        {
          ". Conformément au Code de la consommation, le client consommateur peut recourir gratuitement à un médiateur de la consommation : "
        }
        <em>{"(médiateur à désigner)"}</em>
        {"."}
      </p>

      <h2>10. Accessibilité — situation de handicap</h2>
      <p>
        {
          "Cozetik s'engage à étudier les adaptations possibles pour les personnes en situation de handicap. Contactez-nous en amont de l'inscription pour construire ensemble une solution adaptée."
        }
      </p>

      <h2>11. Données personnelles</h2>
      <p>
        {"Le traitement des données est décrit dans la "}
        <a href="/politique-confidentialite">politique de confidentialité</a>
        {"."}
      </p>

      <h2>12. Droit applicable</h2>
      <p>
        {
          "Les présentes conditions sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire."
        }
      </p>
    </LegalLayout>
  );
}
