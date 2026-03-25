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
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeletePackDialog({
  formationId,
  packId,
  packName,
}: {
  formationId: string;
  packId: string;
  packName: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/formations/${formationId}/packs/${packId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      toast.success("Pack supprimé avec succès");
      router.refresh();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-gray-200 hover:border-red-500 hover:text-red-600 transition-all shadow-sm"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-sans">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bricolage font-bold text-gray-900">
            Êtes-vous sûr ?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Cette action est irréversible. Ceci supprimera définitivement le pack{" "}
            <span className="font-semibold text-gray-900">&quot;{packName}&quot;</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="border-gray-200 hover:bg-gray-50 transition-colors">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700 border-0 shadow-md hover:shadow-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer le pack"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
