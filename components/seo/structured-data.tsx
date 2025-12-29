import { Organization, BreadcrumbList, Article, Course } from './structured-data-types'

interface StructuredDataProps {
  data: Organization | BreadcrumbList | Article | Course | (Organization | BreadcrumbList | Article | Course)[]
}

export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data]
  
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}

