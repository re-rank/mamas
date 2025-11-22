import { Fragment } from 'preact'
import type { ChatMessage } from '../types'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const paragraphs = message.content.split(/\n{2,}/)

  return (
    <article class={`cw-message cw-message--${message.role}`} data-role={message.role}>
      <div class="cw-message__body">
        {paragraphs.map((paragraph, index) => (
          <p key={index} class="cw-message__text">
            {paragraph.split('\n').map((line, lineIndex, arr) => (
              <Fragment key={lineIndex}>
                {line}
                {lineIndex < arr.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        ))}
      </div>
    </article>
  )
}

