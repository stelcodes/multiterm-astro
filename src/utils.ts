import type { TextmateStyles, ThemesWithColorStyles, ThemeKey } from '@types'
import {
  loadShikiTheme,
  type BundledShikiTheme,
  type ExpressiveCodeTheme,
} from 'astro-expressive-code'
import { getCollection } from 'astro:content'

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
  h1: [
    'heading.1.markdown entity.name',
    'heading.1.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  h2: [
    'heading.2.markdown entity.name',
    'heading.2.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  h3: [
    'heading.3.markdown entity.name',
    'heading.3.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  h4: [
    'heading.4.markdown entity.name',
    'heading.4.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  h5: [
    'heading.5.markdown entity.name',
    'heading.5.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  h6: [
    'heading.6.markdown entity.name',
    'heading.6.markdown',
    'markup.heading.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  li: [
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
  a: ['string.other.link.title.markdown', 'markup.link', 'editor.foreground'],
  hr: ['meta.separator.markdown', 'meta.separator', 'editor.foreground'],
  blue: ['terminal.ansiBlue', 'terminal.ansiBrightBlue'],
  green: ['terminal.ansiGreen', 'terminal.ansiBrightGreen'],
  red: ['terminal.ansiRed', 'terminal.ansiBrightRed'],
  yellow: ['terminal.ansiYellow', 'terminal.ansiBrightYellow'],
  magenta: ['terminal.ansiMagenta', 'terminal.ansiBrightMagenta'],
  cyan: ['terminal.ansiCyan', 'terminal.ansiBrightCyan'],
  // For Giscus syntax highlighting
  comment: ['comment', 'punctuation.definition.comment', 'foreground'],
  constant: ['constant.language.boolean', 'constant.language', 'foreground'],
  entity: ['entity.name.function', 'support.function', 'function', 'foreground'],
  entityTag: [
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
}

export async function resolveThemeColorStyles(
  themes: BundledShikiTheme[],
  overrides?: ThemesWithColorStyles,
): Promise<ThemesWithColorStyles> {
  const resolvedThemes = themes.map(async (theme) => {
    const loadedTheme = await loadShikiTheme(theme)
    const flattenedTheme = flattenThemeColors(loadedTheme)
    const result = {} as { [key in ThemeKey]: string }
    for (const el of Object.keys(unresolvedStyles) as ThemeKey[]) {
      if (overrides?.[theme]?.[el]) {
        result[el] = overrides[theme][el]
      } else {
        for (const group of unresolvedStyles[el]) {
          if (flattenedTheme[group]) {
            result[el] = flattenedTheme[group]
            break
          }
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
    return a.data.published > b.data.published ? -1 : 1
  })
  return sortedPosts
}
