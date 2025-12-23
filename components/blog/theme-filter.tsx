"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface Theme {
  id: string;
  name: string;
  slug: string;
}

interface ThemeFilterProps {
  themes: Theme[];
  activeTheme?: string;
}

export function ThemeFilter({ themes, activeTheme }: ThemeFilterProps) {
  const router = useRouter();

  const handleValueChange = (value: string) => {
    if (value === "all") {
      router.push("/blog");
    } else {
      router.push(`/blog?theme=${value}`);
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="w-full max-w-xs font-sans">
        <Select value={activeTheme || "all"} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrer par thème" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-sans">
              Tous les articles
            </SelectItem>
            {themes.map((theme) => (
              <SelectItem
                key={theme.id}
                value={theme.slug}
                className="font-sans"
              >
                {theme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
