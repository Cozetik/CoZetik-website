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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Loader2, Plus, Tag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Theme {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
}

interface ThemeManagerProps {
  initialThemes: Theme[];
}

export default function ThemeManager({ initialThemes }: ThemeManagerProps) {
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [newTheme, setNewTheme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAddTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheme.trim()) return;

    setIsLoading(true);
    try {
      // Génération simple d'un slug
      const slug = newTheme
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const response = await fetch("/api/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTheme, slug }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la création");
      }

      const createdTheme = await response.json();
      setThemes([...themes, { ...createdTheme, _count: { posts: 0 } }]);
      setNewTheme("");
      toast.success("Thème ajouté avec succès");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Impossible d'ajouter le thème"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTheme = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/themes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      setThemes(themes.filter((t) => t.id !== id));
      toast.success("Thème supprimé avec succès");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer le thème"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-2.5 xs:space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Formulaire d'ajout */}
      <div className="bg-white rounded-lg xs:rounded-xl border border-gray-200 p-2.5 xs:p-3 sm:p-4 lg:p-6">
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 pb-2 xs:pb-2.5 sm:pb-3 lg:pb-4 border-b border-gray-200 mb-2.5 xs:mb-3 sm:mb-4 lg:mb-6">
          <div className="rounded-md xs:rounded-lg bg-purple-100 p-1 xs:p-1.5 sm:p-2 shrink-0">
            <Plus className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-purple-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm xs:text-base sm:text-lg lg:text-xl font-bricolage font-semibold text-gray-900 truncate">
              Ajouter un thème
            </h2>
            <p className="text-[10px] xs:text-[11px] sm:text-xs lg:text-sm text-gray-500 truncate">
              Créez une nouvelle thématique
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAddTheme}
          className="flex gap-1.5 xs:gap-2 sm:gap-3"
        >
          <Input
            placeholder="Ex: Intelligence Artificielle..."
            value={newTheme}
            onChange={(e) => setNewTheme(e.target.value)}
            disabled={isLoading}
            className="flex-1 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all h-8 xs:h-9 sm:h-10 text-xs xs:text-sm"
          />
          <Button
            type="submit"
            disabled={isLoading || !newTheme.trim()}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-md hover:shadow-lg transition-all h-8 xs:h-9 sm:h-10 px-2.5 xs:px-3 sm:px-4 text-xs xs:text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 animate-spin xs:mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Ajout...</span>
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 xs:mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Ajouter</span>
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Liste des thèmes */}
      <div className="space-y-1.5 xs:space-y-2 sm:space-y-4">
        <h2 className="text-xs xs:text-sm sm:text-lg lg:text-xl font-bricolage font-semibold text-gray-900 px-0.5">
          Tous les thèmes
        </h2>

        {themes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 xs:py-8 sm:py-16 lg:py-24 px-2.5 xs:px-3 sm:px-6 rounded-lg xs:rounded-xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-muted/30 to-muted/10">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-2.5 xs:p-3 sm:p-5 lg:p-6 mb-2.5 xs:mb-3 sm:mb-6 shadow-lg">
              <Tag className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
            </div>
            <h3 className="text-sm xs:text-base sm:text-xl lg:text-2xl font-bricolage font-bold mb-1 xs:mb-1.5 text-center">
              Aucun thème créé
            </h3>
            <p className="text-[11px] xs:text-xs sm:text-base font-sans text-muted-foreground text-center max-w-md leading-relaxed px-2">
              Commencez par créer votre premier thème
            </p>
          </div>
        ) : (
          <>
            {/* Vue Desktop */}
            <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                    <TableHead className="font-sans font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        Nom du thème
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[300px] font-sans font-semibold text-foreground">
                      Slug
                    </TableHead>
                    <TableHead className="w-[150px] font-sans font-semibold text-foreground text-center">
                      Articles
                    </TableHead>
                    <TableHead className="w-[100px] text-right font-sans font-semibold text-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {themes.map((theme) => (
                    <TableRow
                      key={theme.id}
                      className="hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-purple-100 p-2">
                            <Tag className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="font-sans font-semibold text-foreground">
                            {theme.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <code className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                          {theme.slug}
                        </code>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Badge
                          variant="secondary"
                          className="font-sans bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                        >
                          {theme._count?.posts || 0} article
                          {(theme._count?.posts || 0) !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-end">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={deletingId === theme.id}
                                className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                              >
                                {deletingId === theme.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-bricolage">
                                  Supprimer ce thème ?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-sans">
                                  Cette action est irréversible. Le thème &quot;
                                  <strong>{theme.name}</strong>&quot; sera
                                  supprimé définitivement
                                  {theme._count?.posts
                                    ? `, mais les ${theme._count.posts} article(s) associé(s) seront conservés`
                                    : ""}
                                  .
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="font-sans">
                                  Annuler
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTheme(theme.id)}
                                  className="bg-red-600 hover:bg-red-700 font-sans"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Vue Mobile */}
            <div className="md:hidden space-y-2 xs:space-y-2.5">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className="rounded-lg xs:rounded-xl border border-border/50 bg-card p-2.5 xs:p-3 sm:p-4 space-y-2 xs:space-y-2.5 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Header avec icône et nom */}
                  <div className="flex items-center gap-2 xs:gap-2.5">
                    <div className="rounded-md xs:rounded-lg bg-purple-100 p-1.5 xs:p-2 shrink-0">
                      <Tag className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sans font-semibold text-foreground text-xs xs:text-sm truncate">
                        {theme.name}
                      </h3>
                      <code className="text-[9px] xs:text-[10px] text-muted-foreground font-mono block truncate">
                        {theme.slug}
                      </code>
                    </div>
                  </div>

                  {/* Badge articles */}
                  <div className="flex items-center justify-between pt-1 xs:pt-1.5 border-t border-border/30">
                    <Badge
                      variant="secondary"
                      className="font-sans bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-[9px] xs:text-[10px] h-5 xs:h-6 px-1.5 xs:px-2"
                    >
                      {theme._count?.posts || 0} article
                      {(theme._count?.posts || 0) !== 1 ? "s" : ""}
                    </Badge>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deletingId === theme.id}
                          className="h-7 w-7 xs:h-8 xs:w-8 hover:bg-red-50 hover:text-red-600"
                        >
                          {deletingId === theme.id ? (
                            <Loader2 className="h-3 w-3 xs:h-3.5 xs:w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[calc(100vw-2rem)] xs:max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-bricolage text-sm xs:text-base">
                            Supprimer ce thème ?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-sans text-[11px] xs:text-xs sm:text-sm">
                            Cette action est irréversible. Le thème &quot;
                            <strong>{theme.name}</strong>&quot; sera supprimé
                            définitivement
                            {theme._count?.posts
                              ? `, mais les ${theme._count.posts} article(s) associé(s) seront conservés`
                              : ""}
                            .
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col xs:flex-row gap-2">
                          <AlertDialogCancel className="font-sans m-0 text-xs xs:text-sm">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTheme(theme.id)}
                            className="bg-red-600 hover:bg-red-700 font-sans m-0 text-xs xs:text-sm"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
