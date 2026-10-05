import type { ImportSectionResult, ImportStatusResponse } from './import'

export interface SteamImportResult {
  library: ImportSectionResult
  wishlist: ImportSectionResult
}

export type SteamImportStatusResponse = ImportStatusResponse<SteamImportResult>
