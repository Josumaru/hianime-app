export interface Servers {
  success: boolean;
  results: Result[];
}

export interface Result {
  type: string;
  data_id: string;
  server_id: string;
  serverName: string;
}
