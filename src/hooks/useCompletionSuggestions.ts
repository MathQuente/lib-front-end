import { useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import type { LibraryPlatform } from '../types/platform'
import type { CompletionSuggestion } from '../types/suggestion'
import { getErrorMessage } from '../utils/getErrorMessage'
import { api } from './useApi'
import { useAuth } from './useAuth'

const STALE_ROW_MS = 3000

const isConflict = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 409

export type SuggestionRow =
  | { kind: 'pending'; suggestion: CompletionSuggestion }
  | {
      kind: 'accepted'
      suggestion: CompletionSuggestion
      canUndo: boolean
      message?: string
    }
  | { kind: 'stale'; suggestion: CompletionSuggestion; message: string }

type Resolved = Exclude<SuggestionRow, { kind: 'pending' }>

export interface ActionResult {
  ok: boolean
  message?: string
  canUndo?: boolean
}

// O back tira o jogo da lista ao aceitar. As linhas aceitas ficam no estado
// local para o "Desfazer" continuar visível enquanto a tela estiver aberta.
export const useCompletionSuggestions = (
  platform: LibraryPlatform,
  enabled: boolean
) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()
  const queryKey = ['completionSuggestions', userId, platform]

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => api.getSuggestions(platform),
    enabled: Boolean(userId && enabled),
  })

  const [resolved, setResolved] = useState<Record<number, Resolved>>({})
  const [busy, setBusy] = useState<number[]>([])
  const timers = useRef<number[]>([])

  useEffect(
    () => () => {
      for (const timer of timers.current) window.clearTimeout(timer)
    },
    []
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: limpa ao trocar de conta ou plataforma
  useEffect(() => {
    setResolved({})
  }, [userId, platform])

  const invalidateSuggestions = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['completionSuggestions', userId],
    })
  }, [queryClient, userId])

  const invalidateGame = useCallback(
    (igdbId: number) => {
      const id = String(igdbId)
      queryClient.invalidateQueries({ queryKey: ['userGames', userId] })
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      queryClient.invalidateQueries({ queryKey: ['gamesStatus', userId, id] })
      queryClient.invalidateQueries({ queryKey: ['gameStats', userId, id] })
      queryClient.invalidateQueries({
        queryKey: ['gameCompletedAt', userId, id],
      })
      queryClient.invalidateQueries({
        queryKey: ['gamePlatforms', userId, id],
      })
      queryClient.invalidateQueries({ queryKey: ['rating', userId, id] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
      invalidateSuggestions()
    },
    [queryClient, userId, invalidateSuggestions]
  )

  async function run<T>(igdbId: number, action: () => Promise<T>) {
    setBusy(current => [...current, igdbId])
    try {
      return await action()
    } finally {
      setBusy(current => current.filter(id => id !== igdbId))
    }
  }

  function failure(
    error: unknown,
    fallback: string,
    showToast = true
  ): ActionResult {
    const message = getErrorMessage(error, fallback)
    if (showToast && !isConflict(error)) toast.error(message)
    return { ok: false, message }
  }

  function markStale(suggestion: CompletionSuggestion, message: string) {
    setResolved(current => ({
      ...current,
      [suggestion.igdbId]: { kind: 'stale', suggestion, message },
    }))
    invalidateGame(suggestion.igdbId)
    timers.current.push(
      window.setTimeout(() => {
        setResolved(current => {
          const { [suggestion.igdbId]: _removed, ...rest } = current
          return rest
        })
      }, STALE_ROW_MS)
    )
  }

  async function accept(suggestion: CompletionSuggestion) {
    return run<ActionResult>(suggestion.igdbId, async () => {
      try {
        const result = await api.acceptSuggestion(suggestion.igdbId)
        setResolved(current => ({
          ...current,
          [suggestion.igdbId]: {
            kind: 'accepted',
            suggestion,
            canUndo: result.canUndo,
          },
        }))
        invalidateGame(suggestion.igdbId)
        return { ok: true, canUndo: result.canUndo }
      } catch (error) {
        const outcome = failure(error, 'Erro ao marcar como Jogado.')
        if (isConflict(error)) {
          markStale(suggestion, `${outcome.message} Atualizamos a lista.`)
        }
        return outcome
      }
    })
  }

  async function dismiss(suggestion: CompletionSuggestion) {
    return run<ActionResult>(suggestion.igdbId, async () => {
      try {
        await api.dismissSuggestion(suggestion.igdbId)
        invalidateSuggestions()
        return { ok: true }
      } catch (error) {
        const outcome = failure(error, 'Erro ao dispensar a sugestão.')
        if (isConflict(error)) {
          markStale(suggestion, `${outcome.message} Atualizamos a lista.`)
        } else {
          invalidateSuggestions()
        }
        return outcome
      }
    })
  }

  async function undo(igdbId: number) {
    return run<ActionResult>(igdbId, async () => {
      try {
        await api.undoSuggestion(igdbId)
        setResolved(current => {
          const { [igdbId]: _removed, ...rest } = current
          return rest
        })
        invalidateGame(igdbId)
        return { ok: true }
      } catch (error) {
        const outcome = failure(error, 'Erro ao desfazer.', false)
        setResolved(current => {
          const row = current[igdbId]
          if (!row || row.kind !== 'accepted') return current
          return {
            ...current,
            [igdbId]: { ...row, canUndo: false, message: outcome.message },
          }
        })
        return outcome
      }
    })
  }

  const pending = (data?.suggestions ?? []).filter(s => !resolved[s.igdbId])
  const rows: SuggestionRow[] = [
    ...pending.map(suggestion => ({ kind: 'pending' as const, suggestion })),
    ...Object.values(resolved),
  ].sort((a, b) => b.suggestion.createdAt.localeCompare(a.suggestion.createdAt))

  return {
    rows,
    pendingCount: pending.length,
    isLoading,
    isError,
    refetch: () => refetch(),
    isBusy: (igdbId: number) => busy.includes(igdbId),
    accept,
    dismiss,
    undo,
  }
}
