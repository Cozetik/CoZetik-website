"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle, Loader2, PhoneCall } from "lucide-react";
import { VALIDATED_BY_SLUG } from "@/lib/certifications";
import { CpfFinanceButton } from "@/components/formations/certification-status";
import {
  computeDiagnostic,
  ECHEANCE_OPTIONS,
  PROJET_OPTIONS,
  STATUT_OPTIONS,
  type DiagnosticAnswers,
  type DiagnosticResult,
  type Echeance,
  type Projet,
  type Statut,
} from "@/lib/cpf-diagnostic";

type Step = 0 | 1 | 2 | 3 | 4;

const STEP_TITLES = [
  "Votre projet",
  "Votre situation",
  "Votre échéance",
  "Votre diagnostic est prêt",
];

function OptionButton({
  selected,
  label,
  onClick,
  delayMs = 0,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
  delayMs?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={{ animationDelay: `${delayMs}ms` }}
      className={`step-enter w-full border-2 px-5 py-4 text-left font-sans text-base font-medium transition-colors duration-200 active:translate-y-px md:text-lg ${
        selected
          ? "border-cozetik-green bg-cozetik-green/10 text-cozetik-black"
          : "border-cozetik-black/15 bg-white text-cozetik-black hover:border-cozetik-green"
      }`}
    >
      {label}
    </button>
  );
}

export function EligibiliteForm() {
  const [step, setStep] = useState<Step>(0);
  const [projet, setProjet] = useState<Projet | null>(null);
  const [statut, setStatut] = useState<Statut | null>(null);
  const [echeance, setEcheance] = useState<Echeance | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [captureFailed, setCaptureFailed] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus direct du premier champ à l'arrivée sur l'étape coordonnées.
  useEffect(() => {
    if (step === 3) nameInputRef.current?.focus();
  }, [step]);

  const goTo = (s: Step) => {
    setFormError(null);
    setStep(s);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projet || !statut || !echeance) return;
    if (name.trim().length < 2) {
      setFormError("Merci d'indiquer votre nom.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Merci d'indiquer un email valide.");
      return;
    }
    if (!consent) {
      setFormError(
        "Merci d'accepter que Cozetik vous recontacte au sujet de votre projet."
      );
      return;
    }

    const answers: DiagnosticAnswers = { statut, projet, echeance };
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/api/public/eligibilite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), ...answers }),
      });
      setCaptureFailed(!res.ok);
    } catch {
      setCaptureFailed(true);
    } finally {
      // Le résultat est toujours montré : l'échec d'enregistrement ne doit
      // pas priver le prospect de son diagnostic.
      setResult(computeDiagnostic(answers));
      setSubmitting(false);
      setStep(4);
    }
  };

  // ——— Écran résultat ———
  if (step === 4 && result) {
    const cert = result.formationSlug
      ? VALIDATED_BY_SLUG[result.formationSlug]
      : null;
    const certSecondaire = result.formationSecondaireSlug
      ? VALIDATED_BY_SLUG[result.formationSecondaireSlug]
      : null;

    return (
      <div className="step-enter flex flex-col gap-8" aria-live="polite">
        <div className="flex flex-col gap-4 border-2 border-cozetik-green bg-white p-6 md:p-10">
          <span className="inline-flex w-fit items-center gap-2 bg-cozetik-green px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wide text-white">
            <CheckCircle className="h-4 w-4" aria-hidden="true" />
            Diagnostic terminé
          </span>
          <h2 className="font-display text-2xl font-bold text-cozetik-black md:text-3xl">
            {result.verdict}
          </h2>
          <p className="font-sans text-base text-cozetik-black/80 md:text-lg">
            {result.financement}
          </p>
        </div>

        {cert && (
          <div className="flex flex-col gap-4 border-2 border-cozetik-black bg-white p-6 md:p-10">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-cozetik-green/50 px-3 py-1 font-sans text-xs font-semibold text-cozetik-black">
              <BadgeCheck className="h-3.5 w-3.5 text-cozetik-green" aria-hidden="true" />
              Formation recommandée · Éligible CPF · {cert.rsCode}
            </span>
            <h3 className="font-display text-xl font-bold text-cozetik-black md:text-2xl">
              {cert.officialTitle}
            </h3>
            <p className="font-sans text-sm text-cozetik-black/70">
              Certification enregistrée à France Compétences · Certificateur{" "}
              {cert.certifier} · 100&nbsp;% e-learning, à votre rythme.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              {result.cpfDirect && result.formationSlug ? (
                <CpfFinanceButton slug={result.formationSlug} className="flex-1" />
              ) : null}
              <Link
                href={`/formations/${result.formationSlug}`}
                className="inline-flex flex-1 items-center justify-center gap-2 border-2 border-cozetik-black px-6 py-3 font-sans text-base font-semibold text-cozetik-black transition-colors hover:bg-cozetik-black hover:text-white"
              >
                Découvrir la formation
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            {certSecondaire && result.formationSecondaireSlug ? (
              <p className="font-sans text-sm text-cozetik-black/70">
                Également adaptée à votre projet :{" "}
                <Link
                  href={`/formations/${result.formationSecondaireSlug}`}
                  className="font-semibold underline decoration-cozetik-green decoration-2 underline-offset-2"
                >
                  {certSecondaire.officialTitle}
                </Link>{" "}
                ({certSecondaire.rsCode}).
              </p>
            ) : null}
          </div>
        )}

        <div className="flex flex-col items-start gap-3 bg-cozetik-black p-6 md:p-8">
          <p className="font-sans text-base text-white/90">
            <PhoneCall className="mr-2 inline h-4 w-4 text-cozetik-green" aria-hidden="true" />
            {captureFailed ? (
              <>
                Vos coordonnées n&apos;ont pas pu être transmises — écrivez-nous
                via la{" "}
                <Link href="/contact" className="underline decoration-cozetik-green decoration-2">
                  page contact
                </Link>{" "}
                pour être rappelé(e).
              </>
            ) : (
              <>
                C&apos;est noté, <strong>{name.trim()}</strong> : un conseiller
                Cozetik revient vers vous sous 48&nbsp;h ouvrées pour répondre à
                vos questions et sécuriser votre dossier.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  // ——— Écrans questions + coordonnées ———
  return (
    <div className="flex flex-col gap-8">
      {/* Progression */}
      <div>
        <div className="flex items-baseline justify-between">
          <p className="font-sans text-sm font-semibold uppercase tracking-wide text-cozetik-black/70 tabular-nums">
            Étape {step + 1} sur 4
          </p>
          <p className="font-display text-lg font-bold text-cozetik-black md:text-xl">
            {STEP_TITLES[step]}
          </p>
        </div>
        <div
          className="mt-3 h-1.5 w-full bg-cozetik-black/10"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label={`Étape ${step + 1} sur 4 — ${STEP_TITLES[step]}`}
        >
          <div
            className="h-full bg-cozetik-green transition-[width] duration-300"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {step === 0 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="step-enter mb-4 font-sans text-lg text-cozetik-black md:text-xl">
            Quel est votre projet aujourd&apos;hui&nbsp;?
          </legend>
          {PROJET_OPTIONS.map((o, i) => (
            <OptionButton
              key={o.value}
              label={o.label}
              selected={projet === o.value}
              delayMs={i * 50}
              onClick={() => {
                setProjet(o.value);
                goTo(1);
              }}
            />
          ))}
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="step-enter mb-4 font-sans text-lg text-cozetik-black md:text-xl">
            Quelle est votre situation professionnelle&nbsp;?
          </legend>
          {STATUT_OPTIONS.map((o, i) => (
            <OptionButton
              key={o.value}
              label={o.label}
              selected={statut === o.value}
              delayMs={i * 50}
              onClick={() => {
                setStatut(o.value);
                goTo(2);
              }}
            />
          ))}
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="step-enter mb-4 font-sans text-lg text-cozetik-black md:text-xl">
            Quand souhaitez-vous démarrer&nbsp;?
          </legend>
          {ECHEANCE_OPTIONS.map((o, i) => (
            <OptionButton
              key={o.value}
              label={o.label}
              selected={echeance === o.value}
              delayMs={i * 50}
              onClick={() => {
                setEcheance(o.value);
                goTo(3);
              }}
            />
          ))}
        </fieldset>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="step-enter flex flex-col gap-5" noValidate>
          <p className="font-sans text-lg text-cozetik-black md:text-xl">
            Où vous envoyons-nous votre diagnostic personnalisé&nbsp;?
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1.5 font-sans text-sm font-semibold text-cozetik-black">
              Votre nom *
              <input
                ref={nameInputRef}
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-cozetik-black/20 bg-white px-4 py-3 font-normal outline-none transition-[border-color,box-shadow] duration-150 focus:border-cozetik-green focus:ring-4 focus:ring-cozetik-green/15"
                placeholder="Prénom Nom"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1.5 font-sans text-sm font-semibold text-cozetik-black">
              Votre email *
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-cozetik-black/20 bg-white px-4 py-3 font-normal outline-none transition-[border-color,box-shadow] duration-150 focus:border-cozetik-green focus:ring-4 focus:ring-cozetik-green/15"
                placeholder="vous@exemple.fr"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5 font-sans text-sm font-semibold text-cozetik-black">
            Votre téléphone (facultatif — pour un rappel plus rapide)
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-2 border-cozetik-black/20 bg-white px-4 py-3 font-normal outline-none transition-colors focus:border-cozetik-green"
              placeholder="06 12 34 56 78"
            />
          </label>
          <label className="flex items-start gap-3 font-sans text-sm text-cozetik-black/80">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 accent-cozetik-green"
            />
            <span>
              J&apos;accepte que Cozetik me recontacte au sujet de mon projet de
              formation. Aucune revente de données —{" "}
              <Link
                href="/politique-confidentialite"
                className="underline decoration-cozetik-green decoration-2 underline-offset-2"
              >
                politique de confidentialité
              </Link>
              .
            </span>
          </label>

          {formError && (
            <p role="alert" className="border-l-4 border-red-500 bg-red-50 px-4 py-3 font-sans text-sm text-red-800">
              {formError}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => goTo(2)}
              className="inline-flex items-center justify-center gap-2 border-2 border-cozetik-black px-6 py-4 font-sans text-base font-semibold text-cozetik-black transition-colors hover:bg-cozetik-black hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Retour
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex flex-1 items-center justify-center gap-2 bg-cozetik-green px-8 py-4 font-sans text-lg font-semibold text-white transition-colors hover:bg-cozetik-green-dark active:translate-y-px disabled:cursor-wait disabled:bg-cozetik-green/70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Analyse en cours…
                </>
              ) : (
                <>
                  Voir mon diagnostic
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
          <p className="font-sans text-xs text-cozetik-black/70">
            Diagnostic gratuit et sans engagement · Réponse d&apos;un conseiller
            sous 48&nbsp;h ouvrées.
          </p>
        </form>
      )}

      {step > 0 && step < 3 && (
        <button
          type="button"
          onClick={() => goTo((step - 1) as Step)}
          className="inline-flex w-fit items-center gap-2 font-sans text-sm font-semibold text-cozetik-black/70 transition-colors hover:text-cozetik-black"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Question précédente
        </button>
      )}
    </div>
  );
}
