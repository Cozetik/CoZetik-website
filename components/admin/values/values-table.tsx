"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DeleteValueDialog from "./delete-value-dialog";
import EditValueDialog from "./edit-value-dialog";

interface Value {
  id: string;
  order: number;
  title: string;
  description: string;
  visible: boolean;
}

export default function ValuesTable({ values }: { values: Value[] }) {
  const router = useRouter();
  const [items, setItems] = useState(values);

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    const newValue = !currentValue;
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, visible: newValue } : item
      )
    );

    try {
      const response = await fetch(`/api/values/${id}/toggle-visibility`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      toast.success(data.visible ? "Valeur rendue visible" : "Valeur masquée");
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
            <TableHead className="w-[80px] font-sans font-semibold text-foreground text-center">
              Ordre
            </TableHead>
            <TableHead className="font-sans font-semibold text-foreground">
              <div className="flex items-center gap-2">
                Titre
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead className="font-sans font-semibold text-foreground max-w-[500px]">
              Description
            </TableHead>
            <TableHead className="w-[140px] font-sans font-semibold text-foreground">
              Visibilité
            </TableHead>
            <TableHead className="w-[120px] text-right font-sans font-semibold text-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((value) => (
            <TableRow
              key={value.id}
              className="hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
            >
              <TableCell className="py-4 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 border border-border/50">
                  <span className="font-sans font-semibold text-sm text-foreground">
                    {value.order}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-semibold text-foreground">
                    {value.title}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4 max-w-[500px]">
                <p className="font-sans text-sm text-muted-foreground line-clamp-2">
                  {value.description}
                </p>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={value.visible}
                    onCheckedChange={() =>
                      handleToggleVisibility(value.id, value.visible)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Badge
                    variant={value.visible ? "default" : "secondary"}
                    className={
                      value.visible
                        ? "font-sans bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 font-medium"
                        : "font-sans bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/20 font-medium"
                    }
                  >
                    {value.visible ? "Visible" : "Masqué"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center justify-end gap-1">
                  <EditValueDialog value={value} />
                  <DeleteValueDialog
                    valueId={value.id}
                    valueTitle={value.title}
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
