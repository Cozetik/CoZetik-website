"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Candidature {
  id: string;
  civility: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  formation: string;
  educationLevel: string;
  currentSituation: string;
  startDate: string | null;
  motivation: string;
  cvUrl: string | null;
  coverLetterUrl: string | null;
  otherDocumentUrl: string | null;
  acceptPrivacy: boolean;
  acceptNewsletter: boolean;
  status: "NEW" | "TREATED" | "ARCHIVED";
  createdAt: string;
}

interface ViewCandidatureDialogProps {
  candidature: Candidature;
}

export function ViewCandidatureDialog({
  candidature,
}: ViewCandidatureDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">Nouveau</Badge>
        );
      case "TREATED":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Traité</Badge>
        );
      case "ARCHIVED":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Archivé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error("Veuillez remplir le sujet et le message");
      return;
    }

    setIsSendingEmail(true);

    try {
      const response = await fetch(
        `/api/requests/candidatures/${candidature.id}/send-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: emailSubject,
            message: emailMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Afficher un message d'erreur plus détaillé
        if (data.requiresDomainVerification) {
          toast.error(
            "Domaine non vérifié. Pour envoyer des emails, vérifiez un domaine sur resend.com/domains",
            { duration: 8000 }
          );
        } else {
          toast.error(data.error || "Erreur lors de l'envoi de l'email");
        }
        return;
      }

      toast.success("Email envoyé avec succès");
      setEmailSubject("");
      setEmailMessage("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-[#9A80B8] to-[#7B68A8] text-white p-6">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold mb-2 text-white">
                  {candidature.civility} {candidature.firstName}{" "}
                  {candidature.lastName}
                </DialogTitle>
                <DialogDescription className="text-white/90 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Reçue le{" "}
                  {format(new Date(candidature.createdAt), "PPP à HH:mm", {
                    locale: fr,
                  })}
                </DialogDescription>
              </div>
              <div>{getStatusBadge(candidature.status)}</div>
            </div>
          </DialogHeader>
        </div>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] p-6">
          <div className="space-y-8">
            <div className="bg-white border-l-4 border-[#9A80B8] p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#9A80B8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Date de naissance
                  </label>
                  <p className="text-base font-medium">
                    {format(new Date(candidature.birthDate), "PPP", {
                      locale: fr,
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-base">
                    <a
                      href={`mailto:${candidature.email}`}
                      className="text-[#9A80B8] hover:underline font-medium flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {candidature.email}
                    </a>
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Téléphone
                  </label>
                  <p className="text-base">
                    <a
                      href={`tel:${candidature.phone}`}
                      className="text-[#9A80B8] hover:underline font-medium flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {candidature.phone}
                    </a>
                  </p>
                </div>
                {candidature.address && (
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Adresse
                    </label>
                    <p className="text-base flex items-start gap-2">
                      <svg
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>
                        {candidature.address}
                        {candidature.postalCode &&
                          `, ${candidature.postalCode}`}
                        {candidature.city && ` ${candidature.city}`}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Projet de formation */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Projet de formation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 col-span-full">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Formation souhaitée
                  </label>
                  <p className="text-lg font-bold text-purple-700 dark:text-purple-400">
                    {candidature.formation}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Niveau d&apos;études
                  </label>
                  <p className="text-base font-medium">
                    {candidature.educationLevel}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Situation actuelle
                  </label>
                  <p className="text-base font-medium">
                    {candidature.currentSituation}
                  </p>
                </div>
                {candidature.startDate && (
                  <div className="space-y-1 col-span-full">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Date de début souhaitée
                    </label>
                    <p className="text-base font-medium flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {candidature.startDate}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-white border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Lettre de motivation
              </h3>
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="whitespace-pre-wrap text-base leading-relaxed">
                  {candidature.motivation}
                </p>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Documents joints
              </h3>
              {candidature.cvUrl ||
              candidature.coverLetterUrl ||
              candidature.otherDocumentUrl ? (
                <div className="space-y-3">
                  {candidature.cvUrl && (
                    <div className="flex items-center justify-between p-3 border rounded-none hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                          <svg
                            className="w-5 h-5 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">CV</p>
                          <p className="text-sm text-muted-foreground">
                            Curriculum Vitae
                          </p>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={candidature.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Ouvrir
                        </a>
                      </Button>
                    </div>
                  )}
                  {candidature.coverLetterUrl && (
                    <div className="flex items-center justify-between p-3 border rounded-none hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded">
                          <svg
                            className="w-5 h-5 text-purple-600 dark:text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Lettre de motivation</p>
                          <p className="text-sm text-muted-foreground">
                            Document de candidature
                          </p>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={candidature.coverLetterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Ouvrir
                        </a>
                      </Button>
                    </div>
                  )}
                  {candidature.otherDocumentUrl && (
                    <div className="flex items-center justify-between p-3 border rounded-none hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                          <svg
                            className="w-5 h-5 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Autre document</p>
                          <p className="text-sm text-muted-foreground">
                            Document supplémentaire
                          </p>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={candidature.otherDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Ouvrir
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 border border-dashed rounded-none text-center text-muted-foreground">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">Aucun document joint</p>
                </div>
              )}
            </div>

            {/* Envoyer un email */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-l-4 border-blue-600 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6 text-blue-600" />
                Répondre au candidat
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email-subject"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Sujet *
                  </Label>
                  <Input
                    id="email-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Ex: Réponse à votre candidature"
                    className="mt-1 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email-message"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Message *
                  </Label>
                  <Textarea
                    id="email-message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Bonjour,\n\nNous avons bien reçu votre candidature..."
                    className="mt-1 min-h-[180px] resize-none"
                  />
                </div>
                <Button
                  onClick={handleSendEmail}
                  disabled={
                    isSendingEmail ||
                    !emailSubject.trim() ||
                    !emailMessage.trim()
                  }
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-5 w-5" />
                      Envoyer l&apos;email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
