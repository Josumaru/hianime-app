export interface MangadexSelfPublished {
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
  name: string;
  visibility: string;
  version: number;
}

export interface Relationship {
  id: string;
  type: string;
  attributes?: Attributes2;
}

export interface Attributes2 {
  username: string;
  roles: string[];
  version: number;
}
