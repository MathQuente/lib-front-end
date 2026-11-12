import type { ImportSectionResult, ImportStatusResponse } from './import'

export interface PsnVerificationResponse {
  psnOnlineId: string
  code: string
  expiresInSeconds: number
}

export interface ConnectPsnResponse {
  psnOnlineId: string
}

export interface PsnAccountImportResult {
  displayName: string
  library?: ImportSectionResult
  error?: string
}

export interface PsnImportResult {
  library: ImportSectionResult
  accounts?: PsnAccountImportResult[]
}

export type PsnImportStatusResponse = ImportStatusResponse<PsnImportResult>
