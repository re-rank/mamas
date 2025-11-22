import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { sendMessage } from '../api'
import type { ChatMessage, NormalizedWidgetOptions } from '../types'
import { Launcher } from './Launcher'
import { ChatWindow } from './ChatWindow'

interface WidgetRootProps {
  options: NormalizedWidgetOptions
}

export function WidgetRoot({ options }: WidgetRootProps) {
  const [isOpen, setIsOpen] = useState(options.startOpen)
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    (options.initialMessages ?? []).map((message) => ({
      id: createId(),
      role: message.role,
      content: message.content,
      createdAt: Date.now(),
    })),
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const conversationIdRef = useRef(options.conversationId ?? createId())
  const messagesRef = useRef(messages)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    if (options.startOpen) {
      options.onOpen?.()
    }
  }, [options])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen((prev) => {
        if (!prev) return prev
        options.onClose?.()
        return false
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, options])

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev
      schedule(() => {
        if (next) {
          options.onOpen?.()
        } else {
          options.onClose?.()
        }
      })
      return next
    })
  }

  const handleSend = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMessage = createMessage('user', trimmed)
    const history = [...messagesRef.current, userMessage]
    setMessages(history)
    setError(null)
    setIsLoading(true)

    try {
      const { reply, conversationId } = await sendMessage({
        options,
        message: trimmed,
        conversationId: conversationIdRef.current,
        history,
      })
      conversationIdRef.current = conversationId ?? conversationIdRef.current

      const assistantMessage = createMessage('assistant', reply)
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '메시지 전송 중 오류가 발생했습니다.'
      setError(errorMessage)
      options.onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  const subtitle = useMemo(
    () => options.subtitle?.trim() || undefined,
    [options.subtitle],
  )

  return (
    <div class="cw-container" data-position={options.position}>
      <ChatWindow
        title={options.title}
        subtitle={subtitle}
        avatarUrl={options.avatarUrl}
        isOpen={isOpen}
        messages={messages}
        isLoading={isLoading}
        onClose={handleToggle}
        onSend={handleSend}
        error={error}
      />
      <Launcher
        isOpen={isOpen}
        label={options.launcherLabel}
        onToggle={handleToggle}
      />
    </div>
  )
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2, 10)
}

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: createId(),
    role,
    content,
    createdAt: Date.now(),
  }
}

const schedule =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : (callback: () => void) => {
        Promise.resolve().then(callback).catch(() => {
          /* noop */
        })
      }

