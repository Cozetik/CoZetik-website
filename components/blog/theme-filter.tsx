import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link href="/blog">
        <Badge
          variant={!activeTheme ? "default" : "outline"}
          className={cn(
            "cursor-pointer text-sm py-1 px-3 hover:bg-primary hover:text-primary-foreground transition-colors",
            !activeTheme && "bg-primary text-primary-foreground"
          )}
        >
          Tous
        </Badge>
      </Link>

      {themes.map((theme) => {
        const isActive = activeTheme === theme.slug;
        return (
          <Link key={theme.id} href={`/blog?theme=${theme.slug}`}>
            <Badge
              variant={isActive ? "default" : "outline"}
              className={cn(
                "cursor-pointer text-sm py-1 px-3 hover:bg-primary hover:text-primary-foreground transition-colors",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              {theme.name}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
