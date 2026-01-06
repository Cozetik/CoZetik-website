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
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 xs:h-8 xs:w-8 hover:bg-muted"
        >
          <Eye className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)] xs:max-w-[calc(100vw-3rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle className="font-bricolage text-base xs:text-lg sm:text-2xl">
            Détails de la demande
          </DialogTitle>
          <DialogDescription className="text-gray-600 flex items-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs sm:text-sm">
            <Calendar className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
            <span className="xs:hidden">
              {format(new Date(request.createdAt), "dd/MM/yy HH:mm", {
                locale: fr,
              })}
            </span>
            <span className="hidden xs:inline">
              Reçue le{" "}
              {format(new Date(request.createdAt), "PPP à HH:mm", {
                locale: fr,
              })}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 xs:space-y-4 sm:space-y-6 pt-2 xs:pt-3 sm:pt-4">
          {/* Statut */}
          <div className="bg-muted/30 rounded-lg xs:rounded-xl border border-border/50 p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 xs:gap-2 mb-1.5 xs:mb-2">
              <div className="rounded-md xs:rounded-lg bg-blue-100 p-1 xs:p-1.5">
                <MessageSquare className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-blue-600" />
              </div>
              <label className="text-[10px] xs:text-xs sm:text-sm font-semibold text-foreground">
                Statut de la demande
              </label>
            </div>
            <div>{getStatusBadge(request.status)}</div>
          </div>

          {/* Informations du contact */}
          <div className="bg-white rounded-lg xs:rounded-xl border border-gray-200 p-2.5 xs:p-3 sm:p-4 lg:p-6 space-y-2.5 xs:space-y-3 sm:space-y-4">
            <div className="flex items-center gap-1.5 xs:gap-2 pb-2 xs:pb-2.5 sm:pb-3 border-b border-gray-200">
              <div className="rounded-md xs:rounded-lg bg-blue-100 p-1 xs:p-1.5">
                <User className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-blue-600" />
              </div>
              <h3 className="text-xs xs:text-sm sm:text-base font-bricolage font-semibold text-gray-900">
                Informations du contact
              </h3>
            </div>

            <div className="grid gap-2.5 xs:gap-3 sm:gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 xs:mb-1.5 block">
                  Nom complet
                </label>
                <p className="text-xs xs:text-sm sm:text-base font-semibold text-gray-900 break-words">
                  {request.name}
                </p>
              </div>

              <div>
                <label className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 xs:mb-1.5 block">
                  Adresse email
                </label>
                <a
                  href={`mailto:${request.email}`}
                  className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-xs xs:text-sm sm:text-base font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
                >
                  <Mail className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  {request.email}
                </a>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-lg xs:rounded-xl border border-gray-200 p-2.5 xs:p-3 sm:p-4 lg:p-6 space-y-2.5 xs:space-y-3 sm:space-y-4">
            <div className="flex items-center gap-1.5 xs:gap-2 pb-2 xs:pb-2.5 sm:pb-3 border-b border-gray-200">
              <div className="rounded-md xs:rounded-lg bg-blue-100 p-1 xs:p-1.5">
                <MessageSquare className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-blue-600" />
              </div>
              <h3 className="text-xs xs:text-sm sm:text-base font-bricolage font-semibold text-gray-900">
                Message
              </h3>
            </div>

            <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-md xs:rounded-lg border border-blue-100 p-2.5 xs:p-3 sm:p-4">
              <p className="text-[11px] xs:text-xs sm:text-base text-gray-900 whitespace-pre-wrap leading-relaxed">
                {request.message}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
