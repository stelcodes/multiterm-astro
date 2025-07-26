import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'hast'

const plugin: Plugin<[], Root> = () => {
  return function transformer(tree) {
    visit(tree, 'element', (el) => {
      if (el.tagName === 'img') {
        const alt = el.properties?.alt
        if (alt && typeof alt === 'string' && alt.endsWith('#pixelated')) {
          el.properties['pixelated'] = 'true'
          el.properties.alt = alt.replace(/#pixelated/g, '').trim()
        }
      }
    })
  }
}

export default plugin
