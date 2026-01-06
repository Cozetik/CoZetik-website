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
import { ArrowUpDown, Pencil, Smile, Type } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DeleteProfileDialog from "./delete-profile-dialog";

interface Profile {
  id: string;
  letter: string;
  emoji: string;
  name: string;
  programmeSignature: string;
  visible: boolean;
}

export default function ProfilesTable({ profiles }: { profiles: Profile[] }) {
  const router = useRouter();
  const [items, setItems] = useState(profiles);

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(
        `/api/quiz/profiles/${id}/toggle-visibility`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      setItems(
        items.map((item) =>
          item.id === id ? { ...item, visible: !currentValue } : item
        )
      );

      toast.success(data.visible ? "Profil rendu visible" : "Profil masqué");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue");
    }
  };

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
            <TableHead className="w-[100px] font-sans font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <Type className="h-3.5 w-3.5 text-muted-foreground" />
                Lettre
              </div>
            </TableHead>
            <TableHead className="w-[80px] font-sans font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <Smile className="h-3.5 w-3.5 text-muted-foreground" />
                Emoji
              </div>
            </TableHead>
            <TableHead className="font-sans font-semibold text-foreground">
              <div className="flex items-center gap-2">
                Nom du profil
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead className="w-[200px] font-sans font-semibold text-foreground">
              Programme signature
            </TableHead>
            <TableHead className="w-[120px] font-sans font-semibold text-foreground">
              Visibilité
            </TableHead>
            <TableHead className="w-[150px] text-right font-sans font-semibold text-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((profile) => (
            <TableRow
              key={profile.id}
              className="hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
            >
              <TableCell className="py-4">
                <Badge
                  variant="outline"
                  className="font-mono text-lg font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 px-3 py-1"
                >
                  {profile.letter}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <span className="text-3xl">{profile.emoji}</span>
              </TableCell>
              <TableCell className="py-4">
                <span className="font-sans font-semibold text-foreground">
                  {profile.name}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <Badge
                  variant="secondary"
                  className="font-sans bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 font-medium"
                >
                  {profile.programmeSignature}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={profile.visible}
                    onCheckedChange={() =>
                      handleToggleVisibility(profile.id, profile.visible)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Badge
                    variant={profile.visible ? "default" : "secondary"}
                    className={
                      profile.visible
                        ? "font-sans bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 font-medium"
                        : "font-sans bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/20 font-medium"
                    }
                  >
                    {profile.visible ? "Visible" : "Masqué"}
                  </Badge>
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
                    <Link href={`/admin/quiz/profiles/${profile.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteProfileDialog
                    profileId={profile.id}
                    profileName={profile.name}
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
