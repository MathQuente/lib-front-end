import type { XboxImportResult } from '../types/xbox'
import { api } from './useApi'
import { usePlatformImport } from './usePlatformImport'

export const useXboxImport = () =>
  usePlatformImport<XboxImportResult>({
    key: 'xbox',
    label: 'Xbox',
    getStatus: () => api.getXboxImportStatus(),
    connect: () => api.startXboxLink(),
    redirectsAway: true,
    disconnect: accountId => api.disconnectXbox(accountId ?? ''),
    startImport: () => api.startXboxImport(),
  })
