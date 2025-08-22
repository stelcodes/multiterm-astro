import type { Parent, Root } from 'mdast'
import type { LeafDirective, TextDirective } from 'mdast-util-directive'
import { directiveToMarkdown } from 'mdast-util-directive'
import { toMarkdown } from 'mdast-util-to-markdown'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { h as _h } from 'hastscript'
import type { Node } from 'mdast'
import type { Directives } from 'mdast-util-directive'

/** Checks if a node is a directive. */
function isNodeDirective(node: Node): node is Directives {
  return (
    node.type === 'containerDirective' ||
    node.type === 'leafDirective' ||
    node.type === 'textDirective'
  )
}

/**
 * From Astro Starlight:
 * Transforms directives not supported back to original form as it can break user content and result in 'broken' output.
 */
function transformUnhandledDirective(
  node: LeafDirective | TextDirective,
  index: number,
  parent: Parent,
) {
  const textNode = {
    type: 'text',
    value: toMarkdown(node, { extensions: [directiveToMarkdown()] }),
  } as const
  if (node.type === 'textDirective') {
    parent.children[index] = textNode
  } else {
    parent.children[index] = {
      children: [textNode],
      type: 'paragraph',
    }
  }
}

const remarkUnknownAdmonitions: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined || !isNodeDirective(node)) return
    if (node.type === 'textDirective' || node.type === 'leafDirective') {
      transformUnhandledDirective(node, index, parent)
    }
  })
}

export default remarkUnknownAdmonitions
