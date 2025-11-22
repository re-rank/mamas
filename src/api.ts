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
      conversationId,
      message,
      history: history.map(({ role, content }) => ({ role, content })),
      metadata,
    })),
  })

  if (!response.ok) {
    throw new Error(`API 요청 실패 (${response.status})`)
  }

  const data = await parseResponse(response)
  const reply = data.reply ?? data.message

  if (!reply || typeof reply !== 'string') {
    throw new Error('백엔드 응답에 reply 필드가 없습니다.')
  }

  return {
    reply,
    conversationId: typeof data.conversationId === 'string' ? data.conversationId : conversationId,
  }
}

async function parseResponse(response: Response) {
  const text = await response.text()
  try {
    return JSON.parse(text) as {
      reply?: string
      message?: string
      conversationId?: string
      [key: string]: unknown
    }
  } catch {
    throw new Error('백엔드 응답을 JSON 으로 파싱할 수 없습니다.')
  }
}

function cleanUndefined<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  )
}

