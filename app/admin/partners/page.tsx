import PartnersTable from "@/components/admin/partners/partners-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Handshake, Plus, Users } from "lucide-react";
import Link from "next/link";

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { order: "asc" },
  });

  const stats = {
    total: partners.length,
    visible: partners.filter((p) => p.visible).length,
    hidden: partners.filter((p) => !p.visible).length,
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bricolage font-bold tracking-tight text-gray-900">
            Partenaires
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez vos entreprises partenaires
          </p>
        </div>
        <Link href="/admin/partners/new">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nouveau Partenaire
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {partners.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-lg">
                  <Handshake className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-bricolage text-gray-700">
                  Total partenaires
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.total}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-bricolage text-gray-700">
                  Visibles
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.visible}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-2.5 shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm font-bricolage text-gray-700">
                  Masqués
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.hidden}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Partners List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bricolage font-semibold text-gray-900">
          Tous les partenaires
        </h2>

        {partners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-muted/30 to-muted/10">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-6 mb-6 shadow-lg">
              <Handshake className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bricolage font-bold mb-2">
              Aucun partenaire créé
            </h3>
            <p className="text-base font-sans text-muted-foreground mb-8 text-center max-w-md leading-relaxed">
              Commencez par ajouter votre premier partenaire pour développer
              votre réseau
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg font-sans font-semibold"
            >
              <Link href="/admin/partners/new">
                <Plus className="mr-2 h-5 w-5" />
                Créer un partenaire
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <PartnersTable partners={partners} />
          </div>
        )}
      </div>
    </div>
  );
}
