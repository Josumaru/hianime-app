export interface Info {
  success: boolean;
  results: Results;
}

export interface Results {
  data: Data;
  seasons: Season[];
}

export interface Data {
  adultContent: boolean;
  data_id: string;
  id: string;
  title: string;
  japanese_title: string;
  poster: string;
  showType: ShowType;
  animeInfo: AnimeInfo;
  charactersVoiceActors: CharactersVoiceActor[];
  recommended_data: EdDatum[];
  related_data: EdDatum[];
}

export interface AnimeInfo {
  Overview: string;
  Japanese: string;
  Synonyms: string;
  Aired: string;
  Premiered: string;
  Duration: string;
  Status: string;
  "MAL Score": string;
  Genres: string[];
  Studios: string;
  Producers: string[];
  tvInfo: AnimeInfoTvInfo;
}

export interface AnimeInfoTvInfo {
  rating: string;
  quality: string;
  sub: string;
  showType: ShowType;
  duration: string;
}

export enum ShowType {
  Ona = "ONA",
  Tv = "TV",
}

export interface EdDatum {
  data_id: string;
  id: string;
  title: string;
  japanese_title: string;
  poster: string;
  tvInfo: RecommendedDatumTvInfo;
  adultContent: boolean;
}

export interface RecommendedDatumTvInfo {
  showType: ShowType;
  duration?: string;
  sub: string;
  dub?: string;
  eps?: string;
}

export interface CharactersVoiceActor {
  character: Character
  voiceActors: VoiceActor[]
}

export interface Character {
  id: string
  poster: string
  name: string
  cast: string
}

export interface VoiceActor {
  id: string
  poster: string
  name: string
}
export interface Season {
  id: string
  data_number: number
  data_id: number
  season: string
  title: string
  season_poster: string
}