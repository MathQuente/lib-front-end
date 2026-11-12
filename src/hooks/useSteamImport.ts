import type { SteamImportResult } from '../types/steam'
import { api } from './useApi'
import { usePlatformImport } from './usePlatformImport'

export const useSteamImport = () =>
  usePlatformImport<SteamImportResult>({
    key: 'steam',
    label: 'Steam',
    getStatus: () => api.getSteamImportStatus(),
    connect: () => api.startSteamLink(),
    redirectsAway: true,
    disconnect: accountId => api.disconnectSteam(accountId ?? ''),
    startImport: () => api.startSteamImport(),
  })
