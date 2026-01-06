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
import { Pencil } from "lucide-react";
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
}

export default function BlogTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [items, setItems] = useState(posts);

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return format(new Date(date), "dd/MM/yyyy", { locale: fr });
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
    <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="w-[80px] font-medium">Image</TableHead>
            <TableHead className="font-medium">Titre</TableHead>
            <TableHead className="w-[120px] font-medium">Statut</TableHead>
            <TableHead className="w-[100px] font-medium">Publié</TableHead>
            <TableHead className="w-[150px] font-medium">
              Date publication
            </TableHead>
            <TableHead className="w-[120px] font-medium">Créé le</TableHead>
            <TableHead className="w-[120px] text-right font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((post) => (
            <TableRow
              key={post.id}
              className="border-border/50 hover:bg-muted/30 transition-colors"
            >
              <TableCell>
                {post.imageUrl ? (
                  <div className="relative w-[60px] h-[60px] rounded-md overflow-hidden border border-border/50 bg-muted/50">
                    <Image
                      src={post.imageUrl || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-[60px] h-[60px] bg-muted/50 rounded-md flex items-center justify-center border border-border/50">
                    <span className="text-xs text-muted-foreground font-medium">
                      Img
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium max-w-[300px] truncate">
                {post.title}
              </TableCell>
              <TableCell>
                <Badge
                  variant={post.visible ? "default" : "secondary"}
                  className={
                    post.visible
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
                      : "bg-muted/80 text-muted-foreground hover:bg-muted border-border/50"
                  }
                >
                  {post.visible ? "Publié" : "Brouillon"}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch
                  checked={post.visible}
                  onCheckedChange={() => handleToggleVisibility(post.id)}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(post.publishedAt)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(post.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9 hover:bg-muted/80 transition-colors"
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
  );
}
