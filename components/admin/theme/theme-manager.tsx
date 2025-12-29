"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Theme {
  id: string;
  name: string;
  slug: string;
}

interface ThemeManagerProps {
  initialThemes: Theme[];
}

export default function ThemeManager({ initialThemes }: ThemeManagerProps) {
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [newTheme, setNewTheme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const response = await fetch("/api/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTheme, slug }),
      });

      if (!response.ok) throw new Error("Erreur lors de la création");

      const createdTheme = await response.json();
      setThemes([...themes, createdTheme]);
      setNewTheme("");
      toast.success("Thème ajouté avec succès");
      router.refresh(); // Rafraîchir les données serveur si nécessaire
    } catch (error) {
      toast.error("Impossible d'ajouter le thème");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTheme = async (id: string) => {
    try {
      const response = await fetch(`/api/themes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur suppression");

      setThemes(themes.filter((t) => t.id !== id));
      toast.success("Thème supprimé");
      router.refresh();
    } catch (error) {
      toast.error("Impossible de supprimer le thème");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des thèmes</CardTitle>
        <CardDescription>
          Ajoutez ou supprimez des thèmes pour vos articles de blog.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire d'ajout */}
        <form onSubmit={handleAddTheme} className="flex gap-2 items-end">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="theme">Nouveau thème</Label>
            <Input
              id="theme"
              placeholder="Ex: Intelligence Artificielle"
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading || !newTheme}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Ajouter
          </Button>
        </form>

        {/* Liste des thèmes */}
        <div className="flex flex-wrap gap-2">
          {themes.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Aucun thème créé.
            </p>
          )}
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-none text-sm group"
            >
              <span>{theme.name}</span>
              <button
                onClick={() => handleDeleteTheme(theme.id)}
                className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                title="Supprimer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
