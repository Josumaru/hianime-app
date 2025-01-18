export interface MangadexDetail {
  result: string;
  response: string;
  data: Data;
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
  publicationDemographic: string;
  status: string;
  year: number;
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
  ja?: string;
  en?: string;
}

export interface Description {
  en: string;
}

export interface Links {
  al: string;
  ap: string;
  bw: string;
  kt: string;
  mu: string;
  amz: string;
  ebj: string;
  mal: string;
  raw: string;
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
  attributes: Attributes3;
}

export interface Attributes3 {
  name?: string;
  imageUrl: any;
  biography?: Biography;
  twitter: any;
  pixiv: any;
  melonBook: any;
  fanBox: any;
  booth: any;
  namicomi: any;
  nicoVideo: any;
  skeb: any;
  fantia: any;
  tumblr: any;
  youtube: any;
  weibo: any;
  naver: any;
  website: any;
  createdAt: string;
  updatedAt: string;
  version: number;
  description?: string;
  volume?: string;
  fileName?: string;
  locale?: string;
}

export interface Biography {}
