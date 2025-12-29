// Types pour les structured data JSON-LD

export interface Organization {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  url: string
  logo?: string
  description?: string
  address?: {
    '@type': 'PostalAddress'
    streetAddress?: string
    addressLocality?: string
    postalCode?: string
    addressCountry?: string
  }
  contactPoint?: {
    '@type': 'ContactPoint'
    telephone?: string
    contactType?: string
    email?: string
    areaServed?: string
    availableLanguage?: string[]
  }
  sameAs?: string[]
}

export interface BreadcrumbList {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}

export interface Article {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  description?: string
  image?: string | string[]
  datePublished?: string
  dateModified?: string
  author?: {
    '@type': 'Organization' | 'Person'
    name: string
  }
  publisher?: {
    '@type': 'Organization'
    name: string
    logo?: {
      '@type': 'ImageObject'
      url: string
    }
  }
}

export interface Course {
  '@context': 'https://schema.org'
  '@type': 'Course'
  name: string
  description?: string
  provider?: {
    '@type': 'Organization'
    name: string
    url?: string
  }
  courseCode?: string
  educationalCredentialAwarded?: string
  teaches?: string[]
  coursePrerequisites?: string
}

