export interface RatingResponse {
  rating: number | null
}

export interface RatingsDistributionResponse {
  ratings: {
    rating: number
    count: number
  }[]
}
