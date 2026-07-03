"use client";

/**
 * Google Analytics 4 + bandeau de consentement RGPD/CNIL.
 *
 * La page /cookies promet explicitement : "les outils de mesure d'audience
 * ne sont déposés qu'après consentement, révocable à tout moment." Ce
 * composant tient cette promesse via Google Consent Mode v2 (défaut refusé
 * tant que l'utilisateur n'a pas cliqué "Accepter").
 *
 * Ne rend RIEN (ni script GA, ni bandeau) si NEXT_PUBLIC_GA_MEASUREMENT_ID
 * n'est pas configuré — pas de fausse promesse de mesure d'audience.
 */

import Script from "next/script";
import { useEffect, useState } from "react";
import Link from "next/link";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CONSENT_KEY = "cozetik-cookie-consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  const respond = (value: "granted" | "denied") => {
    localStorage.setItem(CONSENT_KEY, value);
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: value });
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-cozetik-green bg-cozetik-black px-4 py-5 md:px-8"
    >
      <div className="container mx-auto flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="font-sans text-sm text-white/90 md:text-base">
          Nous utilisons des cookies de mesure d&apos;audience (Google
          Analytics) pour comprendre comment tu utilises le site. Ils ne sont
          déposés qu&apos;avec ton accord — tu peux le retirer à tout moment
          depuis la{" "}
          <Link
            href="/cookies"
            className="underline decoration-cozetik-green decoration-2 underline-offset-2"
          >
            page cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => respond("denied")}
            className="border-2 border-white/40 px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:border-white"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => respond("granted")}
            className="bg-cozetik-green px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-cozetik-green-dark"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsConsent() {
  if (!GA_ID) return null;

  return (
    <>
      {/* Consent Mode v2 : refus par défaut AVANT tout chargement de gtag.js */}
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          try {
            if (localStorage.getItem('${CONSENT_KEY}') === 'granted') {
              gtag('consent', 'update', { analytics_storage: 'granted' });
            }
          } catch (e) {}
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
      <CookieConsentBanner />
    </>
  );
}
