import {
  ExpressiveCodeTheme,
  loadShikiTheme,
  type BundledShikiTheme,
} from 'astro-expressive-code'
import siteConfig from '../../site.config'
import type { APIContext } from 'astro'
import { flattenThemeColors } from '@utils'
import Color from 'color'
import type { CommonThemeKey } from '@types'

interface Props {
  theme: BundledShikiTheme
}

const createCss = (exTheme: ExpressiveCodeTheme) => {
  const t = flattenThemeColors(exTheme)
  // console.log(t)
  const foreground = exTheme.fg
  const background = exTheme.bg
  const fromTheme = (key: CommonThemeKey) => {
    let result = t[key]
    if (!result) {
      console.warn(`Theme ${exTheme.name} does not have color for ${key}`)
      result = foreground
    }
    return result
  }
  const muted = (color: string, amount: number) => {
    const x = Color(color)
    return x.alpha(amount / 100).rgb()
  }
  const a = fromTheme('markup.link')
  const accent = fromTheme('markup.heading')
  const comment = fromTheme('comment')
  const constant = fromTheme('constant.numeric')
  const entity = fromTheme('entity.name.function')
  const storageModifierImport = foreground
  const entityTag = fromTheme('entity.name.tag')
  const keyword = fromTheme('keyword')
  const string = fromTheme('string')
  const variable = fromTheme('variable')
  const brackethighlighterUnmatched = fromTheme('comment')
  const invalidIllegalText = fromTheme('errorForeground')
  // const invalidIllegalBg = fromTheme('war')
  const carriageReturnText = fromTheme('comment')
  const regexp = fromTheme('string.regexp')
  const markupList = foreground
  const markupHeading = fromTheme('markup.heading')
  const markupItalic = fromTheme('markup.italic')
  const markupBold = fromTheme('markup.bold')
  const markupDeletedText = fromTheme('markup.deleted')
  const markupInsertedText = fromTheme('markup.inserted')
  const changedText = foreground
  const ignoredText = fromTheme('comment')
  const red = fromTheme('terminal.ansiRed')
  const green = fromTheme('terminal.ansiGreen')
  const blue = fromTheme('terminal.ansiBlue')
  const yellow = fromTheme('terminal.ansiYellow')
  const magenta = fromTheme('terminal.ansiMagenta')
  const cyan = fromTheme('terminal.ansiCyan')

  const altBackground = muted(foreground, 5).mix(Color(background), 0.5).hex()
  return `
/*!
 * Modified from GitHub's Dark Dimmed theme, licensed under the MIT License
 * Copyright (c) 2018 GitHub Inc.
 * https://github.com/primer/primitives/blob/main/LICENSE
 */

main {
  --color-prettylights-syntax-comment: ${comment};
  --color-prettylights-syntax-constant: ${constant};
  --color-prettylights-syntax-entity: ${entity};
  --color-prettylights-syntax-storage-modifier-import: ${storageModifierImport};
  --color-prettylights-syntax-entity-tag: ${entityTag};
  --color-prettylights-syntax-keyword: ${keyword};
  --color-prettylights-syntax-string: ${string};
  --color-prettylights-syntax-variable: ${variable};
  --color-prettylights-syntax-brackethighlighter-unmatched: ${brackethighlighterUnmatched};
  --color-prettylights-syntax-invalid-illegal-text: ${invalidIllegalText};
  --color-prettylights-syntax-carriage-return-text: ${carriageReturnText};
  --color-prettylights-syntax-string-regexp: ${regexp};
  --color-prettylights-syntax-markup-list: ${markupList};
  --color-prettylights-syntax-markup-heading: ${markupHeading};
  --color-prettylights-syntax-markup-italic: ${markupItalic};
  --color-prettylights-syntax-markup-bold: ${markupBold};
  --color-prettylights-syntax-markup-deleted-text: ${markupDeletedText};
  --color-prettylights-syntax-markup-inserted-text: ${markupInsertedText};
  --color-prettylights-syntax-markup-changed-text: ${changedText};
  --color-prettylights-syntax-markup-ignored-text: ${ignoredText};
  --color-btn-text: ${foreground};
  --color-btn-bg: transparent;
  --color-btn-border: ${altBackground};
  --color-btn-shadow: 0 0 transparent;
  --color-btn-inset-shadow: 0 0 transparent;
  --color-btn-hover-bg: #444c56;
  --color-btn-hover-border: #768390;
  --color-btn-active-bg: hsl(213deg 12% 27% / 100%);
  --color-btn-active-border: #636e7b;
  --color-btn-selected-bg: #2d333b;
  --color-btn-primary-text: ${background};
  --color-btn-primary-bg: ${muted(accent, 80)};
  --color-btn-primary-border: transparent;
  --color-btn-primary-shadow: 0 0 transparent;
  --color-btn-primary-inset-shadow: 0 0 transparent;
  --color-btn-primary-hover-bg: var(--color-btn-primary-bg);
  --color-btn-primary-hover-border: var(--color-btn-primary-border);
  --color-btn-primary-selected-bg: var(--color-btn-primary-bg);
  --color-btn-primary-selected-shadow: 0 0 transparent;
  --color-btn-primary-disabled-text: ${background};
  --color-btn-primary-disabled-bg: ${muted(accent, 60)};
  --color-btn-primary-disabled-border: transparent;
  --color-action-list-item-default-hover-bg: rgb(144 157 171 / 12%);
  --color-segmented-control-bg: ${altBackground};
  --color-segmented-control-button-bg: transparent;
  --color-segmented-control-button-selected-border: ${muted(accent, 70)};
  --color-fg-default: ${foreground};
  --color-fg-muted: ${muted(foreground, 70)};
  --color-fg-subtle: #545d68;
  --color-canvas-default: ${background};
  --color-canvas-overlay: ${altBackground};
  --color-canvas-inset: ${altBackground};
  --color-canvas-subtle: ${background};
  --color-border-default: ${muted(foreground, 20)};
  --color-border-muted: ${muted(foreground, 10)};
  --color-neutral-muted: ${altBackground};
  --color-accent-fg: ${muted(accent, 70)};
  --color-accent-emphasis: ${muted(accent, 70)};
  --color-accent-muted: var(--color-border-default);
  --color-accent-subtle: ${altBackground};
  --color-success-fg: ${green};
  --color-attention-fg: ${yellow};
  --color-attention-muted: rgb(174 124 20 / 40%);
  --color-attention-subtle: rgb(174 124 20 / 15%);
  --color-danger-fg: ${red};
  --color-danger-muted: rgb(229 83 75 / 40%);
  --color-danger-subtle: rgb(229 83 75 / 10%);
  --color-primer-shadow-inset: 0 0 transparent;
  --color-scale-gray-7: #373e47;
  --color-scale-blue-8: #143d79;

  /*! Extensions from @primer/css/alerts/flash.scss */
  --color-social-reaction-bg-hover: var(--color-scale-gray-7);
  --color-social-reaction-bg-reacted-hover: ${muted(accent, 10)};
}

main .pagination-loader-container {
  background-image: url("https://github.com/images/modules/pulls/progressive-disclosure-line-dark.svg");
}

/*! Custom CSS */

.gsc-reactions-count {
  display: none;
}

.gsc-timeline {
  flex-direction: column-reverse;
}

.gsc-header {
  padding-bottom: 1rem;
}

.gsc-comment-header {
  padding-top: 0.75rem !important;
}

.gsc-comments > .gsc-header {
  order: 1;
}

.gsc-comments > .gsc-comment-box {
  order: 2;
  margin-bottom: 1rem;
}

.gsc-replies {
  padding-top: 0 !important;
}

.gsc-comments > .gsc-timeline {
  order: 3;
}

div.gsc-comment-content div.highlight pre {
  border-radius: 0.75rem;
  border: 1px solid ${muted(foreground, 8)};
}

div.gsc-comment-content code {
  border-radius: 0.375rem;
}

.gsc-homepage-bg {
  background-color: #15202b;
}

main .gsc-loading-image {
  background-image: url("https://github.githubassets.com/images/mona-loading-dimmed.gif");
}
`
}

export async function GET(context: APIContext) {
  const { theme } = context.props as Props
  const shikiTheme = await loadShikiTheme(theme as BundledShikiTheme)
  const css = createCss(shikiTheme)
  return new Response(css, {
    headers: {
      'Access-Control-Allow-Origin': 'https://giscus.app',
      'Access-Control-Allow-Methods': 'GET OPTIONS',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'text/css',
    },
  })
}

export async function getStaticPaths() {
  return siteConfig.themes.include.map((theme) => {
    return {
      params: { theme },
      props: { theme },
    }
  })
}
