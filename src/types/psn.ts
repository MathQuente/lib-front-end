import type { ImportSectionResult, ImportStatusResponse } from './import'

export interface ConnectPsnResponse {
  psnOnlineId: string
}

export interface PsnImportResult {
  library: ImportSectionResult
}

export type PsnImportStatusResponse = ImportStatusResponse<PsnImportResult>
