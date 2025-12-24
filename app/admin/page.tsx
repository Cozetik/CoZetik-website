import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Tags, FileText, Mail, UserPlus, Briefcase } from 'lucide-react'

export default async function AdminDashboardPage() {
  // Récupérer toutes les statistiques en parallèle pour optimiser les performances
  const [
    totalFormations,
    activeCategories,
    publishedBlogPosts,
    newContactRequests,
    newInscriptions,
    newCandidatures,
  ] = await Promise.all([
    prisma.formation.count(),
    prisma.category.count({ where: { visible: true } }),
    prisma.blogPost.count({ where: { visible: true } }),
    prisma.contactRequest.count({ where: { status: 'NEW' } }),
    prisma.formationInscription.count({ where: { status: 'NEW' } }),
    prisma.candidature.count({ where: { status: 'NEW' } }),
  ])

  const stats = [
    {
      title: 'Total Formations',
      value: totalFormations,
      icon: GraduationCap,
      description: 'Formations créées',
      color: 'text-blue-600',
    },
    {
      title: 'Catégories Actives',
      value: activeCategories,
      icon: Tags,
      description: 'Catégories visibles',
      color: 'text-green-600',
    },
    {
      title: 'Articles Publiés',
      value: publishedBlogPosts,
      icon: FileText,
      description: 'Articles de blog',
      color: 'text-purple-600',
    },
    {
      title: 'Demandes Contact',
      value: newContactRequests,
      icon: Mail,
      description: 'Non traitées',
      color: 'text-orange-600',
      badge: newContactRequests > 0 ? 'Nouveau' : undefined,
    },
    {
      title: 'Inscriptions',
      value: newInscriptions,
      icon: UserPlus,
      description: 'Non traitées',
      color: 'text-red-600',
      badge: newInscriptions > 0 ? 'Nouveau' : undefined,
    },
    {
      title: 'Candidatures',
      value: newCandidatures,
      icon: Briefcase,
      description: 'Non traitées',
      color: 'text-indigo-600',
      badge: newCandidatures > 0 ? 'Nouveau' : undefined,
    },
  ]

  // Formater les nombres avec séparateurs de milliers
  const formatNumber = (num: number): string => {
    return num.toLocaleString('fr-FR')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Vue d&apos;ensemble de votre plateforme
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stat.value)}</div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                {stat.badge && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0">
                    {stat.badge}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
