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
    <div className="rounded-lg sm:rounded-xl border border-border/50 overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
              <TableHead className="w-[40px] xxs:w-[50px] xs:w-[60px] sm:w-[80px] font-sans font-semibold text-foreground text-center text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm px-1 xxs:px-2">
                Ordre
              </TableHead>
              <TableHead className="font-sans font-semibold text-foreground text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm min-w-[80px] xxs:min-w-[100px] xs:min-w-[120px] px-1 xxs:px-2">
                <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2">
                  Titre
                  <ArrowUpDown className="h-2 w-2 xxs:h-2.5 xxs:w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead className="font-sans font-semibold text-foreground text-xs sm:text-sm max-w-[200px] sm:max-w-[500px] hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="w-[70px] xxs:w-[90px] xs:w-[100px] sm:w-[140px] font-sans font-semibold text-foreground text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm px-1 xxs:px-2">
                Visibilité
              </TableHead>
              <TableHead className="w-[60px] xxs:w-[70px] xs:w-[80px] sm:w-[120px] text-right font-sans font-semibold text-foreground text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm px-1 xxs:px-2">
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
                <TableCell className="py-1.5 xxs:py-2 xs:py-3 sm:py-4 text-center px-1 xxs:px-2">
                  <div className="inline-flex items-center justify-center w-5 h-5 xxs:w-6 xxs:h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-muted/50 border border-border/50">
                    <span className="font-sans font-semibold text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm text-foreground">
                      {value.order}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-1.5 xxs:py-2 xs:py-3 sm:py-4 px-1 xxs:px-2">
                  <div className="flex flex-col gap-0.5 xs:gap-1">
                    <span className="font-sans font-semibold text-[10px] xxs:text-xs xs:text-sm sm:text-base text-foreground line-clamp-2">
                      {value.title}
                    </span>
                    <p className="font-sans text-[9px] xxs:text-[10px] xs:text-xs text-muted-foreground line-clamp-2 md:hidden">
                      {value.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="py-3 sm:py-4 max-w-[200px] sm:max-w-[500px] hidden md:table-cell">
                  <p className="font-sans text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {value.description}
                  </p>
                </TableCell>
                <TableCell className="py-1.5 xxs:py-2 xs:py-3 sm:py-4 px-1 xxs:px-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 xxs:gap-1.5 xs:gap-2 sm:gap-3">
                    <Switch
                      checked={value.visible}
                      onCheckedChange={() =>
                        handleToggleVisibility(value.id, value.visible)
                      }
                      className="data-[state=checked]:bg-green-500 scale-[0.65] xxs:scale-75 xs:scale-90 sm:scale-100"
                    />
                    <Badge
                      variant={value.visible ? "default" : "secondary"}
                      className={
                        value.visible
                          ? "font-sans bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 font-medium text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-xs px-1.5 xxs:px-2"
                          : "font-sans bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20 hover:bg-gray-500/20 font-medium text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-xs px-1.5 xxs:px-2"
                      }
                    >
                      {value.visible ? "Visible" : "Masqué"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="py-1.5 xxs:py-2 xs:py-3 sm:py-4 px-1 xxs:px-2">
                  <div className="flex items-center justify-end gap-0.5 sm:gap-1">
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
    </div>
  );
}
