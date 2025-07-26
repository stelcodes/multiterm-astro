import type { Root, Text } from 'mdast'
import type { Plugin } from 'unified'
import { nameToEmoji, emojiToName } from 'gemoji'
import emojiRegex from 'emoji-regex'
import { findAndReplace } from 'mdast-util-find-and-replace'

function emojiSpan(emojiLiteral: string, emojiDescription: string): Text {
  return {
    type: 'text',
    value: emojiLiteral,
    data: {
      hName: 'span',
      hProperties: { role: 'img', ariaLabel: emojiDescription.replace(/_/g, ' ') },
      hChildren: [{ type: 'text', value: emojiLiteral }],
    },
  }
}

/**
 * Plugin to replace emoji shortcodes with their corresponding emoji characters.
 * It uses the `gemoji` package to map shortcode names to emoji characters.
 */
const plugin: Plugin<[], Root> = () => (tree) => {
  findAndReplace(tree, [
    [
      /:(\+1|[-\w]+):/g,
      (_: string, emojiShortcode: string) => {
        return Object.hasOwn(nameToEmoji, emojiShortcode)
          ? emojiSpan(nameToEmoji[emojiShortcode], emojiShortcode)
          : false
      },
    ],
    [
      emojiRegex(),
      (emojiLiteral: string) => {
        return Object.hasOwn(emojiToName, emojiLiteral)
          ? emojiSpan(emojiLiteral, emojiToName[emojiLiteral])
          : false
      },
    ],
  ])
}

export default plugin
