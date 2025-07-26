import type { MarkdownHeading } from 'astro'
import type { BundledShikiTheme } from 'astro-expressive-code'

export interface TocItem extends MarkdownHeading {
  children: TocItem[]
}

export interface TocOpts {
  maxHeadingLevel?: number | undefined
  minHeadingLevel?: number | undefined
}

export interface FrontmatterImage {
  alt: string
  src: {
    height: number
    src: string
    width: number
    format: 'avif' | 'png' | 'webp' | 'jpeg' | 'jpg' | 'svg' | 'tiff' | 'gif'
  }
}

export type NavLink = {
  name: string
  url: string
  external?: boolean
}

export type AdmonitionType = 'tip' | 'note' | 'important' | 'caution' | 'warning'

export interface ThemeStyles {
  foreground?: string[]
  background?: string[]
  accent?: string[]
  h1?: string[]
  h2?: string[]
  h3?: string[]
  h4?: string[]
  h5?: string[]
  h6?: string[]
  li?: string[]
  hr?: string[]
  italic?: string[]
  a?: string[]
  blue?: string[]
  green?: string[]
  red?: string[]
  yellow?: string[]
  magenta?: string[]
  cyan?: string[]
}

export interface ThemesConfig {
  default: BundledShikiTheme | 'auto'
  mode: 'single' | 'light-dark-auto' | 'select'
  include: BundledShikiTheme[]
}

export type SocialLinks = {
  github?: string
  twitter?: string
  mastodon?: string
  bluesky?: string
  linkedin?: string
  email?: string
}

export interface SiteConfig {
  site: string
  font: string
  title: string
  description: string
  author: string
  socialCardAvatarImage: string
  tags: string[]
  pageSize: number
  themes: ThemesConfig
  socialLinks: SocialLinks
  navLinks: NavLink[]
}
