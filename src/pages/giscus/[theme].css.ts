import { type BundledShikiTheme } from 'astro-expressive-code'
import siteConfig from '../../site.config'
import type { APIContext } from 'astro'
import { resolveThemeColorStyles } from '@utils'
import Color from 'color'
import type { ColorStyles, ThemeKey } from '@types'

interface Props {
  theme: BundledShikiTheme
  colorStyles: ColorStyles
}

const createCss = (styles: ColorStyles) => {
  const muted = (color: string, amount: number) => {
    const x = Color(color)
    return x.alpha(amount / 100).rgb()
  }
  const foreground = styles.foreground
  const background = styles.background
  const a = styles.a
  const accent = styles.accent
  const comment = styles.comment
  const constant = styles.foreground
  const entity = styles.entity
  const storageModifierImport = foreground
  const entityTag = styles.entityTag
  const keyword = styles.keyword
  const string = styles.string
  const variable = styles.variable
  const brackethighlighterUnmatched = styles.comment
  const invalidIllegalText = styles.red
  const carriageReturnText = styles.comment
  const regexp = styles.regexp
  const markupList = foreground
  const markupHeading = styles.foreground
  const markupItalic = styles.italic
  const markupBold = styles.foreground
  const changedText = foreground
  const ignoredText = styles.comment
  const red = styles.red
  const green = styles.green
  const blue = styles.blue
  const yellow = styles.yellow
  // const magenta = styles.magenta
  // const cyan = styles.cyan

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
  --color-prettylights-syntax-markup-deleted-text: ${red};
  --color-prettylights-syntax-markup-inserted-text: ${green};
  --color-prettylights-syntax-markup-changed-text: ${changedText};
  --color-prettylights-syntax-markup-ignored-text: ${ignoredText};
  --color-btn-text: ${foreground};
  --color-btn-bg: transparent;
  --color-btn-border: ${altBackground};
  --color-btn-shadow: 0 0 transparent;
  --color-btn-inset-shadow: 0 0 transparent;
  --color-btn-hover-bg: ${muted(accent, 70)};
  --color-btn-hover-border: transparent;
  --color-btn-active-bg: ${muted(accent, 70)};
  --color-btn-active-border: transparent;
  --color-btn-selected-bg: ${muted(accent, 70)};
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
  --color-action-list-item-default-hover-bg: ${muted(foreground, 4)};
  --color-segmented-control-bg: ${altBackground};
  --color-segmented-control-button-bg: transparent;
  --color-segmented-control-button-selected-border: ${muted(accent, 70)};
  --color-fg-default: ${foreground};
  --color-fg-muted: ${muted(foreground, 80)};
  --color-fg-subtle: ${muted(foreground, 70)};
  --color-canvas-default: ${background};
  --color-canvas-overlay: ${altBackground};
  --color-canvas-inset: ${altBackground};
  --color-canvas-subtle: ${background};
  --color-border-default: ${muted(foreground, 20)};
  --color-border-muted: ${muted(foreground, 10)};
  --color-neutral-muted: ${altBackground};
  --color-accent-fg: ${a};
  --color-accent-emphasis: ${muted(accent, 70)};
  --color-accent-muted: var(--color-border-default);
  --color-accent-subtle: ${altBackground};
  --color-success-fg: ${green};
  --color-attention-fg: ${yellow};
  --color-attention-muted: ${muted(yellow, 80)};
  --color-attention-subtle: ${muted(yellow, 70)};
  --color-danger-fg: ${red};
  --color-danger-muted: ${muted(red, 80)};
  --color-danger-subtle: ${muted(red, 70)};
  --color-primer-shadow-inset: 0 0 transparent;
  --color-scale-gray-7: ${muted(foreground, 50)};
  --color-scale-blue-8: ${blue};

  /*! Extensions from @primer/css/alerts/flash.scss */
  --color-social-reaction-bg-hover: var(--color-scale-gray-7);
  --color-social-reaction-bg-reacted-hover: ${muted(accent, 10)};
}

main .pagination-loader-container {
  background-image: url("https://github.com/images/modules/pulls/progressive-disclosure-line-dark.svg");
}

/*! Custom CSS */

textarea::placeholder,
input::placeholder {
  color: ${muted(foreground, 80)} !important;
}

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
  background-color: ${background};
}

main .gsc-loading-image {
  background-image: url("https://github.githubassets.com/images/mona-loading-dimmed.gif");
}
`
}

export async function GET(context: APIContext) {
  const { colorStyles } = context.props as Props
  const css = createCss(colorStyles)
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
  const resolvedColorStyles = await resolveThemeColorStyles(siteConfig.themes.include)
  return siteConfig.themes.include.map((theme) => {
    return {
      params: { theme },
      props: { colorStyles: resolvedColorStyles[theme] },
    }
  })
}
