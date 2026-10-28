import type { ImportSectionResult, ImportStatusResponse } from './import'

export interface XboxAccountImportResult {
  gamertag: string
  library?: ImportSectionResult
  error?: string
  warning?: string
}

export interface XboxImportResult {
  library: ImportSectionResult
  accounts?: XboxAccountImportResult[]
}

export type XboxImportStatusResponse = ImportStatusResponse<XboxImportResult>
