import { Fragment } from 'preact'
import type { JSX } from 'preact'
import type { ChatMessage } from '../types'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <article class={`cw-message cw-message--${message.role}`} data-role={message.role}>
      <div class="cw-message__body">
        <div class="cw-message__text">
          {parseContent(message.content)}
        </div>
      </div>
    </article>
  )
}

// HTML 태그와 마크다운을 파싱하여 Preact 요소로 변환
function parseContent(content: string): JSX.Element[] {
  const elements: JSX.Element[] = []

  // 문단 분리
  const paragraphs = content.split(/\n{2,}/)

  paragraphs.forEach((paragraph, pIndex) => {
    if (pIndex > 0) {
      elements.push(<br key={`br-p-${pIndex}`} />)
      elements.push(<br key={`br-p2-${pIndex}`} />)
    }

    // 각 줄 처리
    const lines = paragraph.split('\n')
    lines.forEach((line, lIndex) => {
      if (lIndex > 0) {
        elements.push(<br key={`br-l-${pIndex}-${lIndex}`} />)
      }
      elements.push(...parseLine(line, `${pIndex}-${lIndex}`))
    })
  })

  return elements
}

// 한 줄의 텍스트를 파싱
function parseLine(line: string, keyPrefix: string): JSX.Element[] {
  const elements: JSX.Element[] = []

  // law-link 태그와 일반 텍스트, 마크다운을 처리
  // 정규식: <law-link ...>텍스트</law-link> 또는 **볼드** 또는 일반 텍스트
  const regex = /(<law-link[^>]*>.*?<\/law-link>|\*\*[^*]+\*\*)/g

  let lastIndex = 0
  let match: RegExpExecArray | null
  let partIndex = 0

  while ((match = regex.exec(line)) !== null) {
    // 매치 전 일반 텍스트
    if (match.index > lastIndex) {
      const text = line.slice(lastIndex, match.index)
      elements.push(<Fragment key={`text-${keyPrefix}-${partIndex++}`}>{text}</Fragment>)
    }

    const matched = match[0]

    if (matched.startsWith('<law-link')) {
      // law-link 태그 처리
      elements.push(parseLawLink(matched, `${keyPrefix}-${partIndex++}`))
    } else if (matched.startsWith('**')) {
      // 볼드 텍스트 처리
      const boldText = matched.slice(2, -2)
      elements.push(<strong key={`bold-${keyPrefix}-${partIndex++}`}>{boldText}</strong>)
    }

    lastIndex = match.index + matched.length
  }

  // 남은 텍스트
  if (lastIndex < line.length) {
    const text = line.slice(lastIndex)
    elements.push(<Fragment key={`text-${keyPrefix}-${partIndex++}`}>{text}</Fragment>)
  }

  return elements
}

// <law-link> 태그를 파싱하여 클릭 가능한 링크로 변환
function parseLawLink(html: string, key: string): JSX.Element {
  // 속성 추출
  const lawNameMatch = html.match(/data-law-name="([^"]*)"/)
  const articleMatch = html.match(/data-article="([^"]*)"/)
  const apiUrlMatch = html.match(/data-api-url="([^"]*)"/)

  // 태그 내부 텍스트 추출
  const textMatch = html.match(/>([^<]*)<\/law-link>/)
  const text = textMatch ? textMatch[1] : ''

  const lawName = lawNameMatch ? lawNameMatch[1] : ''
  const article = articleMatch ? articleMatch[1] : ''
  const apiUrl = apiUrlMatch ? decodeURIComponent(apiUrlMatch[1]) : ''

  // 클릭 시 국가법령정보센터로 이동
  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    const lawUrl = `https://www.law.go.kr/법령/${encodeURIComponent(lawName)}`
    window.open(lawUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <a
      key={key}
      href="#"
      class="cw-law-link"
      data-law-name={lawName}
      data-article={article}
      data-api-url={apiUrl}
      onClick={handleClick}
      title={article ? `${lawName} ${article}` : lawName}
    >
      {text}
    </a>
  )
}
