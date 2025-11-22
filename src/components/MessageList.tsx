import { useEffect, useRef } from 'preact/hooks'
import type { ChatMessage } from '../types'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = listRef.current
    if (!node) return

    node.scrollTop = node.scrollHeight
  }, [messages, isLoading])

  return (
    <div
      ref={listRef}
      class="cw-messages"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {messages.length === 0 && (
        <div class="cw-empty-state">
          대화를 시작해보세요. 궁금한 내용을 물어보면 도와드릴게요.
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div class="cw-typing" aria-label="답변 생성 중">
          <span class="cw-typing__dot" />
          <span class="cw-typing__dot" />
          <span class="cw-typing__dot" />
        </div>
      )}
    </div>
  )
}

