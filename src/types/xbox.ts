import type { ImportSectionResult, ImportStatusResponse } from './import'

export interface XboxImportResult {
  library: ImportSectionResult
}

export type XboxImportStatusResponse = ImportStatusResponse<XboxImportResult>
