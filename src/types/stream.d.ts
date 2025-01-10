export interface Stream {
    success: boolean
    results: Results
  }
  
  export interface Results {
    streamingLink: StreamingLink
    servers: Server[]
  }
  
  export interface StreamingLink {
    id: string
    type: string
    link: Link
    tracks: Track[]
    intro: Intro
    outro: Outro
    server: string
  }
  
  export interface Link {
    file: string
    type: string
  }
  
  export interface Track {
    file: string
    label?: string
    kind: string
    default?: boolean
  }
  
  export interface Intro {
    start: number
    end: number
  }
  
  export interface Outro {
    start: number
    end: number
  }
  
  export interface Server {
    type: string
    data_id: string
    server_id: string
    serverName: string
  }
  