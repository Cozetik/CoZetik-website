import { prisma } from "@/lib/prisma";
import Sidebar from "./sidebar";

export default async function SidebarWrapper() {
  const [newContactRequests, newCandidatures, newInscriptions] =
    await Promise.all([
      prisma.contactRequest.count({ where: { status: "NEW" } }),
      prisma.candidature.count({ where: { status: "NEW" } }),
      prisma.formationInscription.count({ where: { status: "NEW" } }),
    ]);

  return (
    <Sidebar
      badges={{
        contacts: newContactRequests,
        candidatures: newCandidatures,
        inscriptions: newInscriptions,
      }}
    />
  );
}
