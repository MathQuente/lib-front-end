import type { PsnImportResult } from '../types/psn'
import { api } from './useApi'
import { usePlatformImport } from './usePlatformImport'

export const usePsnImport = () =>
  usePlatformImport<PsnImportResult>({
    key: 'psn',
    label: 'PlayStation',
    getStatus: () => api.getPsnImportStatus(),
    connect: onlineId => api.connectPsn(onlineId),
    disconnect: () => api.disconnectPsn(),
    startImport: () => api.startPsnImport(),
  })
