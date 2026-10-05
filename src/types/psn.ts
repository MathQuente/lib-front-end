import type { ImportSectionResult, ImportStatusResponse } from './import'

export interface PsnVerificationResponse {
  psnOnlineId: string
  code: string
  expiresInSeconds: number
}

export interface ConnectPsnResponse {
  psnOnlineId: string
}

export interface PsnImportResult {
  library: ImportSectionResult
}

export type PsnImportStatusResponse = ImportStatusResponse<PsnImportResult>
