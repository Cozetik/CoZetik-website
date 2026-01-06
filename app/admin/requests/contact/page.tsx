import ContactRequestsTable from "@/components/admin/requests/contact-requests-table";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { CheckCircle, Mail, MessageSquare } from "lucide-react";

export default async function ContactRequestsPage() {
  const requests = await prisma.contactRequest.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  // Sérialiser les dates pour le client
  const serializedRequests = requests.map((request) => ({
    ...request,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  }));

  const stats = {
    total: requests.length,
    new: requests.filter((r) => r.status === RequestStatus.NEW).length,
    treated: requests.filter((r) => r.status === RequestStatus.TREATED).length,
    archived: requests.filter((r) => r.status === RequestStatus.ARCHIVED)
      .length,
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bricolage font-bold tracking-tight text-gray-900">
          Demandes de contact
        </h1>
        <p className="mt-2 text-gray-600">
          Gérez les demandes de contact reçues via le formulaire
        </p>
      </div>

      {/* Stats Cards */}
      {requests.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-bricolage text-gray-700 font-semibold">
                  Total demandes
                </p>
              </div>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.total}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-2.5 shadow-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-bricolage text-gray-700 font-semibold">
                  Nouvelles
                </p>
              </div>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.new}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-2.5 shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-bricolage text-gray-700 font-semibold">
                  Traitées
                </p>
              </div>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.treated}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-gradient-to-br from-gray-50 to-slate-50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-gradient-to-br from-gray-500 to-slate-500 p-2.5 shadow-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-bricolage text-gray-700 font-semibold">
                  Archivées
                </p>
              </div>
              <p className="text-3xl font-bold font-bricolage text-gray-900">
                {stats.archived}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bricolage font-semibold text-gray-900">
          Toutes les demandes
        </h2>

        {requests.length === 0 ? (
          <Card className="rounded-2xl border-2 border-dashed border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Mail className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Aucune demande reçue
              </p>
              <p className="text-gray-600 text-center max-w-sm">
                Les demandes de contact apparaîtront ici
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-card overflow-hidden">
            <ContactRequestsTable requests={serializedRequests} />
          </div>
        )}
      </div>
    </div>
  );
}
