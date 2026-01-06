"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, BookOpen, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DeleteCategoryDialog from "./delete-category-dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  visible: boolean;
  order: number;
  _count?: {
    formations: number;
  };
}

export default function CategoriesTable({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(categories);

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    const newValue = !currentValue;
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, visible: newValue } : item
      )
    );

    try {
      const response = await fetch(`/api/categories/${id}/toggle-visibility`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      toast.success(
        data.visible ? "Catégorie rendue visible" : "Catégorie masquée"
      );
      router.refresh();
    } catch (error) {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, visible: currentValue } : item
        )
      );
      toast.error(error instanceof Error ? error.message : "Erreur inconnue");
    }
  };

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
            <TableHead className="w-[100px] font-sans font-semibold text-foreground">
              Image
            </TableHead>
            <TableHead className="font-sans font-semibold text-foreground">
              <div className="flex items-center gap-2">
                Nom
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead className="font-sans font-semibold text-foreground">
              Slug
            </TableHead>
            <TableHead className="w-[140px] font-sans font-semibold text-foreground">
              Formations
            </TableHead>
            <TableHead className="w-[140px] font-sans font-semibold text-foreground">
              Visibilité
            </TableHead>
            <TableHead className="w-[80px] font-sans font-semibold text-foreground text-center">
              Ordre
            </TableHead>
            <TableHead className="w-[120px] text-right font-sans font-semibold text-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((category, index) => (
            <TableRow
              key={category.id}
              className="hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
            >
              <TableCell className="py-4">
                {category.imageUrl ? (
                  <div className="relative w-[60px] h-[60px] rounded-lg overflow-hidden ring-2 ring-border/50 shadow-sm">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-[60px] h-[60px] bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center ring-2 ring-border/50">
                    <BookOpen className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                )}
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-semibold text-foreground">
                    {category.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <code className="px-2 py-1 bg-muted/50 rounded text-xs font-mono text-muted-foreground border border-border/50">
                  {category.slug}
                </code>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-950/30">
                    <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-sans font-medium text-sm">
                    {category._count?.formations || 0}
                  </span>
                  <span className="font-sans text-xs text-muted-foreground">
                    formation{(category._count?.formations || 0) > 1 ? "s" : ""}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={category.visible}
                    onCheckedChange={() =>
                      handleToggleVisibility(category.id, category.visible)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Badge
                    variant={category.visible ? "default" : "secondary"}
                    className={
                      category.visible
                        ? "font-sans bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 font-medium"
                        : "font-sans bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/20 font-medium"
                    }
                  >
                    {category.visible ? "Visible" : "Masqué"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="py-4 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 border border-border/50">
                  <span className="font-sans font-semibold text-sm text-foreground">
                    {category.order}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 transition-colors"
                    asChild
                  >
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteCategoryDialog
                    categoryId={category.id}
                    categoryName={category.name}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
