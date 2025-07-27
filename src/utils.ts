import type { ThemeStyles } from '@types'
import type { ExpressiveCodeTheme } from 'astro-expressive-code'
import { getCollection } from 'astro:content'

export function dateString(date: Date) {
  return date.toISOString().split('T')[0]
}

export function resolveElementStyles(
  theme: ExpressiveCodeTheme,
  overrides?: ThemeStyles,
): { [key: string]: string } {
  const defaultStyles: ThemeStyles = {
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
  let result: { [key: string]: string } = {}
  function flattenThemeColors(theme: ExpressiveCodeTheme): { [key: string]: string } {
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
  const flattenedTheme = flattenThemeColors(theme)
  Object.entries(defaultStyles).forEach(([el, groups]) => {
    const overrideGroups = overrides ? overrides[el as keyof ThemeStyles] : []
    for (const group of [...(overrideGroups || []), ...groups]) {
      if (flattenedTheme[group]) {
        result[el] = flattenedTheme[group]
        break
      }
    }
  })
  return result
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
