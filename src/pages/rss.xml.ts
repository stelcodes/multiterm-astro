import rss from '@astrojs/rss'
import siteConfig from '../site.config'
import type { AstroGlobal } from 'astro'
import { getCollection } from 'astro:content'
import { getSortedPosts } from '@utils'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
const parser = new MarkdownIt()

// https://docs.astro.build/en/recipes/rss/
export async function GET(_context: AstroGlobal) {
  if (!siteConfig.site) {
    console.warn(
      'Site URL is required for RSS feed generation. Skipping RSS feed generation.',
    )
    return
  }
  const posts = await getSortedPosts()
  return rss({
    stylesheet: '/rss.xsl',
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.published,
      description: post.data.description,
      author: post.data.author || siteConfig.author,
      link: `/posts/${post.id}`,
      content: sanitizeHtml(parser.render(post.body || ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
    })),
    trailingSlash: false,
  })
}
