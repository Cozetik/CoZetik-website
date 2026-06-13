import { Metadata } from "next";
import { CandidatureForm } from "@/components/candidater/candidature-form";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr";

export const metadata: Metadata = {
  title: "Candidater à une formation",
  description:
    "Candidatez en ligne à une formation certifiante Cozetik, éligible au CPF. Notre équipe vous répond sous 48 heures.",
  alternates: { canonical: `${baseUrl}/candidater` },
};

export default async function CandidaterPage({
  searchParams,
}: {
  searchParams: Promise<{ formationId?: string; pack?: string }>;
}) {
  const sp = await searchParams;

  return (
    <>
      <noscript>
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            background: "#EFEFEF",
            color: "#2C2C2C",
            fontFamily: "var(--font-bricolage), sans-serif",
          }}
        >
          L&apos;envoi du formulaire nécessite JavaScript. Pour candidater, vous
          pouvez nous écrire directement à{" "}
          <a href="mailto:nicolas.morby@cozetik.com">nicolas.morby@cozetik.com</a>.
        </div>
      </noscript>
      <CandidatureForm
        formationId={sp.formationId ?? ""}
        pack={sp.pack ?? ""}
      />
    </>
  );
}
