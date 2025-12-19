import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cozetik.com"),
  title: {
    default: "Cozetik - Formations professionnelles certifiantes",
    template: "%s | Cozetik",
  },
  description:
    "Développez vos compétences avec Cozetik. Formations professionnelles de qualité, certifiantes et adaptées aux besoins du marché.",
  keywords: [
    "formations professionnelles",
    "formation en ligne",
    "certification professionnelle",
    "développement compétences",
    "formation continue",
  ],
  authors: [{ name: "Cozetik" }],
  creator: "Cozetik",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://cozetik.com",
    siteName: "Cozetik",
    title: "Cozetik - Formations professionnelles certifiantes",
    description:
      "Développez vos compétences avec Cozetik. Formations professionnelles de qualité, certifiantes et adaptées aux besoins du marché.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cozetik - Formations professionnelles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cozetik - Formations professionnelles certifiantes",
    description:
      "Développez vos compétences avec Cozetik. Formations professionnelles de qualité.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
