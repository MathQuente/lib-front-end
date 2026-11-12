import type { ImportSectionResult, ImportStatusResponse } from './import'

export interface SteamAccountImportResult {
  displayName: string
  library?: ImportSectionResult
  error?: string
}

export interface SteamImportResult {
  library: ImportSectionResult
  wishlist: ImportSectionResult
  accounts?: SteamAccountImportResult[]
}

export type SteamImportStatusResponse = ImportStatusResponse<SteamImportResult>
