import type { ChatMessage, WidgetOptions } from './types'

export interface SendMessageParams {
  options: WidgetOptions
  message: string
  conversationId: string
  history: ChatMessage[]
}

export async function sendMessage({
  options,
  message,
  conversationId,
  history,
}: SendMessageParams) {
  const { apiUrl, metadata, headers } = options

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(cleanUndefined({
      conversation_id: conversationId,  // 백엔드는 snake_case 사용
      message,
      history: history.map(({ role, content }) => ({ role, content })),
      ...metadata,  // metadata를 최상위 레벨로 펼침
    })),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API 요청 실패 (${response.status}): ${errorText}`)
  }

  const data = await parseResponse(response)

  // 백엔드 응답 구조: { answer, message: { content }, conversation_id }
  const reply = data.answer ?? data.message?.content ?? data.reply

  if (!reply || typeof reply !== 'string') {
    throw new Error('백엔드 응답에서 답변을 찾을 수 없습니다.')
  }

  return {
    reply,
    conversationId: typeof data.conversation_id === 'string'
      ? data.conversation_id
      : conversationId,
  }
}

interface BackendResponse {
  answer?: string
  reply?: string
  message?: {
    role: string
    content: string
    timestamp?: number
  }
  conversation_id?: string
  search_results?: Array<Record<string, unknown>>
  law_references?: Array<Record<string, unknown>>
  case_references?: Array<Record<string, unknown>>
  processing_time?: number
  [key: string]: unknown
}

async function parseResponse(response: Response): Promise<BackendResponse> {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('백엔드 응답을 JSON으로 파싱할 수 없습니다.')
  }
}

function cleanUndefined<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  )
}

