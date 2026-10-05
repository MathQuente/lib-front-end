import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

interface LinkMessage {
  type: 'success' | 'error'
  text: string
}

const PLATFORMS: Record<string, Record<string, LinkMessage>> = {
  steam: {
    connected: { type: 'success', text: 'Steam conectada com sucesso 👌' },
    taken: {
      type: 'error',
      text: 'Este perfil da Steam já está vinculado a outra conta.',
    },
    failed: {
      type: 'error',
      text: 'Não foi possível confirmar sua conta Steam. Tente novamente.',
    },
  },
  xbox: {
    connected: { type: 'success', text: 'Xbox conectado com sucesso 👌' },
    taken: {
      type: 'error',
      text: 'Este perfil do Xbox já está vinculado a outra conta.',
    },
    no_profile: {
      type: 'error',
      text: 'Essa conta Microsoft não tem um perfil do Xbox.',
    },
    failed: {
      type: 'error',
      text: 'Não foi possível confirmar sua conta Xbox. Tente novamente.',
    },
  },
}

const CHANNEL_NAME = 'platform-link-result'
const ACK_TIMEOUT_MS = 500

type ChannelMessage =
  | { type: 'result'; platform: string; result: string }
  | { type: 'ack' }

export function usePlatformLinkResult() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  useEffect(() => {
    const showResult = (platform: string, result: string) => {
      const messages = PLATFORMS[platform]
      if (!messages) return
      const message = messages[result] ?? messages.failed
      toast[message.type](message.text, {
        toastId: `platform-link-${platform}-${result}`,
      })
      if (result === 'connected') {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      }
    }

    const channel = new BroadcastChannel(CHANNEL_NAME)
    const platform = Object.keys(PLATFORMS).find(key => searchParams.has(key))

    if (!platform) {
      channel.onmessage = (event: MessageEvent<ChannelMessage>) => {
        if (event.data.type !== 'result') return
        showResult(event.data.platform, event.data.result)
        channel.postMessage({ type: 'ack' } satisfies ChannelMessage)
      }
      return () => channel.close()
    }

    const result = searchParams.get(platform) ?? ''

    const showHere = () => {
      showResult(platform, result)
      const next = new URLSearchParams(searchParams)
      next.delete(platform)
      setSearchParams(next, { replace: true })
    }

    const fallback = setTimeout(showHere, ACK_TIMEOUT_MS)
    channel.onmessage = (event: MessageEvent<ChannelMessage>) => {
      if (event.data.type !== 'ack') return
      clearTimeout(fallback)
      window.close()
    }
    channel.postMessage({
      type: 'result',
      platform,
      result,
    } satisfies ChannelMessage)

    return () => {
      clearTimeout(fallback)
      channel.close()
    }
  }, [searchParams, setSearchParams, queryClient])
}
