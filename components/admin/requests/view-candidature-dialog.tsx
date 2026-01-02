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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  ExternalLink,
  Eye,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
  const [viewingFile, setViewingFile] = useState<{
    url: string;
    name: string;
    type: "pdf" | "image" | "other";
  } | null>(null);
  const [pdfLoadError, setPdfLoadError] = useState(false);

  // Debug: vérifier les URLs des fichiers
  useEffect(() => {
    if (isOpen) {
      console.log("📎 URLs des fichiers:", {
        cvUrl: candidature.cvUrl,
        coverLetterUrl: candidature.coverLetterUrl,
        otherDocumentUrl: candidature.otherDocumentUrl,
      });
    }
  }, [isOpen, candidature.cvUrl, candidature.coverLetterUrl, candidature.otherDocumentUrl]);

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
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-700 bg-orange-50"
          >
            Nouveau
          </Badge>
        );
      case "TREATED":
        return (
          <Badge
            variant="outline"
            className="border-green-500 text-green-700 bg-green-50"
          >
            Traité
          </Badge>
        );
      case "ARCHIVED":
        return (
          <Badge
            variant="outline"
            className="border-gray-400 text-gray-600 bg-gray-50"
          >
            Archivé
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  const getFileType = (url: string): "pdf" | "image" | "other" => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes(".pdf") || lowerUrl.includes("pdf")) {
      return "pdf";
    }
    if (
      lowerUrl.includes(".jpg") ||
      lowerUrl.includes(".jpeg") ||
      lowerUrl.includes(".png") ||
      lowerUrl.includes(".gif") ||
      lowerUrl.includes(".webp") ||
      lowerUrl.includes("image")
    ) {
      return "image";
    }
    return "other";
  };

  const handleViewFile = (url: string, name: string) => {
    // Réinitialiser l'état d'erreur
    setPdfLoadError(false);
    setViewingFile({
      url,
      name,
      type: getFileType(url),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl p-0 flex flex-col">
        {/* Header */}
        <div className="shrink-0 px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-semibold text-gray-900 tracking-tight">
                  {candidature.civility} {candidature.firstName}{" "}
                  {candidature.lastName}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 flex items-center gap-2 mt-1 tracking-tight">
                  <Calendar className="w-3.5 h-3.5" />
                  Reçue le{" "}
                  {format(new Date(candidature.createdAt), "PPP à HH:mm", {
                    locale: fr,
                  })}
                </DialogDescription>
              </div>
              {getStatusBadge(candidature.status)}
            </div>
          </DialogHeader>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Informations personnelles */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2 tracking-tight">
                <User className="w-4 h-4 text-gray-600" />
                Informations personnelles
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Date de naissance
                  </p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(candidature.birthDate), "PPP", {
                      locale: fr,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Email
                  </p>
                  <a
                    href={`mailto:${candidature.email}`}
                    className="text-sm text-[#9A80B8] hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {candidature.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Téléphone
                  </p>
                  <a
                    href={`tel:${candidature.phone}`}
                    className="text-sm text-[#9A80B8] hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {candidature.phone}
                  </a>
                </div>
                {(candidature.address || candidature.city) && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      Adresse
                    </p>
                    <p className="text-sm text-gray-900 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
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
            </section>

            <Separator />

            {/* Projet de formation */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2 tracking-tight">
                <GraduationCap className="w-4 h-4 text-gray-600" />
                Projet de formation
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Catégorie
                  </p>
                  <p className="text-sm text-gray-900">
                    {categoryName || candidature.categoryFormation}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Formation souhaitée
                  </p>
                  <p className="text-sm font-semibold text-[#9A80B8]">
                    {formationName || candidature.formation}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Niveau d&apos;études
                  </p>
                  <p className="text-sm text-gray-900">
                    {candidature.educationLevel}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Situation actuelle
                  </p>
                  <p className="text-sm text-gray-900">
                    {candidature.currentSituation}
                  </p>
                </div>
                {candidature.startDate && (
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      Date de début souhaitée
                    </p>
                    <p className="text-sm text-gray-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      {candidature.startDate}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* Motivation */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2 tracking-tight">
                <MessageSquare className="w-4 h-4 text-gray-600" />
                Lettre de motivation
              </h3>
              <div className="relative">
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200 max-h-[150px] overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                    {candidature.motivation}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Documents */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2 tracking-tight">
                <FileText className="w-4 h-4 text-gray-600" />
                Documents joints
              </h3>
              <div>
                {candidature.cvUrl ||
                candidature.coverLetterUrl ||
                candidature.otherDocumentUrl ? (
                  <div className="space-y-3">
                    {candidature.cvUrl && (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors bg-white">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 bg-blue-50 rounded shrink-0">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              CV
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {candidature.cvFileName || candidature.cvUrl?.split('/').pop() || 'Fichier CV'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFile(candidature.cvUrl!, candidature.cvFileName || "CV")}
                          >
                            <Eye className="w-4 h-4 mr-1.5" />
                            Voir
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={candidature.cvUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-1.5" />
                              Télécharger
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                    {candidature.coverLetterUrl && (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors bg-white">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 bg-purple-50 rounded shrink-0">
                            <FileText className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Lettre de motivation
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {candidature.coverLetterFileName || candidature.coverLetterUrl?.split('/').pop() || 'Fichier lettre'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewFile(
                                candidature.coverLetterUrl!,
                                candidature.coverLetterFileName || "Lettre de motivation"
                              )
                            }
                          >
                            <Eye className="w-4 h-4 mr-1.5" />
                            Voir
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={candidature.coverLetterUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-1.5" />
                              Télécharger
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                    {candidature.otherDocumentUrl && (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors bg-white">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 bg-green-50 rounded shrink-0">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Autre document
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {candidature.otherDocumentFileName || candidature.otherDocumentUrl?.split('/').pop() || 'Fichier document'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewFile(
                                candidature.otherDocumentUrl!,
                                candidature.otherDocumentFileName || "Autre document"
                              )
                            }
                          >
                            <Eye className="w-4 h-4 mr-1.5" />
                            Voir
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={candidature.otherDocumentUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-1.5" />
                              Télécharger
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center border border-dashed border-gray-300 rounded-md bg-gray-50">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Aucun document joint
                    </p>
                    <p className="text-xs text-gray-500">
                      Le candidat n&apos;a pas fourni de documents
                    </p>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* Formulaire email */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2 tracking-tight">
                <Mail className="w-4 h-4 text-gray-600" />
                Répondre au candidat
              </h3>
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="email-subject"
                    className="text-sm font-medium mb-1.5 block"
                  >
                    Sujet
                  </Label>
                  <Input
                    id="email-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Ex: Réponse à votre candidature"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email-message"
                    className="text-sm font-medium mb-1.5 block"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="email-message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Bonjour,&#10;&#10;Nous avons bien reçu votre candidature..."
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleSendEmail}
                  disabled={
                    isSendingEmail ||
                    !emailSubject.trim() ||
                    !emailMessage.trim()
                  }
                  className="w-full bg-[#9A80B8] hover:bg-[#8a70a8]"
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
            </section>
          </div>
        </div>
      </DialogContent>

      {/* Dialog pour visualiser les fichiers */}
      <Dialog 
        open={!!viewingFile} 
        onOpenChange={(open) => {
          if (!open) {
            setViewingFile(null);
            setPdfLoadError(false);
          }
        }}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 flex flex-col">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>Visualisation du fichier {viewingFile?.name}</DialogTitle>
              <DialogDescription>Prévisualisation du document {viewingFile?.name}</DialogDescription>
            </DialogHeader>
          </VisuallyHidden>
          {viewingFile && (
            <div className="relative flex-1 overflow-auto p-6">
              {/* Bouton de téléchargement en haut à droite */}
              <div className="absolute top-8 right-8 z-10 flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="bg-white shadow-md"
                >
                  <a
                    href={viewingFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ouvrir dans un nouvel onglet
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="bg-white shadow-md"
                >
                  <a
                    href={viewingFile.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Télécharger
                  </a>
                </Button>
              </div>
              
              {viewingFile.type === "pdf" ? (
                <iframe
                  src={`/api/proxy-pdf?url=${encodeURIComponent(viewingFile.url)}`}
                  className="w-full h-full min-h-[600px] border rounded-md"
                  title={viewingFile.name}
                />
              ) : viewingFile.type === "image" ? (
                <div className="flex items-center justify-center">
                  <img
                    src={viewingFile.url}
                    alt={viewingFile.name}
                    className="max-w-full max-h-[70vh] object-contain rounded-md"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Aperçu non disponible pour ce type de fichier
                  </p>
                  <Button asChild variant="outline">
                    <a
                      href={viewingFile.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Télécharger le fichier
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
