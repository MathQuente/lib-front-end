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
