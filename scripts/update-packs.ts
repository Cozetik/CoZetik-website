import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Lancement de la mise à jour des packs...");

  const packs = await prisma.formationPack.findMany();
  console.log(`📦 ${packs.length} packs trouvés.`);

  for (const pack of packs) {
    let newFeatures = [...pack.features];
    const name = pack.name.toLowerCase();

    // Supprimer les anciennes mentions de nombre de formations si elles existent
    newFeatures = newFeatures.filter(f => !f.toLowerCase().includes("formation") || !f.toLowerCase().includes("offerte"));

    if (name.includes("découverte") || name.includes("decouverte")) {
      newFeatures.unshift("1 formation au choix");
    } else if (name.includes("premium")) {
      newFeatures.unshift("2 formations au choix (1 offerte)");
    } else if (name.includes("expert")) {
      newFeatures.unshift("3 formations au choix (2 offertes)");
    } else {
      // Pour les autres packs s'il y en a
      newFeatures.unshift("Formations au choix");
    }

    // Retirer les doublons potentiels
    newFeatures = [...new Set(newFeatures)];

    await prisma.formationPack.update({
      where: { id: pack.id },
      data: { features: newFeatures },
    });
    console.log(`✅ Pack "${pack.name}" mis à jour (${pack.id})`);
  }

  console.log("✨ Mise à jour terminée !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
