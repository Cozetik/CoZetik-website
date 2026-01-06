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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Eye, Mail, MessageSquare, User } from "lucide-react";
import { useState } from "react";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "NEW" | "TREATED" | "ARCHIVED";
  createdAt: string;
}

interface ViewContactRequestDialogProps {
  request: ContactRequest;
}

export function ViewContactRequestDialog({
  request,
}: ViewContactRequestDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle className="font-bricolage text-2xl">
            Détails de la demande
          </DialogTitle>
          <DialogDescription className="text-gray-600 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            Reçue le{" "}
            {format(new Date(request.createdAt), "PPP à HH:mm", { locale: fr })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Statut */}
          <div className="bg-muted/30 rounded-xl border border-border/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-blue-100 p-1.5">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <label className="text-sm font-semibold text-foreground">
                Statut de la demande
              </label>
            </div>
            <div>{getStatusBadge(request.status)}</div>
          </div>

          {/* Informations du contact */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <div className="rounded-lg bg-blue-100 p-1.5">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-base font-bricolage font-semibold text-gray-900">
                Informations du contact
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Nom complet
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {request.name}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Adresse email
                </label>
                <a
                  href={`mailto:${request.email}`}
                  className="inline-flex items-center gap-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {request.email}
                </a>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <div className="rounded-lg bg-blue-100 p-1.5">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-base font-bricolage font-semibold text-gray-900">
                Message
              </h3>
            </div>

            <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-lg p-4 border border-blue-100">
              <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">
                {request.message}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
