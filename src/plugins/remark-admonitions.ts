import type { PhrasingContent, Root } from 'mdast'
import { toString as mdastToString } from 'mdast-util-to-string'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { AdmonitionType } from '~/types'
import { h as _h, type Properties } from 'hastscript'
import type { Paragraph as P } from 'mdast'

/** From Astro Starlight: Function that generates an mdast HTML tree ready for conversion to HTML by rehype. */
function h(el: string, attrs: Properties = {}, children: any[] = []): P {
  const { properties, tagName } = _h(el, attrs)
  return {
    children,
    data: { hName: tagName, hProperties: properties },
    type: 'paragraph',
  }
}

// Supported admonition types
const Admonitions = new Set<AdmonitionType>([
  'tip',
  'note',
  'important',
  'caution',
  'warning',
])

/** Checks if a string is a supported admonition type. */
function isAdmonition(s: string): s is AdmonitionType {
  return Admonitions.has(s as AdmonitionType)
}

export const remarkAdmonitions: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined || node.type !== 'containerDirective') return

    const admonitionType = node.name
    if (!isAdmonition(admonitionType)) return

    let title: string = admonitionType
    let titleNode: PhrasingContent[] = [{ type: 'text', value: title }]

    // Check if there's a custom title
    const firstChild = node.children[0]
    if (
      firstChild?.type === 'paragraph' &&
      firstChild.data &&
      'directiveLabel' in firstChild.data &&
      firstChild.children.length > 0
    ) {
      titleNode = firstChild.children
      title = mdastToString(firstChild.children)
      // The first paragraph contains a custom title, we can safely remove it.
      node.children.splice(0, 1)
    }

    // Do not change prefix to AD, ADM, or similar, adblocks will block the content inside.
    const admonition = h(
      'aside',
      {
        'aria-label': title,
        class: 'admonition',
        'data-admonition-type': admonitionType,
      },
      [
        h('p', { class: 'admonition-title', 'aria-hidden': 'true' }, [...titleNode]),
        h('div', { class: 'admonition-content' }, node.children),
      ],
    )

    parent.children[index] = admonition
  })
}
