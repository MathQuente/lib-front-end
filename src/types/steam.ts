import type { ImportSectionResult, ImportStatusResponse } from './import'

export interface ConnectSteamResponse {
  steamId: string
}

export interface SteamImportResult {
  library: ImportSectionResult
  wishlist: ImportSectionResult
}

export type SteamImportStatusResponse = ImportStatusResponse<SteamImportResult>
