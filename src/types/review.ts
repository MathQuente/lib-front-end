export interface Review {
  text: string
  updatedAt: string
}

export interface GetReviewResponse {
  review: Review | null
}

export interface UpsertReviewResponse {
  review: Review
}

export interface CommunityReview {
  userId: string
  userName: string | null
  profilePicture: string | null
  rating: number | null
  hoursPlayed: number
  completions: number
  text: string
  createdAt: string
}

export interface GetCommunityReviewsResponse {
  reviews: CommunityReview[]
  total: number
}
