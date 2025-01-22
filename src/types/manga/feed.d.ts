export interface MangadexFeed {
    result: string
    response: string
    data: Feed[]
    limit: number
    offset: number
    total: number
  }
  
  export interface Feed {
    id: string
    type: string
    attributes: Attributes
    relationships: Relationship[]
  }
  
  export interface Attributes {
    volume: string
    chapter: string
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
  }
  