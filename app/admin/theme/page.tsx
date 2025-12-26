import ThemeManager from "@/components/admin/theme/theme-manager";
import { prisma } from "@/lib/prisma";

export default async function ThemePage() {
  const themes = await prisma.theme.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Thèmes</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les thématiques du blog
        </p>
      </div>

      <ThemeManager initialThemes={themes} />
    </div>
  );
}
