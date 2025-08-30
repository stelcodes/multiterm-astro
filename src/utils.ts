import {
  type TextmateStyles,
  type ThemesWithColorStyles,
  type ThemeKey,
  themeKeys,
  type ThemeOverrides,
  type Collation,
  type CollationGroup,
} from '~/types'
import {
  loadShikiTheme,
  type BundledShikiTheme,
  type ExpressiveCodeTheme,
} from 'astro-expressive-code'
import { getCollection, type CollectionEntry } from 'astro:content'
import Color from 'color'
import { slug } from 'github-slugger'

export function dateString(date: Date) {
  return date.toISOString().split('T')[0]
}

export function pick(obj: Record<string, any>, keys: string[]) {
  return Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]]),
  )
}

export function flattenThemeColors(theme: ExpressiveCodeTheme): {
  [key: string]: string
} {
  const scopedThemeSettings = theme.settings.reduce(
    (acc, item) => {
      const { scope, settings } = item
      const { foreground } = settings
      if (scope && foreground) {
        for (const s of scope) {
          acc[s] = foreground.toLowerCase().trim()
        }
      }
      return acc
    },
    {} as { [key: string]: string },
  )
  return { ...theme.colors, ...scopedThemeSettings }
}

const unresolvedStyles: TextmateStyles = {
  // VSCode Command: Inspect Editor Tokens And Scopes
  foreground: ['editor.foreground'],
  background: ['editor.background'],
  accent: [
    'heading.1.markdown entity.name',
    'heading.1.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  // Markdown styles
  heading1: [
    'heading.1.markdown entity.name',
    'heading.1.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  heading2: [
    'heading.2.markdown entity.name',
    'heading.2.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  heading3: [
    'heading.3.markdown entity.name',
    'heading.3.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  heading4: [
    'heading.4.markdown entity.name',
    'heading.4.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  heading5: [
    'heading.5.markdown entity.name',
    'heading.5.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  heading6: [
    'heading.6.markdown entity.name',
    'heading.6.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  list: [
    'markup.list.bullet',
    'punctuation.definition.list.begin.markdown',
    'editor.foreground',
  ],
  italic: [
    'markup.italic.markdown',
    'markup.italic',
    'punctuation.definition.italic.markdown',
    'editor.foreground',
  ],
  link: ['string.other.link.title.markdown', 'markup.link', 'editor.foreground'],
  separator: ['meta.separator.markdown', 'meta.separator', 'editor.foreground'],
  // For admonition styling
  note: ['terminal.ansiBlue', 'terminal.ansiBrightBlue'],
  tip: ['terminal.ansiGreen', 'terminal.ansiBrightGreen'],
  important: ['terminal.ansiMagenta', 'terminal.ansiBrightMagenta'],
  caution: ['terminal.ansiYellow', 'terminal.ansiBrightYellow'],
  warning: ['terminal.ansiRed', 'terminal.ansiBrightRed'],
  // For Giscus syntax highlighting only
  comment: ['comment', 'punctuation.definition.comment', 'foreground'],
  constant: ['constant.language.boolean', 'constant.language', 'foreground'],
  entity: ['entity.name.function', 'support.function', 'function', 'foreground'],
  tag: [
    'entity.name.tag',
    'punctuation.definition.tag',
    'punctuation.definition.tag.html',
    'meta.tag',
    'foreground',
  ],
  keyword: [
    'keyword',
    'punctuation.definition.keyword',
    'keyword.operator',
    'foreground',
  ],
  string: ['string', 'string.quoted', 'string.value', 'string variable', 'foreground'],
  variable: [
    'variable',
    'variable.language',
    'variable.other',
    'support.variable',
    'foreground',
  ],
  regexp: [
    'string.regexp',
    'string.regexp.source',
    'constant.other.character-class.regexp',
    'string',
    'foreground',
  ],
  // Terminal colors for user customization only, not used by default
  blue: ['terminal.ansiBlue', 'terminal.ansiBrightBlue'],
  green: ['terminal.ansiGreen', 'terminal.ansiBrightGreen'],
  red: ['terminal.ansiRed', 'terminal.ansiBrightRed'],
  yellow: ['terminal.ansiYellow', 'terminal.ansiBrightYellow'],
  magenta: ['terminal.ansiMagenta', 'terminal.ansiBrightMagenta'],
  cyan: ['terminal.ansiCyan', 'terminal.ansiBrightCyan'],
}

export async function resolveThemeColorStyles(
  themes: BundledShikiTheme[],
  overrides?: ThemeOverrides,
): Promise<ThemesWithColorStyles> {
  const validateColor = (color: string) => {
    // Check if the color is a valid hex, rgb, or hsl color via regex
    const colorRegex = /^(#|rgb|hsl)/i
    if (!colorRegex.test(color)) return undefined
    try {
      return new Color(color).hex()
    } catch {
      return undefined
    }
  }
  const resolvedThemes = themes.map(async (theme) => {
    const loadedTheme = await loadShikiTheme(theme)
    const flattenedTheme = flattenThemeColors(loadedTheme)
    const result = {} as { [key in ThemeKey]: string }
    for (const themeKey of Object.keys(unresolvedStyles) as ThemeKey[]) {
      if (overrides?.[theme]?.[themeKey]) {
        const override = overrides[theme][themeKey]
        const overrideColor = validateColor(override)
        if (overrideColor) {
          result[themeKey] = override
          continue
        }
        // If the override is not a valid color, try to resolve it as a highlight group
        if (themeKeys.includes(override as ThemeKey)) {
          for (const textmateGroup of unresolvedStyles[override as ThemeKey]) {
            if (flattenedTheme[textmateGroup]) {
              result[themeKey] = flattenedTheme[textmateGroup]
              break
            }
          }
        }
        if (result[themeKey]) {
          continue
        } else {
          console.warn(
            `Theme "${theme}" has an override for "${themeKey}" with value "${override}", but it is neither a theme key nor valid color.`,
          )
        }
      }
      for (const textmateGroup of unresolvedStyles[themeKey]) {
        if (flattenedTheme[textmateGroup]) {
          result[themeKey] = flattenedTheme[textmateGroup]
          break
        }
      }
    }
    return [theme, result]
  })
  return Object.fromEntries(await Promise.all(resolvedThemes)) as ThemesWithColorStyles
}

export async function getSortedPosts() {
  const allPosts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })
  const sortedPosts = allPosts.sort((a, b) => {
    return a.data.published < b.data.published ? -1 : 1
  })
  return sortedPosts
}

abstract class PostsCollationGroup implements CollationGroup<'posts'> {
  title: string
  url: string
  collations: Collation<'posts'>[]

  constructor(title: string, url: string, collations: Collation<'posts'>[]) {
    this.title = title
    this.url = url
    this.collations = collations
  }

  sortCollationsAlpha(): Collation<'posts'>[] {
    this.collations.sort((a, b) => a.title.localeCompare(b.title))
    return this.collations
  }

  sortCollationsLargest(): Collation<'posts'>[] {
    this.collations.sort((a, b) => b.entries.length - a.entries.length)
    return this.collations
  }

  sortCollationsMostRecent(): Collation<'posts'>[] {
    this.collations.sort((a, b) => {
      const aDate = a.entries[a.entries.length - 1].data.published
      const bDate = b.entries[b.entries.length - 1].data.published
      return aDate < bDate ? 1 : -1
    })
    return this.collations
  }

  add(item: CollectionEntry<'posts'>, collationTitle: string): void {
    const collationTitleSlug = slug(collationTitle.trim())
    const existing = this.collations.find((i) => i.titleSlug === collationTitleSlug)
    if (existing) {
      const alreadyHasThisPost = existing.entries.find((e) => e.id === item.id)
      if (!alreadyHasThisPost) {
        existing.entries.push(item)
      }
    } else {
      this.collations.push({
        title: collationTitle,
        titleSlug: collationTitleSlug,
        url: `${this.url}/${encodeURIComponent(collationTitleSlug)}`,
        entries: [item],
      })
    }
  }

  match(rawKey: string): Collation<'posts'> | undefined {
    return this.collations.find((entry) => entry.title === rawKey)
  }

  matchMany(rawKeys: string[]): Collation<'posts'>[] {
    return this.collations.filter((entry) => rawKeys.includes(entry.title))
  }
}

export class SeriesGroup extends PostsCollationGroup {
  // Private constructor to enforce the use of the static build method
  private constructor(title: string, url: string, items: Collation<'posts'>[]) {
    super(title, url, items)
  }
  // Factory method to create a SeriesGroup instance with async data fetching
  static async build(posts?: CollectionEntry<'posts'>[]): Promise<SeriesGroup> {
    const sortedPosts = posts || (await getSortedPosts())
    const seriesGroup = new SeriesGroup('Series', '/series', [])
    sortedPosts.forEach((post) => {
      const frontmatterSeries = post.data.series
      if (frontmatterSeries) {
        seriesGroup.add(post, frontmatterSeries)
      }
    })
    return seriesGroup
  }
}

export class TagsGroup extends PostsCollationGroup {
  // Private constructor to enforce the use of the static build method
  private constructor(title: string, url: string, items: Collation<'posts'>[]) {
    super(title, url, items)
  }

  // Factory method to create a SeriesGroup instance with async data fetching
  static async build(posts?: CollectionEntry<'posts'>[]): Promise<SeriesGroup> {
    const sortedPosts = posts || (await getSortedPosts())
    const tagsGroup = new TagsGroup('Tags', '/tags', [])
    sortedPosts.forEach((post) => {
      const frontmatterTags = post.data.tags || []
      frontmatterTags.forEach((tag) => {
        tagsGroup.add(post, tag)
      })
    })
    return tagsGroup
  }
}

export function getPostSequenceContext(
  post: CollectionEntry<'posts'>,
  posts: CollectionEntry<'posts'>[],
) {
  const index = posts.findIndex((p) => p.id === post.id)
  const prev = index > 0 ? posts[index - 1] : undefined
  const next = index < posts.length - 1 ? posts[index + 1] : undefined
  return { index, prev, next }
}
