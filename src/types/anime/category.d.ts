export interface Category {
    success: boolean
    results: Results
  }
  
  export interface Results {
    totalPages: number
    data: Daum[]
  }
  
  export interface Daum {
    id: string
    data_id: string
    poster: string
    title: string
    japanese_title: string
    description: string
    tvInfo: TvInfo
    adultContent: boolean
  }
  
  export interface TvInfo {
    showType: string
    duration: string
    sub?: string
    dub?: string
  }
  