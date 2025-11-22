import type { ComponentChildren } from 'preact'

interface HeaderProps {
  title: string
  subtitle?: string
  avatarUrl?: string
  children?: ComponentChildren
}

export function Header({ title, subtitle, avatarUrl, children }: HeaderProps) {
  return (
    <header class="cw-header">
      <div class="cw-header__info">
        {avatarUrl ? (
          <img
            class="cw-header__avatar"
            src={avatarUrl}
            alt={`${title} 아바타`}
            loading="lazy"
            decoding="async"
            width={40}
            height={40}
          />
        ) : (
          <span class="cw-header__avatar cw-header__avatar--fallback" aria-hidden="true">
            {title.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div class="cw-header__text">
          <h2 class="cw-header__title">{title}</h2>
          {subtitle && <p class="cw-header__subtitle">{subtitle}</p>}
        </div>
      </div>
      <div class="cw-header__actions">{children}</div>
    </header>
  )
}

