"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Euro, List, Star, TrendingDown } from "lucide-react";
import DeletePackDialog from "./delete-pack-dialog";
import EditPackDialog from "./edit-pack-dialog";

interface Pack {
  id: string;
  order: number;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  savings: string | null;
  features: string[];
  isPopular: boolean;
}

export default function PacksTable({
  packs,
  formationId,
}: {
  packs: Pack[];
  formationId: string;
}) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="w-[80px] font-bricolage font-semibold text-gray-700 text-center">
                Ordre
              </TableHead>
              <TableHead className="font-bricolage font-semibold text-gray-700">
                Pack
              </TableHead>
              <TableHead className="w-[180px] font-bricolage font-semibold text-gray-700">
                Prix
              </TableHead>
              <TableHead className="w-[140px] font-bricolage font-semibold text-gray-700">
                Inclusions
              </TableHead>
              <TableHead className="w-[140px] font-bricolage font-semibold text-gray-700">
                Populaire
              </TableHead>
              <TableHead className="w-[140px] text-right font-bricolage font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packs.map((pack) => (
              <TableRow
                key={pack.id}
                className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-colors"
              >
                <TableCell className="font-medium font-sans">
                  <div className="flex items-center justify-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 font-bold text-sm shadow-sm border border-gray-200">
                      {pack.order}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="font-bricolage font-bold text-gray-900 text-base">
                      {pack.name}
                    </div>
                    {pack.description && (
                      <div className="text-sm text-gray-500 line-clamp-1 font-sans italic">
                        {pack.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-sans">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <div className="rounded-lg bg-emerald-100 p-1.5">
                        <Euro className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-bold">
                        {pack.price}€
                      </span>
                    </div>
                    {pack.originalPrice && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <TrendingDown className="h-3.5 w-3.5" />
                        <span className="text-xs line-through">
                          {pack.originalPrice}€
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="font-sans bg-blue-50 text-blue-700 border-blue-100"
                  >
                    <List className="mr-1.5 h-3.5 w-3.5" />
                    {pack.features.length} point
                    {pack.features.length > 1 ? "s" : ""}
                  </Badge>
                </TableCell>
                <TableCell>
                  {pack.isPopular ? (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
                      <Star className="mr-1.5 h-3.5 w-3.5 fill-yellow-700" />
                      Oui
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-400">Non</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <EditPackDialog formationId={formationId} pack={pack} />
                    <DeletePackDialog
                      formationId={formationId}
                      packId={pack.id}
                      packName={pack.name}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
