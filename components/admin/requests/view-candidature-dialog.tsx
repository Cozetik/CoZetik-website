'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, Mail, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'

interface Candidature {
  id: string
  civility: string
  firstName: string
  lastName: string
  birthDate: string
  email: string
  phone: string
  address: string | null
  postalCode: string | null
  city: string | null
  formation: string
  educationLevel: string
  currentSituation: string
  startDate: string | null
  motivation: string
  cvUrl: string | null
  coverLetterUrl: string | null
  otherDocumentUrl: string | null
  acceptPrivacy: boolean
  acceptNewsletter: boolean
  status: 'NEW' | 'TREATED' | 'ARCHIVED'
  createdAt: string
}

interface ViewCandidatureDialogProps {
  candidature: Candidature
}

export function ViewCandidatureDialog({
  candidature,
}: ViewCandidatureDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">Nouveau</Badge>
        )
      case 'TREATED':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Traité</Badge>
        )
      case 'ARCHIVED':
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">Archivé</Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Veuillez remplir le sujet et le message')
      return
    }

    setIsSendingEmail(true)

    try {
      const response = await fetch(
        `/api/requests/candidatures/${candidature.id}/send-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: emailSubject,
            message: emailMessage,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        // Afficher un message d'erreur plus détaillé
        if (data.requiresDomainVerification) {
          toast.error(
            'Domaine non vérifié. Pour envoyer des emails, vérifiez un domaine sur resend.com/domains',
            { duration: 8000 }
          )
        } else {
          toast.error(data.error || 'Erreur lors de l\'envoi de l\'email')
        }
        return
      }

      toast.success('Email envoyé avec succès')
      setEmailSubject('')
      setEmailMessage('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la candidature</DialogTitle>
          <DialogDescription>
            Candidature reçue le{' '}
            {format(new Date(candidature.createdAt), 'PPP à HH:mm', {
              locale: fr,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nom complet
                </label>
                <p className="mt-1 text-base">
                  {candidature.civility} {candidature.firstName} {candidature.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date de naissance
                </label>
                <p className="mt-1 text-base">{candidature.birthDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="mt-1 text-base">
                  <a
                    href={`mailto:${candidature.email}`}
                    className="text-primary hover:underline"
                  >
                    {candidature.email}
                  </a>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Téléphone
                </label>
                <p className="mt-1 text-base">
                  <a
                    href={`tel:${candidature.phone}`}
                    className="text-primary hover:underline"
                  >
                    {candidature.phone}
                  </a>
                </p>
              </div>
              {candidature.address && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Adresse
                  </label>
                  <p className="mt-1 text-base">
                    {candidature.address}
                    {candidature.postalCode && `, ${candidature.postalCode}`}
                    {candidature.city && ` ${candidature.city}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Projet de formation */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Projet de formation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Formation souhaitée
                </label>
                <p className="mt-1 text-base font-semibold">
                  {candidature.formation}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Niveau d&apos;études
                </label>
                <p className="mt-1 text-base">{candidature.educationLevel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Situation actuelle
                </label>
                <p className="mt-1 text-base">{candidature.currentSituation}</p>
              </div>
              {candidature.startDate && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date de début souhaitée
                  </label>
                  <p className="mt-1 text-base">{candidature.startDate}</p>
                </div>
              )}
            </div>
          </div>

          {/* Motivation */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Motivation
            </label>
            <div className="mt-1 p-4 bg-muted rounded-lg whitespace-pre-wrap text-base">
              {candidature.motivation}
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Documents joints</h3>
            {(candidature.cvUrl || candidature.coverLetterUrl || candidature.otherDocumentUrl) ? (
              <div className="space-y-3">
                {candidature.cvUrl && (
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
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
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                    >
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
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
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
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                    >
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
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
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
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                    >
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
              <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
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

          {/* Statut */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Statut
            </label>
            <div className="mt-1">{getStatusBadge(candidature.status)}</div>
          </div>

          {/* Envoyer un email */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Envoyer un email
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-subject">Sujet *</Label>
                <Input
                  id="email-subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Sujet de l'email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email-message">Message *</Label>
                <Textarea
                  id="email-message"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Votre message..."
                  className="mt-1 min-h-[150px]"
                />
              </div>
              <Button
                onClick={handleSendEmail}
                disabled={isSendingEmail || !emailSubject.trim() || !emailMessage.trim()}
                className="w-full"
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
      </DialogContent>
    </Dialog>
  )
}

