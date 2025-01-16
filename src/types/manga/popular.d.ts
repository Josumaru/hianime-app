export interface PopularManga {
  result: string;
  response: string;
  data: Data[];
  limit: number;
  offset: number;
  total: number;
}

export interface Data {
  id: string;
  type: string;
  attributes: Attributes;
  relationships: Relationship[];
}

export interface Attributes {
  title: Title;
  altTitles: AltTitle[];
  description: Description;
  isLocked: boolean;
  links: Links;
  originalLanguage: string;
  lastVolume: string;
  lastChapter: string;
  publicationDemographic?: string;
  status: string;
  year?: number;
  contentRating: string;
  tags: Tag[];
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  availableTranslatedLanguages: string[];
  latestUploadedChapter: string;
}

export interface Title {
  en: string;
}

export interface AltTitle {
  en?: string;
  "ja-ro"?: string;
  ja?: string;
  "pt-br"?: string;
  vi?: string;
  ko?: string;
  "es-la"?: string;
}

export interface Description {
  en?: string;
  ja?: string;
  "pt-br"?: string;
  vi?: string;
}

export interface Links {
  al?: string;
  ap?: string;
  kt?: string;
  mu?: string;
  nu?: string;
  amz?: string;
  ebj?: string;
  mal?: string;
  raw: string;
  bw?: string;
  cdj?: string;
}

export interface Tag {
  id: string;
  type: string;
  attributes: Attributes2;
  relationships: any[];
}

export interface Attributes2 {
  name: Name;
  description: Description2;
  group: string;
  version: number;
}

export interface Name {
  en: string;
}

export interface Description2 {}

export interface Relationship {
  id: string;
  type: string;
  attributes?: Attributes3;
  related?: string;
}

export interface Attributes3 {
  name?: string;
  imageUrl: any;
  biography?: Biography;
  twitter?: string;
  pixiv?: string;
  melonBook: any;
  fanBox?: string;
  booth: any;
  namicomi: any;
  nicoVideo: any;
  skeb: any;
  fantia: any;
  tumblr?: string;
  youtube: any;
  weibo: any;
  naver: any;
  website?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  description?: string;
  volume?: string;
  fileName?: string;
  locale?: string;
}

export interface Biography {
  en?: string;
}
