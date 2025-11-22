import { MessageCircle, X } from 'lucide-preact'

interface LauncherProps {
  isOpen: boolean
  label: string
  onToggle: () => void
}

export function Launcher({ isOpen, label, onToggle }: LauncherProps) {
  return (
    <button
      type="button"
      class={`cw-launcher ${isOpen ? 'cw-launcher--open' : ''}`}
      aria-label={isOpen ? '채팅창 닫기' : '채팅창 열기'}
      onClick={onToggle}
    >
      <span class="cw-launcher__icon" aria-hidden="true">
        {isOpen ? <X size={22} /> : <MessageCircle size={26} />}
      </span>
      {!isOpen && <span class="cw-launcher__label">{label}</span>}
    </button>
  )
}

