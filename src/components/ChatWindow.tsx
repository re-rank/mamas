import { LoaderCircle, X } from 'lucide-preact'
import type { ChatMessage } from '../types'
import { Header } from './Header'
import { MessageList } from './MessageList'
import { InputArea } from './InputArea'

interface ChatWindowProps {
  title: string
  subtitle?: string
  avatarUrl?: string
  isOpen: boolean
  messages: ChatMessage[]
  isLoading: boolean
  error?: string | null
  onClose: () => void
  onSend: (text: string) => Promise<void> | void
}

export function ChatWindow({
  title,
  subtitle,
  avatarUrl,
  isOpen,
  messages,
  isLoading,
  error,
  onClose,
  onSend,
}: ChatWindowProps) {
  return (
    <section
      class={`cw-window ${isOpen ? 'cw-window--open' : ''}`}
      aria-label="채팅 위젯"
      aria-hidden={!isOpen}
    >
      <Header title={title} subtitle={subtitle} avatarUrl={avatarUrl}>
        <button
          type="button"
          class="cw-header__close"
          aria-label="채팅창 닫기"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </Header>

      <MessageList messages={messages} isLoading={isLoading} />

      <footer class="cw-footer">
        {error && (
          <div class="cw-error" role="status">
            {error}
          </div>
        )}
        <InputArea
          isLoading={isLoading}
          onSubmit={onSend}
        />
        {isLoading && (
          <div class="cw-loading-indicator" aria-hidden="true">
            <LoaderCircle size={16} />
          </div>
        )}
      </footer>
    </section>
  )
}

