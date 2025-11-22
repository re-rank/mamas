export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: number
}

export interface WidgetTheme {
  primaryColor?: string
  userBubbleColor?: string
  assistantBubbleColor?: string
  backgroundColor?: string
}

export interface NormalizedWidgetTheme {
  primaryColor: string
  userBubbleColor: string
  assistantBubbleColor: string
  backgroundColor: string
}

export type WidgetPosition = 'bottom-right' | 'bottom-left'

export interface WidgetOptions {
  apiUrl: string
  title?: string
  subtitle?: string
  position?: WidgetPosition
  avatarUrl?: string
  launcherLabel?: string
  metadata?: Record<string, unknown>
  headers?: Record<string, string>
  startOpen?: boolean
  initialMessages?: Array<Pick<ChatMessage, 'role' | 'content'>>
  conversationId?: string
  theme?: WidgetTheme
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Error) => void
}

export interface NormalizedWidgetOptions extends WidgetOptions {
  title: string
  subtitle?: string
  position: WidgetPosition
  launcherLabel: string
  startOpen: boolean
  theme: NormalizedWidgetTheme
  apiUrl: string
}

export interface SendMessageResult {
  reply: string
  conversationId?: string
}

