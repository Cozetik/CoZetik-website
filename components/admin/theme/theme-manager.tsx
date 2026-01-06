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
      setThemes([...themes, { ...createdTheme, _count: { blogPosts: 0 } }]);
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
    <div className="space-y-6">
      {/* Formulaire d'ajout */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200 mb-4 sm:mb-6">
          <div className="rounded-lg bg-purple-100 p-1.5 sm:p-2">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bricolage font-semibold text-gray-900">
              Ajouter un thème
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Créez une nouvelle thématique pour vos articles
            </p>
          </div>
        </div>

        <form onSubmit={handleAddTheme} className="flex gap-2 sm:gap-3">
          <Input
            placeholder="Ex: Intelligence Artificielle, Marketing Digital..."
            value={newTheme}
            onChange={(e) => setNewTheme(e.target.value)}
            disabled={isLoading}
            className="flex-1 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          <Button
            type="submit"
            disabled={isLoading || !newTheme.trim()}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-md hover:shadow-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="hidden sm:inline">Ajout...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Ajouter</span>
                <span className="sm:hidden">+</span>
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Liste des thèmes */}
      <div className="space-y-4">
        <h2 className="text-xl font-bricolage font-semibold text-gray-900">
          Tous les thèmes
        </h2>

        {themes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-muted/30 to-muted/10">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-6 mb-6 shadow-lg">
              <Tag className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bricolage font-bold mb-2">
              Aucun thème créé
            </h3>
            <p className="text-base font-sans text-muted-foreground text-center max-w-md leading-relaxed">
              Commencez par créer votre premier thème pour organiser vos
              articles
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
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
        )}
      </div>
    </div>
  );
}
