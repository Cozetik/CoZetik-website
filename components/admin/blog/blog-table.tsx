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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowUpDown, Calendar, Eye, EyeOff, Pencil, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteBlogPostDialog } from "./delete-blog-post-dialog";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  visible: boolean;
  publishedAt: string | null;
  createdAt: string;
  theme: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export default function BlogTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [items, setItems] = useState(posts);

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return format(new Date(date), "dd MMMM yyyy", { locale: fr });
  };

  const formatDateShort = (date: string | null) => {
    if (!date) return "—";
    return format(new Date(date), "dd/MM/yy", { locale: fr });
  };

  const handleToggleVisibility = async (postId: string) => {
    const originalItem = items.find((item) => item.id === postId);
    if (!originalItem) return;

    // Optimistic update
    const newVisibleState = !originalItem.visible;
    const newPublishedAt =
      newVisibleState && !originalItem.publishedAt
        ? new Date().toISOString()
        : originalItem.publishedAt;

    setItems((prev) =>
      prev.map((item) =>
        item.id === postId
          ? {
              ...item,
              visible: newVisibleState,
              publishedAt: newPublishedAt,
            }
          : item
      )
    );

    try {
      const response = await fetch(`/api/blog/${postId}/toggle-visibility`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      // Mettre à jour avec les données réelles du serveur
      setItems((prev) =>
        prev.map((item) =>
          item.id === postId
            ? {
                ...item,
                visible: data.visible,
                publishedAt: data.publishedAt,
              }
            : item
        )
      );

      toast.success(
        data.visible ? "Article publié avec succès" : "Article mis en brouillon"
      );
      router.refresh();
    } catch (error) {
      // Rollback en cas d'erreur
      setItems((prev) =>
        prev.map((item) => (item.id === postId ? originalItem : item))
      );
      toast.error(error instanceof Error ? error.message : "Erreur inconnue");
    }
  };

  return (
    <>
      {/* Vue Desktop (md et plus) */}
      <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
              <TableHead className="w-[80px] font-sans font-semibold text-foreground">
                Image
              </TableHead>
              <TableHead className="font-sans font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  Titre
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead className="w-[150px] font-sans font-semibold text-foreground">
                Thème
              </TableHead>
              <TableHead className="w-[120px] font-sans font-semibold text-foreground">
                Statut
              </TableHead>
              <TableHead className="w-[120px] font-sans font-semibold text-foreground">
                Visibilité
              </TableHead>
              <TableHead className="w-[180px] font-sans font-semibold text-foreground">
                Date de publication
              </TableHead>
              <TableHead className="w-[120px] text-right font-sans font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((post) => (
              <TableRow
                key={post.id}
                className="hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
              >
                <TableCell className="py-4">
                  {post.imageUrl ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-border/50 shadow-sm">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center border-2 border-border/50">
                      <span className="text-xs text-muted-foreground font-medium">
                        Pas d&apos;image
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-sans font-semibold text-foreground line-clamp-1">
                      {post.title}
                    </span>
                    <code className="text-xs text-muted-foreground font-mono">
                      /{post.slug}
                    </code>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  {post.theme ? (
                    <Badge
                      variant="outline"
                      className="font-sans bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20 font-medium"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {post.theme.name}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      Aucun thème
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant={post.visible ? "default" : "secondary"}
                    className={
                      post.visible
                        ? "font-sans bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 font-medium"
                        : "font-sans bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20 font-medium"
                    }
                  >
                    {post.visible ? "Publié" : "Brouillon"}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={post.visible}
                      onCheckedChange={() => handleToggleVisibility(post.id)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="font-sans">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 hover:bg-muted"
                    >
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteBlogPostDialog
                      postId={post.id}
                      postTitle={post.title}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Vue Mobile (moins de md) */}
      <div className="md:hidden space-y-2 xs:space-y-2.5">
        {items.map((post) => (
          <div
            key={post.id}
            className="rounded-lg xs:rounded-xl border border-border/50 bg-card p-2.5 xs:p-3 sm:p-4 space-y-2 xs:space-y-2.5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header avec image et titre */}
            <div className="flex gap-2 xs:gap-2.5">
              {post.imageUrl ? (
                <div className="relative w-14 h-14 xs:w-16 xs:h-16 rounded-md xs:rounded-lg overflow-hidden border border-border/50 shadow-sm shrink-0">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 xs:w-16 xs:h-16 bg-gradient-to-br from-muted to-muted/50 rounded-md xs:rounded-lg flex items-center justify-center border border-border/50 shrink-0">
                  <span className="text-[8px] xs:text-[9px] text-muted-foreground font-medium text-center px-1">
                    Pas d&apos;image
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-0.5 xs:space-y-1">
                <h3 className="font-sans font-semibold text-foreground text-xs xs:text-sm line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <code className="text-[9px] xs:text-[10px] text-muted-foreground font-mono block truncate">
                  /{post.slug}
                </code>
              </div>
            </div>

            {/* Thème et statut */}
            <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
              {post.theme ? (
                <Badge
                  variant="outline"
                  className="font-sans bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 font-medium text-[9px] xs:text-[10px] h-5 xs:h-6 px-1.5 xs:px-2"
                >
                  <Tag className="h-2 w-2 xs:h-2.5 xs:w-2.5 mr-0.5 xs:mr-1" />
                  {post.theme.name}
                </Badge>
              ) : (
                <span className="text-[9px] xs:text-[10px] text-muted-foreground italic">
                  Aucun thème
                </span>
              )}
              <Badge
                variant={post.visible ? "default" : "secondary"}
                className={
                  post.visible
                    ? "font-sans bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 font-medium text-[9px] xs:text-[10px] h-5 xs:h-6 px-1.5 xs:px-2"
                    : "font-sans bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 font-medium text-[9px] xs:text-[10px] h-5 xs:h-6 px-1.5 xs:px-2"
                }
              >
                {post.visible ? "Publié" : "Brouillon"}
              </Badge>
            </div>

            {/* Date de publication */}
            <div className="flex items-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs text-muted-foreground pt-1 xs:pt-1.5 border-t border-border/30">
              <Calendar className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
              <span className="font-sans">
                <span className="xs:hidden">
                  {formatDateShort(post.publishedAt)}
                </span>
                <span className="hidden xs:inline">
                  {formatDate(post.publishedAt)}
                </span>
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-1 xs:pt-1.5 border-t border-border/30">
              <div className="flex items-center gap-2 xs:gap-2.5">
                <span className="text-[10px] xs:text-xs text-muted-foreground font-medium">
                  Visibilité
                </span>
                <Switch
                  checked={post.visible}
                  onCheckedChange={() => handleToggleVisibility(post.id)}
                  className="data-[state=checked]:bg-green-500 scale-75 xs:scale-90"
                />
                {post.visible ? (
                  <Eye className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-green-600" />
                ) : (
                  <EyeOff className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-orange-600" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-7 w-7 xs:h-8 xs:w-8 hover:bg-muted"
                >
                  <Link href={`/admin/blog/${post.id}/edit`}>
                    <Pencil className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                  </Link>
                </Button>
                <DeleteBlogPostDialog postId={post.id} postTitle={post.title} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
