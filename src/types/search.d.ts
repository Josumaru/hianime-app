export interface Search {
  success: boolean;
  results: Results;
}

export interface Results {
  data: Data[];
  totalPage: number;
}

export interface Data {
  id: string;
  title: string;
  japanese_title: string;
  poster: string;
  duration: string;
  tvInfo: TvInfo;
}

export interface TvInfo {
  showType: string;
  rating?: string;
  sub: number;
  dub?: number;
  eps?: number;
}
