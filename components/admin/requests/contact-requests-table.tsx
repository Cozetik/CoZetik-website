"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Archive,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Inbox,
  Mail,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ViewContactRequestDialog } from "./view-contact-request-dialog";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "NEW" | "TREATED" | "ARCHIVED";
  createdAt: string;
}

interface ContactRequestsTableProps {
  requests: ContactRequest[];
}

type FilterStatus = "all" | "NEW" | "TREATED" | "ARCHIVED";

export default function ContactRequestsTable({
  requests,
}: ContactRequestsTableProps) {
  const router = useRouter();
  const [items, setItems] = useState(requests);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: fr });
  };

  const formatDateShort = (date: string) => {
    return format(new Date(date), "dd/MM/yy", { locale: fr });
  };

  const getStatusBadge = (status: string, isMobile = false) => {
    const sizeClasses = isMobile
      ? "text-[9px] xs:text-[10px] h-5 xs:h-6 px-1.5 xs:px-2"
      : "";

    switch (status) {
      case "NEW":
        return (
          <Badge
            className={`bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20 font-medium ${sizeClasses}`}
          >
            Nouveau
          </Badge>
        );
      case "TREATED":
        return (
          <Badge
            className={`bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 font-medium ${sizeClasses}`}
          >
            Traité
          </Badge>
        );
      case "ARCHIVED":
        return (
          <Badge
            className={`bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/20 font-medium ${sizeClasses}`}
          >
            Archivé
          </Badge>
        );
      default:
        return <Badge className={sizeClasses}>{status}</Badge>;
    }
  };

  const handleChangeStatus = async (
    requestId: string,
    newStatus: "TREATED" | "ARCHIVED"
  ) => {
    setLoadingStates((prev) => ({ ...prev, [requestId]: true }));

    try {
      const response = await fetch(
        `/api/requests/contact/${requestId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === requestId ? { ...item, status: data.status } : item
        )
      );

      if (newStatus === "TREATED") {
        if (data.emailSent) {
          toast.success(
            "Demande marquée comme traitée et email envoyé avec succès"
          );
        } else if (data.emailError) {
          toast.warning(
            `Demande marquée comme traitée, mais l'email n'a pas pu être envoyé: ${data.emailError}`
          );
        } else {
          toast.success("Demande marquée comme traitée");
        }
      } else {
        toast.success("Demande archivée");
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleDelete = async (requestId: string) => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/requests/contact/${requestId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      setItems((prev) => prev.filter((item) => item.id !== requestId));

      toast.success("Demande supprimée avec succès");
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsDeleting(false);
    }
  };

  const filterByStatus = (status: FilterStatus) => {
    if (status === "all") return items;
    return items.filter((item) => item.status === status);
  };

  const filteredItems = filterByStatus(activeFilter);

  const filters = [
    {
      id: "all" as FilterStatus,
      label: "Toutes",
      count: items.length,
      icon: Inbox,
      color: "blue",
    },
    {
      id: "NEW" as FilterStatus,
      label: "Nouvelles",
      count: items.filter((r) => r.status === "NEW").length,
      icon: Mail,
      color: "orange",
    },
    {
      id: "TREATED" as FilterStatus,
      label: "Traitées",
      count: items.filter((r) => r.status === "TREATED").length,
      icon: CheckCircle2,
      color: "green",
    },
    {
      id: "ARCHIVED" as FilterStatus,
      label: "Archivées",
      count: items.filter((r) => r.status === "ARCHIVED").length,
      icon: Archive,
      color: "gray",
    },
  ];

  const getFilterClasses = (filterId: FilterStatus, color: string) => {
    const isActive = activeFilter === filterId;
    const baseClasses =
      "flex items-center gap-2 xs:gap-2.5 sm:gap-3 px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl transition-all font-sans font-medium cursor-pointer";

    if (isActive) {
      const activeColors = {
        blue: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg",
        orange:
          "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg",
        green:
          "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg",
        gray: "bg-gradient-to-br from-gray-500 to-slate-500 text-white shadow-lg",
      };
      return `${baseClasses} ${activeColors[color as keyof typeof activeColors]}`;
    }

    return `${baseClasses} bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground border border-border/50`;
  };

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6 font-sans">
      {/* Filtres modernes */}
      <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-3 lg:grid-cols-4">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={getFilterClasses(filter.id, filter.color)}
            >
              <div
                className={`rounded-md xs:rounded-lg p-1 xs:p-1.5 sm:p-2 ${
                  activeFilter === filter.id
                    ? "bg-white/20"
                    : "bg-background/50"
                }`}
              >
                <Icon className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold truncate">
                  {filter.label}
                </p>
                <p
                  className={`text-[9px] xs:text-[10px] sm:text-xs truncate ${
                    activeFilter === filter.id
                      ? "text-white/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {filter.count}{" "}
                  <span className="hidden xs:inline">
                    demande{filter.count !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>
              {activeFilter === filter.id && (
                <div className="h-1.5 w-1.5 xs:h-2 xs:w-2 rounded-full bg-white shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Vue Desktop */}
      <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
              <TableHead className="font-sans font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Nom
                </div>
              </TableHead>
              <TableHead className="font-sans font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead className="w-[180px] font-sans font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Date
                </div>
              </TableHead>
              <TableHead className="w-[120px] font-sans font-semibold text-foreground">
                Statut
              </TableHead>
              <TableHead className="w-[180px] text-right font-sans font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-12"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="h-8 w-8 text-muted-foreground/50" />
                    <p className="font-semibold">Aucune demande trouvée</p>
                    <p className="text-sm">
                      Aucune demande ne correspond à ce filtre
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((request) => (
                <TableRow
                  key={request.id}
                  className="hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
                >
                  <TableCell className="py-4 font-sans font-semibold text-foreground">
                    {request.name}
                  </TableCell>
                  <TableCell className="py-4 font-sans text-muted-foreground">
                    {request.email}
                  </TableCell>
                  <TableCell className="py-4 font-sans text-muted-foreground">
                    {formatDate(request.createdAt)}
                  </TableCell>
                  <TableCell className="py-4">
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center justify-end gap-1">
                      <ViewContactRequestDialog request={request} />

                      {request.status === "NEW" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted"
                          onClick={() =>
                            handleChangeStatus(request.id, "TREATED")
                          }
                          title="Marquer comme traité"
                          disabled={loadingStates[request.id]}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}

                      {request.status !== "ARCHIVED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted"
                          onClick={() =>
                            handleChangeStatus(request.id, "ARCHIVED")
                          }
                          title="Archiver"
                          disabled={loadingStates[request.id]}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}

                      <AlertDialog
                        open={deleteId === request.id}
                        onOpenChange={(open) =>
                          setDeleteId(open ? request.id : null)
                        }
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-muted"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="font-sans">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-bricolage text-2xl">
                              Supprimer cette demande ?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                              Cette action est irréversible. La demande de{" "}
                              <span className="font-semibold">
                                {request.name}
                              </span>{" "}
                              sera définitivement supprimée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              disabled={isDeleting}
                              className="border-gray-300 hover:bg-gray-50"
                            >
                              Annuler
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(request.id);
                              }}
                              disabled={isDeleting}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isDeleting ? "Suppression..." : "Supprimer"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Vue Mobile */}
      <div className="md:hidden space-y-2 xs:space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 xs:py-8 sm:py-12 px-2.5 xs:px-3 rounded-lg xs:rounded-xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-muted/30 to-muted/10">
            <Inbox className="h-6 w-6 xs:h-8 xs:w-8 text-muted-foreground/50 mb-2 xs:mb-3" />
            <p className="font-semibold text-xs xs:text-sm">
              Aucune demande trouvée
            </p>
            <p className="text-[10px] xs:text-xs text-muted-foreground text-center">
              Aucune demande ne correspond à ce filtre
            </p>
          </div>
        ) : (
          filteredItems.map((request) => (
            <div
              key={request.id}
              className="rounded-lg xs:rounded-xl border border-border/50 bg-card p-2.5 xs:p-3 sm:p-4 space-y-2 xs:space-y-2.5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0 space-y-0.5 xs:space-y-1">
                  <div className="flex items-center gap-1.5 xs:gap-2">
                    <User className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-blue-600 shrink-0" />
                    <h3 className="font-sans font-semibold text-foreground text-xs xs:text-sm truncate">
                      {request.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 xs:gap-1.5">
                    <Mail className="h-2.5 w-2.5 xs:h-3 xs:w-3 text-muted-foreground shrink-0" />
                    <p className="font-sans text-muted-foreground text-[10px] xs:text-xs truncate">
                      {request.email}
                    </p>
                  </div>
                </div>
                {getStatusBadge(request.status, true)}
              </div>

              {/* Date */}
              <div className="flex items-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs text-muted-foreground pt-1 xs:pt-1.5 border-t border-border/30">
                <Calendar className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                <span className="font-sans">
                  <span className="xs:hidden">
                    {formatDateShort(request.createdAt)}
                  </span>
                  <span className="hidden xs:inline">
                    {formatDate(request.createdAt)}
                  </span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1 pt-1 xs:pt-1.5 border-t border-border/30">
                <ViewContactRequestDialog request={request} />

                {request.status === "NEW" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 xs:h-8 xs:w-8 hover:bg-muted"
                    onClick={() => handleChangeStatus(request.id, "TREATED")}
                    title="Marquer comme traité"
                    disabled={loadingStates[request.id]}
                  >
                    <CheckCircle2 className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                )}

                {request.status !== "ARCHIVED" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 xs:h-8 xs:w-8 hover:bg-muted"
                    onClick={() => handleChangeStatus(request.id, "ARCHIVED")}
                    title="Archiver"
                    disabled={loadingStates[request.id]}
                  >
                    <Archive className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                )}

                <AlertDialog
                  open={deleteId === request.id}
                  onOpenChange={(open) => setDeleteId(open ? request.id : null)}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 xs:h-8 xs:w-8 hover:bg-muted"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="font-sans max-w-[calc(100vw-2rem)] xs:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-bricolage text-sm xs:text-base sm:text-2xl">
                        Supprimer cette demande ?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 text-[11px] xs:text-xs sm:text-sm">
                        Cette action est irréversible. La demande de{" "}
                        <span className="font-semibold">{request.name}</span>{" "}
                        sera définitivement supprimée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col xs:flex-row gap-2">
                      <AlertDialogCancel
                        disabled={isDeleting}
                        className="border-gray-300 hover:bg-gray-50 m-0 text-xs xs:text-sm"
                      >
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(request.id);
                        }}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 m-0 text-xs xs:text-sm"
                      >
                        {isDeleting ? "Suppression..." : "Supprimer"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
