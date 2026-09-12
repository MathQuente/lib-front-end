export interface RatingResponse {
  rating: number | null
}

export interface CreateRatingResponse {
  rating: number
  promotedToPlayed: boolean
}

export interface RatingsDistributionResponse {
  ratings: {
    rating: number
    count: number
  }[]
}
