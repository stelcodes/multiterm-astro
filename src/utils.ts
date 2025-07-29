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
          acc[s] = foreground
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
    'markup.heading',
    'editor.foreground',
  ],
  h1: [
    'heading.1.markdown entity.name',
    'heading.1.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  h2: [
    'heading.2.markdown entity.name',
    'heading.2.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  h3: [
    'heading.3.markdown entity.name',
    'heading.3.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  h4: [
    'heading.4.markdown entity.name',
    'heading.4.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  h5: [
    'heading.5.markdown entity.name',
    'heading.5.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  h6: [
    'heading.6.markdown entity.name',
    'heading.6.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  li: [
    'markup.list.bullet',
    'punctuation.definition.list.begin.markdown',
    'heading.1.markdown entity.name',
    'heading.1.markdown',
    'markup.heading',
    'editor.foreground',
  ],
  italic: [
    'markup.italic',
    'punctuation.definition.italic.markdown',
    'editor.foreground',
  ],
  a: ['markup.link', 'string.other.link.title.markdown', 'editor.foreground'],
  hr: ['meta.separator', 'editor.foreground'],
  blue: ['terminal.ansiBlue', 'terminal.ansiBrightBlue'],
  green: ['terminal.ansiGreen', 'terminal.ansiBrightGreen'],
  red: ['terminal.ansiRed', 'terminal.ansiBrightRed'],
  yellow: ['terminal.ansiYellow', 'terminal.ansiBrightYellow'],
  magenta: ['terminal.ansiMagenta', 'terminal.ansiBrightMagenta'],
  cyan: ['terminal.ansiCyan', 'terminal.ansiBrightCyan'],
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

// const checkCommonThemeAttributes = async () => {
//   const keyArrays = await Promise.all(
//     siteConfig.themes.include.map(async (theme) => {
//       const exTheme = await loadShikiTheme(theme)
//       const flatTheme = flattenThemeColors(exTheme)
//       return Object.keys(flatTheme)
//     }),
//   )
//   // Find intersection of all key arrays
//   const commonKeys = keyArrays.reduce((acc, keys) =>
//     acc.filter((key) => keys.includes(key)),
//   )
//   console.log('"' + commonKeys.join('" | "') + '"')
// }
// checkCommonThemeAttributes()

// const printThemeAttributes = async () => {
//   const keyArrays = await Promise.all(
//     siteConfig.themes.include.map(async (theme) => {
//       const exTheme = await loadShikiTheme(theme)
//       const flatTheme = flattenThemeColors(exTheme)
//       return Object.keys(flatTheme)
//     }),
//   )
//   const allKeys = keyArrays.flat()
//   const keyCount = allKeys.reduce((acc: Record<string, number>, key) => {
//     acc[key] = (acc[key] || 0) + 1
//     return acc
//   }, {})
//   // Filter keys that appear in at least half of the themes
//   // and sort them alphabetically
//   const sortedEntries = Object.entries(keyCount)
//     .filter(([_, count]) => count >= Math.ceil(siteConfig.themes.include.length / 2))
//     .map(([key]) => key)
//     .sort((a, b) => a.localeCompare(b))
//   console.log(`"${sortedEntries.join('" | "')}"`)
// }
