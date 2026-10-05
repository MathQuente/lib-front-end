import type { ImportSectionResult, ImportStatusResponse } from './import'

export interface ConnectXboxResponse {
  xboxGamertag: string
}

export interface XboxImportResult {
  library: ImportSectionResult
}

export type XboxImportStatusResponse = ImportStatusResponse<XboxImportResult>
