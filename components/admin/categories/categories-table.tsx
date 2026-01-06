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
    <>
      {/* Vue Mobile - Cartes */}
      <div className="md:hidden space-y-1.5 xs:space-y-2">
        {items.map((category) => (
          <div
            key={category.id}
            className="bg-card border border-border/50 rounded-lg xs:rounded-xl p-1.5 xs:p-2 space-y-1.5 xs:space-y-2 shadow-sm"
          >
            {/* Header avec image et nom */}
            <div className="flex items-start gap-1.5 xs:gap-2">
              {category.imageUrl ? (
                <div className="relative w-10 h-10 xs:w-12 xs:h-12 rounded-md overflow-hidden ring-2 ring-border/50 shadow-sm shrink-0">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-to-br from-muted to-muted/50 rounded-md flex items-center justify-center ring-2 ring-border/50 shrink-0">
                  <BookOpen className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-muted-foreground/50" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-sans font-semibold text-foreground text-[11px] xs:text-xs leading-tight line-clamp-2 mb-0.5">
                  {category.name}
                </h3>
                <code className="text-[9px] xs:text-[10px] font-mono text-muted-foreground block truncate">
                  {category.slug}
                </code>
              </div>
              <div className="flex items-center justify-center w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-muted/50 border border-border/50 shrink-0">
                <span className="font-sans font-semibold text-[9px] xs:text-[10px] text-foreground">
                  {category.order}
                </span>
              </div>
            </div>

            {/* Infos */}
            <div className="flex items-center justify-between pt-1.5 xs:pt-2 border-t border-border/30">
              <div className="flex items-center gap-0.5 xs:gap-1">
                <div className="p-0.5 rounded-sm xs:rounded-md bg-blue-100 dark:bg-blue-950/30">
                  <BookOpen className="h-2 w-2 xs:h-2.5 xs:w-2.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-sans font-medium text-[10px] xs:text-[11px]">
                  {category._count?.formations || 0}
                </span>
                <span className="font-sans text-[9px] xs:text-[10px] text-muted-foreground">
                  form.
                </span>
              </div>
              <Badge
                variant={category.visible ? "default" : "secondary"}
                className={
                  category.visible
                    ? "font-sans bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 font-medium text-[9px] xs:text-[10px] h-3.5 xs:h-4 px-1 xs:px-1.5"
                    : "font-sans bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 font-medium text-[9px] xs:text-[10px] h-3.5 xs:h-4 px-1 xs:px-1.5"
                }
              >
                {category.visible ? "Visible" : "Masqué"}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 xs:gap-1.5 pt-1.5 xs:pt-2 border-t border-border/30">
              <div className="flex items-center gap-0.5 xs:gap-1 flex-1">
                <Switch
                  checked={category.visible}
                  onCheckedChange={() =>
                    handleToggleVisibility(category.id, category.visible)
                  }
                  className="data-[state=checked]:bg-green-500 scale-[0.6] xs:scale-[0.65]"
                />
                <span className="text-[10px] xs:text-[11px] text-muted-foreground font-sans">
                  {category.visible ? "Masquer" : "Afficher"}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 xs:h-7 xs:w-7 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                  asChild
                >
                  <Link href={`/admin/categories/${category.id}/edit`}>
                    <Pencil className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
                  </Link>
                </Button>
                <DeleteCategoryDialog
                  categoryId={category.id}
                  categoryName={category.name}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vue Tablette/Desktop - Table */}
      <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                <TableHead className="w-[80px] lg:w-[100px] font-sans font-semibold text-foreground text-xs lg:text-sm">
                  Image
                </TableHead>
                <TableHead className="font-sans font-semibold text-foreground text-xs lg:text-sm min-w-[150px]">
                  <div className="flex items-center gap-2">
                    Nom
                    <ArrowUpDown className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="font-sans font-semibold text-foreground text-xs lg:text-sm hidden lg:table-cell min-w-[120px]">
                  Slug
                </TableHead>
                <TableHead className="w-[110px] lg:w-[140px] font-sans font-semibold text-foreground text-xs lg:text-sm">
                  Formations
                </TableHead>
                <TableHead className="w-[120px] lg:w-[140px] font-sans font-semibold text-foreground text-xs lg:text-sm">
                  Visibilité
                </TableHead>
                <TableHead className="w-[60px] lg:w-[80px] font-sans font-semibold text-foreground text-center text-xs lg:text-sm">
                  Ordre
                </TableHead>
                <TableHead className="w-[100px] lg:w-[120px] text-right font-sans font-semibold text-foreground text-xs lg:text-sm">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((category) => (
                <TableRow
                  key={category.id}
                  className="hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
                >
                  <TableCell className="py-3 lg:py-4">
                    {category.imageUrl ? (
                      <div className="relative w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] rounded-lg overflow-hidden ring-2 ring-border/50 shadow-sm">
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center ring-2 ring-border/50">
                        <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-muted-foreground/50" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3 lg:py-4">
                    <div className="flex flex-col gap-0.5 lg:gap-1">
                      <span className="font-sans font-semibold text-foreground text-sm lg:text-base">
                        {category.name}
                      </span>
                      <code className="text-xs font-mono text-muted-foreground lg:hidden">
                        {category.slug}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 lg:py-4 hidden lg:table-cell">
                    <code className="px-2 py-1 bg-muted/50 rounded text-xs font-mono text-muted-foreground border border-border/50">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell className="py-3 lg:py-4">
                    <div className="flex items-center gap-1.5 lg:gap-2">
                      <div className="p-1 lg:p-1.5 rounded-md bg-blue-100 dark:bg-blue-950/30">
                        <BookOpen className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-sans font-medium text-xs lg:text-sm">
                        {category._count?.formations || 0}
                      </span>
                      <span className="font-sans text-xs text-muted-foreground hidden lg:inline">
                        formation
                        {(category._count?.formations || 0) > 1 ? "s" : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 lg:py-4">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <Switch
                        checked={category.visible}
                        onCheckedChange={() =>
                          handleToggleVisibility(category.id, category.visible)
                        }
                        className="data-[state=checked]:bg-green-500 scale-90 lg:scale-100"
                      />
                      <Badge
                        variant={category.visible ? "default" : "secondary"}
                        className={
                          category.visible
                            ? "font-sans bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 font-medium text-xs"
                            : "font-sans bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/20 font-medium text-xs"
                        }
                      >
                        {category.visible ? "Visible" : "Masqué"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 lg:py-4 text-center">
                    <div className="inline-flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-muted/50 border border-border/50">
                      <span className="font-sans font-semibold text-xs lg:text-sm text-foreground">
                        {category.order}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 lg:py-4">
                    <div className="flex items-center justify-end gap-0.5 lg:gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 lg:h-9 lg:w-9 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 transition-colors"
                        asChild
                      >
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
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
      </div>
    </>
  );
}
