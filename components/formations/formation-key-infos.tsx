import { Award, Calendar, CheckCircle, Clock, Euro, Users } from "lucide-react";

interface FormationKeyInfosProps {
  formation: {
    duration: string | null;
    level: string | null;
    price: number | null;
    isFlexible: boolean;
    maxStudents: number | null;
    isCertified: boolean;
  };
}

export default function FormationKeyInfos({
  formation,
}: FormationKeyInfosProps) {
  const infos = [
    {
      icon: Clock,
      value: formation.duration || "Variable",
      label: "Durée totale",
      show: true,
    },
    {
      icon: Award,
      value: formation.level || "Tous niveaux",
      label: "Niveau requis",
      show: true,
    },
    {
      icon: Euro,
      value: formation.price ? `${formation.price}€` : "Gratuit",
      label: "Prix HT",
      show: true,
    },
    {
      icon: Calendar,
      value: formation.isFlexible ? "Flexible" : "Programme fixe",
      label: "Rythme",
      show: true,
    },
    {
      icon: Users,
      value: formation.maxStudents
        ? `${formation.maxStudents} max`
        : "Illimité",
      label: "Par session",
      show: formation.maxStudents !== null,
    },
    {
      icon: CheckCircle,
      value: "Certifié",
      label: "Diplôme",
      show: formation.isCertified,
    },
  ].filter((info) => info.show);

  return (
    <section className="bg-cozetik-beige py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {infos.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-none bg-cozetik-green/10 flex items-center justify-center mb-4">
                  <Icon className="w-10 h-10 text-cozetik-green" />
                </div>
                <p className="font-display text-2xl text-cozetik-black uppercase">
                  {info.value}
                </p>
                <p className="text-sm font-sans text-gray-600 mt-1">
                  {info.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
