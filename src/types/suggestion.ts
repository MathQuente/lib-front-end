import type { LibraryPlatform } from './platform'

export interface CompletionSuggestion {
  igdbId: number
  name: string
  coverUrl: string | null
  platform: LibraryPlatform
  hoursPlayed: number
  normallyHours: number | null
  achieved: number | null
  total: number | null
  lowConfidence: boolean
  createdAt: string
}

export interface CompletionSuggestionsResponse {
  suggestions: CompletionSuggestion[]
}

export interface AcceptSuggestionResponse {
  igdbId: number
  status: 'PLAYED'
  completions: number
  canUndo: boolean
}

export interface UndoSuggestionResponse {
  igdbId: number
  status: string
  completions: number
}
