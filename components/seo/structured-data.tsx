import { Organization, BreadcrumbList, Article, Course, FAQPage } from './structured-data-types'

type StructuredDataItem = Organization | BreadcrumbList | Article | Course | FAQPage

interface StructuredDataProps {
  data: StructuredDataItem | StructuredDataItem[]
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

