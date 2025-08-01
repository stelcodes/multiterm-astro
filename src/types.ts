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

const themeKeys = [
  'foreground',
  'background',
  'accent',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'hr',
  'italic',
  'a',
  'blue',
  'green',
  'red',
  'yellow',
  'magenta',
  'cyan',
  // For Giscus syntax highlighting
  'comment',
  'constant',
  'entity',
  'entityTag',
  'keyword',
  'string',
  'variable',
  'regexp',
] as const

console.log

export type ThemeKey = (typeof themeKeys)[number]

// const example: TextmateStyles = {
//   foreground: ['editor.foreground'],
//   background: ['editor.background'],
// }
export type TextmateStyles = {
  [key in ThemeKey]: string[]
}

// const example: ColorStyles = {
//   foreground: '#000000',
//   background: '#ffffff',
// }
export type ColorStyles = {
  [key in ThemeKey]: string
}

// const example: ThemesWithColorStyles = {
//   'github-light': {
//     foreground: '#24292e',
//     background: '#ffffff',
//   },
// }
export type ThemesWithColorStyles = Partial<Record<BundledShikiTheme, ColorStyles>>

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

export type GiscusConfig = {
  repo: string
  repoId: string
  category: string
  categoryId: string
  reactionsEnabled: boolean
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
  giscus: GiscusConfig | undefined
}
