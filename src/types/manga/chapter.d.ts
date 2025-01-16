export interface MangadexChapter {
    result: string
    response: string
    data: Chapter[]
    limit: number
    offset: number
    total: number
  }
  
  export interface Chapter {
    id: string
    type: string
    attributes: Attributes
    relationships: Relationship[]
  }
  
  export interface Attributes {
    volume?: string
    chapter?: string
    title?: string
    translatedLanguage: string
    externalUrl: any
    publishAt: string
    readableAt: string
    createdAt: string
    updatedAt: string
    pages: number
    version: number
  }
  
  export interface Relationship {
    id: string
    type: string
    attributes?: Attributes2
  }
  
  export interface Attributes2 {
    name: string
    altNames: AltName[]
    locked: boolean
    website?: string
    ircServer?: string
    ircChannel: any
    discord?: string
    contactEmail?: string
    description: string
    twitter?: string
    mangaUpdates?: string
    focusedLanguages: string[]
    official: boolean
    verified: boolean
    inactive: boolean
    publishDelay: any
    exLicensed?: boolean
    createdAt: string
    updatedAt: string
    version: number
  }
  
  export interface AltName {
    en: string
  }
  