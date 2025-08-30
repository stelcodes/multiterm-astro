import type { MarkdownHeading } from 'astro'
import type { BundledShikiTheme } from 'astro-expressive-code'
import type { CollectionEntry, DataEntryMap } from 'astro:content'

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday, 1 = Monday etc.

export type GitHubActivityDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export type GitHubActivityWeek = Array<GitHubActivityDay | undefined>

export type GitHubActivityApiResponse = {
  total: {
    [year: number]: number
    [year: string]: number // 'lastYear;
  }
  contributions: Array<GitHubActivityDay>
  error?: string
}

export type GitHubActivityMonthLabel = {
  weekIndex: number
  label: string
}

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

export interface Collation<CollectionType extends keyof DataEntryMap> {
  title: string
  url: string
  titleSlug: string
  entries: CollectionEntry<CollectionType>[]
}

export interface CollationGroup<CollectionType extends keyof DataEntryMap> {
  title: string
  url: string
  collations: Collation<CollectionType>[]
  // Return this.collations to allow chaining
  sortCollationsAlpha(): Collation<CollectionType>[]
  sortCollationsMostRecent(): Collation<CollectionType>[]
  sortCollationsLargest(): Collation<CollectionType>[]
  add(item: CollectionEntry<CollectionType>, rawKey: string): void
  match(title: string): Collation<CollectionType> | undefined
  matchMany(titles: string[]): Collation<CollectionType>[] | undefined
}

export type NavLink = {
  name: string
  url: string
  external?: boolean
}

export type AdmonitionType = 'tip' | 'note' | 'important' | 'caution' | 'warning'

export const themeKeys = [
  'foreground',
  'background',
  'accent',
  // Markdown styles
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'list',
  'separator',
  'italic',
  'link',
  // For admonition styling
  'note',
  'tip',
  'important',
  'caution',
  'warning',
  // For Giscus syntax highlighting only
  'comment',
  'constant',
  'entity',
  'tag',
  'keyword',
  'string',
  'variable',
  'regexp',
  // Terminal colors for user customization only, not used by default
  'blue',
  'green',
  'red',
  'yellow',
  'magenta',
  'cyan',
] as const

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
export type ThemeOverrides = Partial<Record<BundledShikiTheme, Partial<ColorStyles>>>

export interface ThemesConfig {
  default: BundledShikiTheme | 'auto'
  mode: 'single' | 'light-dark-auto' | 'select'
  include: BundledShikiTheme[]
  overrides?: ThemeOverrides
}

export type SocialLinks = {
  github?: string
  twitter?: string
  mastodon?: string
  bluesky?: string
  linkedin?: string
  email?: string
  rss?: boolean
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
  trailingSlashes: boolean
  themes: ThemesConfig
  socialLinks: SocialLinks
  navLinks: NavLink[]
  giscus: GiscusConfig | undefined,
  characters: Record<string, string>
}
