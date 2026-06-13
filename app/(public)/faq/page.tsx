import { Metadata } from "next";
import { LegalLayout } from "@/components/legal/legal-layout";
import { homeFaqItems } from "@/components/home/faq-data";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.fr";

export const metadata: Metadata = {
  title: "Foire aux questions",
  description:
    "Questions fréquentes sur les formations Cozetik : certifications, éligibilité CPF, modalités à distance ou en présentiel à Bordeaux.",
  alternates: { canonical: `${baseUrl}/faq` },
};

export default function FaqPage() {
  return (
    <LegalLayout title="Foire aux questions">
      {homeFaqItems.map((item, i) => (
        <div key={i}>
          <h2>{item.question}</h2>
          <p>{item.answer}</p>
        </div>
      ))}
    </LegalLayout>
  );
}
