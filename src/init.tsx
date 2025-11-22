import { render } from 'preact'
import type {
  NormalizedWidgetOptions,
  NormalizedWidgetTheme,
  WidgetOptions,
  WidgetPosition,
} from './types'
import { WidgetRoot } from './components/WidgetRoot'
import styles from './widget.css?inline'

interface ActiveInstance {
  container: HTMLElement
  mountNode: HTMLElement
}

let activeInstance: ActiveInstance | null = null

export function init(options: WidgetOptions) {
  if (typeof window === 'undefined') return

  destroy()

  const normalized = normalizeOptions(options)
  const container = document.createElement('div')
  container.setAttribute('data-chat-widget', 'true')
  container.style.all = 'initial'
  container.style.position = 'relative'
  container.style.zIndex = '2147483000'
  document.body.appendChild(container)

  const shadowRoot = container.attachShadow({ mode: 'open' })
  const styleTag = document.createElement('style')
  styleTag.textContent = styles
  shadowRoot.appendChild(styleTag)

  const mountNode = document.createElement('div')
  mountNode.classList.add('cw-root')
  mountNode.dataset.position = normalized.position
  applyTheme(mountNode, normalized.theme)
  shadowRoot.appendChild(mountNode)

  render(<WidgetRoot options={normalized} />, mountNode)

  activeInstance = { container, mountNode }

  return {
    destroy,
  }
}

export function destroy() {
  if (!activeInstance) return

  render(null, activeInstance.mountNode)
  activeInstance.container.remove()
  activeInstance = null
}

function normalizeOptions(options: WidgetOptions): NormalizedWidgetOptions {
  if (!options.apiUrl) {
    throw new Error('apiUrl은 필수 옵션입니다.')
  }

  const title = options.title?.trim() || 'AI Assistant'
  const launcherLabel = options.launcherLabel?.trim() || '채팅으로 문의하기'
  const position: WidgetPosition = options.position ?? 'bottom-right'
  const startOpen = options.startOpen ?? false

  const theme: NormalizedWidgetTheme = {
    primaryColor: options.theme?.primaryColor || '#2563eb',
    userBubbleColor: options.theme?.userBubbleColor || '#2563eb',
    assistantBubbleColor: options.theme?.assistantBubbleColor || '#f1f5f9',
    backgroundColor: options.theme?.backgroundColor || '#ffffff',
  }

  return {
    ...options,
    apiUrl: options.apiUrl,
    title,
    launcherLabel,
    position,
    startOpen,
    theme,
  }
}

function applyTheme(node: HTMLElement, theme: NormalizedWidgetTheme) {
  node.style.setProperty('--cw-primary', theme.primaryColor)
  node.style.setProperty('--cw-user-bubble', theme.userBubbleColor)
  node.style.setProperty('--cw-assistant-bubble', theme.assistantBubbleColor)
  node.style.setProperty('--cw-surface', theme.backgroundColor)
}

declare global {
  interface Window {
    ChatWidget?: {
      init: (options: WidgetOptions) => ReturnType<typeof init>
      destroy: typeof destroy
    }
  }
}

if (typeof window !== 'undefined') {
  window.ChatWidget = {
    init,
    destroy,
  }
}

export type {
  WidgetOptions,
  WidgetTheme,
  WidgetPosition,
} from './types'

