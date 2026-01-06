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
import {
  Calendar,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
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
  categoryFormation: string;
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
  const [formationName, setFormationName] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");

  // Récupérer les noms de la formation et de la catégorie
  useEffect(() => {
    async function fetchNames() {
      try {
        // Récupérer la formation
        if (candidature.formation) {
          const formationRes = await fetch(
            `/api/formations/${candidature.formation}`
          );
          if (formationRes.ok) {
            const formation = await formationRes.json();
            setFormationName(formation.title);
          } else {
            setFormationName(candidature.formation);
          }
        }
        // Récupérer la catégorie
        if (candidature.categoryFormation) {
          const categoryRes = await fetch(`/api/categories`);
          if (categoryRes.ok) {
            const categories = await categoryRes.json();
            const category = categories.find(
              (c: any) => c.id === candidature.categoryFormation
            );
            setCategoryName(category?.name || candidature.categoryFormation);
          } else {
            setCategoryName(candidature.categoryFormation);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des noms:", error);
        setFormationName(candidature.formation);
        setCategoryName(candidature.categoryFormation);
      }
    }
    if (isOpen) {
      fetchNames();
    }
  }, [isOpen, candidature.formation, candidature.categoryFormation]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20 font-medium">
            Nouveau
          </Badge>
        );
      case "TREATED":
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 font-medium">
            Traité
          </Badge>
        );
      case "ARCHIVED":
        return (
          <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/20 font-medium">
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
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] font-sans p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 shrink-0">
          <DialogTitle className="font-bricolage text-2xl">
            {candidature.civility} {candidature.firstName}{" "}
            {candidature.lastName}
          </DialogTitle>
          <DialogDescription className="text-gray-600 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            Candidature reçue le{" "}
            {format(new Date(candidature.createdAt), "PPP à HH:mm", {
              locale: fr,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          <div className="space-y-6">
            {/* Statut */}
            <div className="bg-muted/30 rounded-xl border border-border/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-lg bg-blue-100 p-1.5">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <label className="text-sm font-semibold text-foreground">
                  Statut de la candidature
                </label>
              </div>
              <div>{getStatusBadge(candidature.status)}</div>
            </div>

            {/* Informations personnelles */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="rounded-lg bg-blue-100 p-1.5">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-base font-bricolage font-semibold text-gray-900">
                  Informations personnelles
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Date de naissance
                  </label>
                  <p className="text-base text-gray-900">
                    {format(new Date(candidature.birthDate), "PPP", {
                      locale: fr,
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Adresse email
                  </label>
                  <a
                    href={`mailto:${candidature.email}`}
                    className="inline-flex items-center gap-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {candidature.email}
                  </a>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Téléphone
                  </label>
                  <a
                    href={`tel:${candidature.phone}`}
                    className="inline-flex items-center gap-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {candidature.phone}
                  </a>
                </div>

                {(candidature.address || candidature.city) && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                      Adresse
                    </label>
                    <p className="text-base text-gray-900 flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                      <span>
                        {candidature.address}
                        {candidature.postalCode && candidature.address && ", "}
                        {candidature.postalCode}
                        {candidature.city && ` ${candidature.city}`}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Projet de formation */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="rounded-lg bg-blue-100 p-1.5">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-base font-bricolage font-semibold text-gray-900">
                  Projet de formation
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Catégorie
                  </label>
                  <p className="text-base text-gray-900">
                    {categoryName || candidature.categoryFormation}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Formation souhaitée
                  </label>
                  <p className="text-base font-semibold text-blue-600">
                    {formationName || candidature.formation}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Niveau d&apos;études
                  </label>
                  <p className="text-base text-gray-900">
                    {candidature.educationLevel}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Situation actuelle
                  </label>
                  <p className="text-base text-gray-900">
                    {candidature.currentSituation}
                  </p>
                </div>

                {candidature.startDate && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                      Date de début souhaitée
                    </label>
                    <p className="text-base text-gray-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {candidature.startDate}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="rounded-lg bg-blue-100 p-1.5">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-base font-bricolage font-semibold text-gray-900">
                  Lettre de motivation
                </h3>
              </div>

              <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-lg p-4 border border-blue-100">
                <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed break-words">
                  {candidature.motivation}
                </p>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="rounded-lg bg-blue-100 p-1.5">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-base font-bricolage font-semibold text-gray-900">
                  Documents joints
                </h3>
              </div>

              {candidature.cvUrl ||
              candidature.coverLetterUrl ||
              candidature.otherDocumentUrl ? (
                <div className="space-y-3">
                  {candidature.cvUrl && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border border-blue-100 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            CV
                          </p>
                          <p className="text-xs text-gray-500">
                            Document personnel
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 shrink-0 ml-3"
                      >
                        <a href={candidature.cvUrl} target="_blank" download>
                          <Download className="mr-2 h-3.5 w-3.5" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                  )}

                  {candidature.coverLetterUrl && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-br from-purple-50/50 to-pink-50/50 border border-purple-100 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            Lettre de motivation
                          </p>
                          <p className="text-xs text-gray-500">
                            Document complémentaire
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 shrink-0 ml-3"
                      >
                        <a
                          href={candidature.coverLetterUrl}
                          target="_blank"
                          download
                        >
                          <Download className="mr-2 h-3.5 w-3.5" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                  )}

                  {candidature.otherDocumentUrl && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50/50 to-emerald-50/50 border border-green-100 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-green-100 rounded-lg shrink-0">
                          <FileText className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            Autre document
                          </p>
                          <p className="text-xs text-gray-500">
                            Pièce jointe supplémentaire
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 shrink-0 ml-3"
                      >
                        <a
                          href={candidature.otherDocumentUrl}
                          target="_blank"
                          download
                        >
                          <Download className="mr-2 h-3.5 w-3.5" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                  <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Aucun document joint
                  </p>
                  <p className="text-xs text-gray-500">
                    Le candidat n&apos;a pas fourni de documents
                  </p>
                </div>
              )}
            </div>

            {/* Formulaire email */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="rounded-lg bg-blue-100 p-1.5">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-base font-bricolage font-semibold text-gray-900">
                  Répondre au candidat
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="email-subject"
                    className="text-gray-700 font-medium text-sm mb-1.5 block"
                  >
                    Sujet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Ex: Réponse à votre candidature"
                    className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email-message"
                    className="text-gray-700 font-medium text-sm mb-1.5 block"
                  >
                    Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="email-message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Bonjour,&#10;&#10;Nous avons bien reçu votre candidature..."
                    rows={6}
                    className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                <Button
                  onClick={handleSendEmail}
                  disabled={
                    isSendingEmail ||
                    !emailSubject.trim() ||
                    !emailMessage.trim()
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
