export interface Schedule {
  success: boolean;
  results: Result[];
}

export interface Result {
  id: string;
  data_id: string;
  title: string;
  japanese_title: string;
  releaseDate: string;
  time: string;
  episode_no: string;
}
