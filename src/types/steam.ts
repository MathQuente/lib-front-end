export interface ConnectSteamResponse {
  steamId: string
}

export interface StartImportResponse {
  status: 'queued'
}

export interface SteamImportSectionResult {
  imported: number
  skipped: number
  notFound: string[]
}

export interface SteamImportResult {
  library: SteamImportSectionResult
  wishlist: SteamImportSectionResult
}

export type SteamImportStatus =
  | 'idle'
  | 'waiting'
  | 'active'
  | 'delayed'
  | 'completed'
  | 'failed'

export interface ImportStatusResponse {
  status: SteamImportStatus
  result?: SteamImportResult
  error?: string
}
