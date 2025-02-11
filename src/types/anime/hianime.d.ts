export interface Hianime {
  success: boolean;
  results: Results;
}

export interface Results {
  spotlights: Spotlight[];
  trending: Trending[];
  topTen: TopTen;
  today: Today;
  topAiring: Anime[];
  mostPopular: Anime[];
  mostFavorite: Anime[];
  latestComplete: Anime[];
  latestEpisode: Anime[];
  topUpcoming: Anime[];
  // topUpcoming: TopUpcoming[];
  recentlyAdded: Anime[];
  genres: string[];
}

export interface Anime {
  id: string;
  data_id: string;
  poster: string;
  title: string;
  japanese_title: string;
  description: string;
  tvInfo: AnimeTvInfo;
  adultContent: boolean;
}

export interface AnimeTvInfo {
  showType: ShowType;
  duration: string;
  sub?: string;
  eps?: string;
  dub?: string;
}

export enum ShowType {
  Movie = "Movie",
  Ona = "ONA",
  Ova = "OVA",
  Special = "Special",
  TVEps = "TV (? eps)",
  Tv = "TV",
}

export interface Spotlight {
  id: string;
  data_id: string;
  poster: string;
  title: string;
  japanese_title: string;
  description: string;
  tvInfo: SpotlightTvInfo;
}

export interface SpotlightTvInfo {
  showType: ShowType;
  duration: Duration;
  releaseDate: string;
  quality: Quality;
  episodeInfo: EpisodeInfo;
}

export enum Duration {
  The23M = "23m",
  The24M = "24m",
}

export interface EpisodeInfo {
  sub: string;
  dub: string;
}

export enum Quality {
  HD = "HD",
}

export interface Today {
  schedule: Schedule[];
}

export interface Schedule {
  id: string;
  data_id: string;
  title: string;
  japanese_title: string;
  releaseDate: Date;
  time: string;
  episode_no: string;
}

export interface TopTen {
  today: Anime[];
  week: Anime[];
  month: Anime[];
}
// export interface TopTen {
//   today: Trending[];
//   week: Trending[];
//   month: Trending[];
// }

export interface Trending {
  id: string;
  data_id: string;
  number: string;
  title: string;
  japanese_title: string;
  poster: string;
  tvInfo?: TrendingTvInfo;
}

export interface TrendingTvInfo {
  sub: string;
  dub?: string;
  eps?: string;
}

export interface TopUpcoming {
  id: string;
  data_id: string;
  poster: string;
  title: string;
  japanese_title: string;
  description: string;
  tvInfo: TopUpcomingTvInfo;
  adultContent: boolean;
}

export interface TopUpcomingTvInfo {
  showType: string;
  duration: string;
}
