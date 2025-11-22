import type { JSX } from 'preact'
import { useState } from 'preact/hooks'
import { Send } from 'lucide-preact'

interface InputAreaProps {
  isLoading: boolean
  onSubmit: (value: string) => Promise<void> | void
}

export function InputArea({ isLoading, onSubmit }: InputAreaProps) {
  const [value, setValue] = useState('')

  const handleSubmit = async (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return

    setValue('')
    await onSubmit(trimmed)
  }

  const handleInput = (event: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
    setValue(event.currentTarget.value)
  }

  const handleKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      const form = event.currentTarget.form
      form?.requestSubmit()
    }
  }

  const isDisabled = isLoading || value.trim().length === 0

  return (
    <form class="cw-input" onSubmit={handleSubmit}>
      <label class="cw-input__field">
        <span class="cw-sr-only">메시지 입력</span>
        <textarea
          name="message"
          placeholder="무엇을 도와드릴까요?"
          rows={1}
          value={value}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        spellcheck={false}
          autoComplete="off"
        />
      </label>
      <button
        type="submit"
        class="cw-input__submit"
        disabled={isDisabled}
        aria-label="메시지 전송"
      >
        <Send size={18} />
      </button>
    </form>
  )
}

