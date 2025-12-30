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
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Eye,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Calendar,
  FileText,
  ExternalLink,
} from "lucide-react";
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
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
            Nouveau
          </Badge>
        );
      case "TREATED":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Traité
          </Badge>
        );
      case "ARCHIVED":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
            Archivé
          </Badge>
        );
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
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
        {/* Header fixe */}
        <div className="bg-gradient-to-r from-[#9A80B8] to-[#7B68A8] text-white px-6 py-5 shrink-0">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-bold mb-2 text-white truncate">
                  {candidature.civility} {candidature.firstName}{" "}
                  {candidature.lastName}
                </DialogTitle>
                <DialogDescription className="text-white/90 flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 shrink-0" />
                  Reçue le{" "}
                  {format(new Date(candidature.createdAt), "PPP à HH:mm", {
                    locale: fr,
                  })}
                </DialogDescription>
              </div>
              <div className="shrink-0">
                {getStatusBadge(candidature.status)}
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Contenu scrollable */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-6">
            {/* Informations personnelles */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                <div className="w-8 h-8 rounded-full bg-[#9A80B8]/10 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-[#9A80B8]" />
                </div>
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Date de naissance
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(candidature.birthDate), "PPP", {
                      locale: fr,
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </label>
                  <a
                    href={`mailto:${candidature.email}`}
                    className="text-sm text-[#9A80B8] hover:underline font-medium flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {candidature.email}
                  </a>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Téléphone
                  </label>
                  <a
                    href={`tel:${candidature.phone}`}
                    className="text-sm text-[#9A80B8] hover:underline font-medium flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {candidature.phone}
                  </a>
                </div>
                {candidature.address && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Adresse
                    </label>
                    <p className="text-sm text-gray-900 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
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
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-purple-200 pb-2">
                <div className="w-8 h-8 rounded-full bg-purple-600/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                Projet de formation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Formation souhaitée
                  </label>
                  <p className="text-base font-bold text-purple-700">
                    {candidature.formation}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Niveau d&apos;études
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {candidature.educationLevel}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Situation actuelle
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {candidature.currentSituation}
                  </p>
                </div>
                {candidature.startDate && (
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Date de début souhaitée
                    </label>
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      {candidature.startDate}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                Lettre de motivation
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {candidature.motivation}
                </p>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                <div className="w-8 h-8 rounded-full bg-green-600/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                Documents joints
              </h3>
              {candidature.cvUrl ||
              candidature.coverLetterUrl ||
              candidature.otherDocumentUrl ? (
                <div className="space-y-2">
                  {candidature.cvUrl && (
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-blue-100 rounded shrink-0">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm">CV</p>
                          <p className="text-xs text-gray-500 truncate">
                            Curriculum Vitae
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                      >
                        <a
                          href={candidature.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          Ouvrir
                        </a>
                      </Button>
                    </div>
                  )}
                  {candidature.coverLetterUrl && (
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-purple-100 rounded shrink-0">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm">
                            Lettre de motivation
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            Document de candidature
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                      >
                        <a
                          href={candidature.coverLetterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          Ouvrir
                        </a>
                      </Button>
                    </div>
                  )}
                  {candidature.otherDocumentUrl && (
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-green-100 rounded shrink-0">
                          <FileText className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm">Autre document</p>
                          <p className="text-xs text-gray-500 truncate">
                            Document supplémentaire
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                      >
                        <a
                          href={candidature.otherDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          Ouvrir
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Aucun document joint</p>
                </div>
              )}
            </div>

            {/* Formulaire email */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-blue-200 pb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                Répondre au candidat
              </h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email-subject"
                    className="text-sm font-medium"
                  >
                    Sujet *
                  </Label>
                  <Input
                    id="email-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Ex: Réponse à votre candidature"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email-message"
                    className="text-sm font-medium"
                  >
                    Message *
                  </Label>
                  <Textarea
                    id="email-message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Bonjour,&#10;&#10;Nous avons bien reçu votre candidature..."
                    className="min-h-[150px] resize-none"
                  />
                </div>
                <Button
                  onClick={handleSendEmail}
                  disabled={
                    isSendingEmail ||
                    !emailSubject.trim() ||
                    !emailMessage.trim()
                  }
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Envoyer l&apos;email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
