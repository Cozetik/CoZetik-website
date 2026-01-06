"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Edit,
  HelpCircle,
  ListOrdered,
  MoreVertical,
  Settings,
} from "lucide-react";
import Link from "next/link";
import DeleteFormationDialog from "./delete-formation-dialog";

interface FormationCardMenuProps {
  formationId: string;
  formationTitle: string;
  stepsCount: number;
  faqsCount: number;
  sessionsCount: number;
}

export default function FormationCardMenu({
  formationId,
  formationTitle,
  stepsCount,
  faqsCount,
  sessionsCount,
}: FormationCardMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors rounded-lg"
        >
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl shadow-lg border-gray-200"
      >
        <DropdownMenuLabel className="font-bricolage font-semibold text-gray-900 px-3 py-2">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-blue-600" />
            Actions
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100" />

        <DropdownMenuItem
          asChild
          className="focus:bg-blue-50 cursor-pointer rounded-lg mx-1 my-0.5"
        >
          <Link
            href={`/admin/formations/${formationId}/edit`}
            className="flex items-center px-2 py-2"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 mr-3">
              <Edit className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-sm">Modifier</div>
              <div className="text-xs text-gray-500">Éditer la formation</div>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-100 my-1" />

        <div className="px-1 py-1 space-y-0.5">
          <DropdownMenuItem
            asChild
            className="focus:bg-purple-50 cursor-pointer rounded-lg"
          >
            <Link
              href={`/admin/formations/${formationId}/steps`}
              className="flex items-center px-2 py-2"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-purple-100 mr-2.5">
                <ListOrdered className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-700">Étapes</span>
              <span className="ml-auto text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                {stepsCount}
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="focus:bg-amber-50 cursor-pointer rounded-lg"
          >
            <Link
              href={`/admin/formations/${formationId}/faqs`}
              className="flex items-center px-2 py-2"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-100 mr-2.5">
                <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <span className="text-sm text-gray-700">FAQs</span>
              <span className="ml-auto text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                {faqsCount}
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="focus:bg-green-50 cursor-pointer rounded-lg"
          >
            <Link
              href={`/admin/formations/${formationId}/sessions`}
              className="flex items-center px-2 py-2"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-green-100 mr-2.5">
                <Calendar className="h-3.5 w-3.5 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Sessions</span>
              <span className="ml-auto text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                {sessionsCount}
              </span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-gray-100 my-1" />

        <DropdownMenuItem
          className="focus:bg-red-50 cursor-pointer rounded-lg mx-1 my-0.5 text-red-600"
          onSelect={(e) => e.preventDefault()}
        >
          <DeleteFormationDialog
            formationId={formationId}
            formationTitle={formationTitle}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
