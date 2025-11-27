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
  const { apiUrl, headers } = options

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(cleanUndefined({
      message,
      conversation_history: history.map(({ role, content }) => ({ role, content })),
      top_k: 5,
      temperature: 0.7,
    })),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API 요청 실패 (${response.status}): ${errorText}`)
  }

  const data = await parseResponse(response)
  const reply = data.answer ?? data.reply ?? data.message

  if (!reply || typeof reply !== 'string') {
    throw new Error('백엔드 응답에 answer 필드가 없습니다.')
  }

  return {
    reply,
    conversationId,
  }
}

interface BackendResponse {
  answer?: string
  reply?: string
  message?: string
  conversationId?: string
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
