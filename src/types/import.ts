export interface StartImportResponse {
  status: 'queued'
}

export interface ImportSectionResult {
  imported: number
  updated: number
  skipped: number
  notFound: string[]
}

export type ImportJobStatus =
  | 'idle'
  | 'waiting'
  | 'active'
  | 'delayed'
  | 'completed'
  | 'failed'

export interface ImportStatusResponse<TResult> {
  status: ImportJobStatus
  progress?: number
  result?: TResult
  error?: string
  cooldownUntil?: number
}
