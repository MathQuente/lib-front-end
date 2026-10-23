export interface StartImportResponse {
  status: 'queued'
}

export interface ImportSectionResult {
  imported: number
  updated: number
  skipped: number
  notFound: string[]
  suggestions?: number
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
  finishedAt?: number
  cooldownUntil?: number
}
