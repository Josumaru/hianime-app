export interface Episodes {
  success: boolean;
  results: Results;
}

export interface Results {
  totalEpisodes: number;
  episodes: Episode[];
}

export interface Episode {
  episode_no: number;
  id: string;
  title: string;
  japanese_title: string;
  filler: boolean;
}
