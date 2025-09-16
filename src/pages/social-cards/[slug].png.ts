import siteConfig from '~/site.config'
import { Resvg } from '@resvg/resvg-js'
import type { APIContext, InferGetStaticPropsType } from 'astro'
import satori, { type SatoriOptions } from 'satori'
import { html } from 'satori-html'
import { dateString, getSortedPosts, resolveThemeColorStyles } from '~/utils'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import type { ReactNode } from 'react'

const COVER_IMAGE_SIZE = 300

// Load the font file as binary data
const fontPath = path.resolve(
  './node_modules/@expo-google-fonts/jetbrains-mono/400Regular/JetBrainsMono_400Regular.ttf',
)
const fontData = fs.readFileSync(fontPath) // Reads the file as a Buffer

const avatarPath = path.resolve(siteConfig.socialCardAvatarImage)
const avatarBase64 =
  fs.existsSync(avatarPath) ?
    await convertImageToBase64(avatarPath) :
    undefined

const defaultTheme =
  siteConfig.themes.default === 'auto'
    ? siteConfig.themes.include[0]
    : siteConfig.themes.default

const themeStyles = await resolveThemeColorStyles(
  [defaultTheme],
  siteConfig.themes.overrides,
)
const bg = themeStyles[defaultTheme]?.background
const fg = themeStyles[defaultTheme]?.foreground
const accent = themeStyles[defaultTheme]?.accent

if (!bg || !fg || !accent) {
  throw new Error(`Theme ${defaultTheme} does not have required colors`)
}

async function convertImageToBase64(imagePath: string): Promise<string> {
  const imageBuffer = await sharp(imagePath)
    .resize(COVER_IMAGE_SIZE, COVER_IMAGE_SIZE, { fit: 'cover' })
    .png({
      compressionLevel: 9,
      quality: 80,
      progressive: true
    })
    .toBuffer()

  return `data:image/png;base64,${imageBuffer.toString('base64')}`
}

const ogOptions: SatoriOptions = {
  // debug: true,
  fonts: [
    {
      data: fontData,
      name: 'JetBrains Mono',
      style: 'normal',
      weight: 400,
    },
  ],
  height: 630,
  width: 1200,
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>

// for some reason the path metadata doesn't contain the original path to the cover image
// instead it has only a reference to the "dist" directory of the build
// since we don't want to rely on the location of that directory and on the timing of when the image
// appears there, we try to recreate the original image path by inspecting the assets and matching them
// to the mangled name we got from the post
function findOriginalImagePath(mangledSrc: string, assetImports: string[], postDir: string): string | null {
  // Extract the filename without hash from the mangled path
  // e.g., "/_astro/cover.DX2hdcLU.png" -> "cover.png"
  const mangledFilename = path.basename(mangledSrc)
  const originalName = mangledFilename.replace(/\.[A-Za-z0-9_-]+\./, '.')

  // Find matching asset import
  const matchingAsset = assetImports.find(assetPath =>
    path.basename(assetPath) === originalName
  )

  return matchingAsset ? path.resolve(postDir, matchingAsset) : null
}

async function getCoverImage(coverImageSrc: string | undefined, assetImports: string[], postDir: string) {
  if (!coverImageSrc) return undefined

  const originalPath = findOriginalImagePath(coverImageSrc, assetImports, postDir)
  if (!originalPath || !fs.existsSync(originalPath)) {
    console.warn(`Could not find original image for ${coverImageSrc}`)
    return undefined
  }

  return convertImageToBase64(originalPath)
}

const getMarkup = ({
  title,
  pubDate,
  author,
  coverImageBase64,
  avatarBase64,
  bg,
  fg,
  accent,
  imageSize }: SocialCardProps) => {

  // this formatting does not look good...
  const titleFontSize =
    title.length > 80 ? 'text-3xl' :
      title.length > 60 ? 'text-4xl' :
        title.length > 40 ? 'text-5xl' :
          'text-6xl'

  const image =
    coverImageBase64 ? `
      <div tw="flex flex-col justify-center items-center w-1/3">
        <img src="${coverImageBase64}" tw="w-full max-w-xs rounded-xl" width=${imageSize} height=${imageSize} />
      </div>`:
      avatarBase64 ? `
      <div tw="flex flex-col justify-center items-center w-1/3">
        <img src="${avatarBase64}" tw="w-full max-w-xs rounded-full" width=${imageSize} height=${imageSize} />
      </div>`: ''

  return html(`
    <div tw="relative w-full h-full flex bg-[${bg}] text-[${fg}]">
      <!-- Fixed border frame -->
      <div tw="absolute flex inset-12 border-4 rounded-3xl border-[${accent}]/30"></div>

      <!-- Date at fixed position -->
      ${pubDate ? `<p tw="absolute top-16 left-18 text-2xl text-[${accent}]">${pubDate}</p>` : ''}

      <!-- Centered content -->
      <div tw="absolute inset-12 p-8 flex items-center">
        ${image}
        <div tw="flex flex-1 flex-col justify-center items-center">
          <h1 tw="${titleFontSize} text-center leading-snug">${title}</h1>
          ${author !== title ? `<p tw="text-4xl mt-8 text-center text-[${accent}]">${author}</p>` : ''}
        </div>
      </div>
    </div>
  `)
}
export async function GET(context: APIContext) {
  const { pubDate, title, author, coverImage, assetImports, postDir } = context.props as Props
  const coverImageBase64 = await getCoverImage(coverImage, assetImports, postDir)

  const markup = getMarkup({
    title,
    pubDate,
    author,
    coverImageBase64,
    avatarBase64,
    bg,
    fg,
    accent,
    imageSize: COVER_IMAGE_SIZE
  })

  const svg = await satori(markup as ReactNode, ogOptions)
  const png = new Resvg(svg).render().asPng()
  return new Response(png, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'image/png',
    },
  })
}

export async function getStaticPaths() {
  const posts = await getSortedPosts()

  const postPaths = posts.map(post => {
    const postDir = path.dirname(path.resolve(post.filePath))

    return {
      params: { slug: post.id },
      props: {
        pubDate: post.data.published ? dateString(post.data.published) : undefined,
        title: post.data.title,
        author: post.data.author || siteConfig.author,
        coverImage: post.data.coverImage?.src.src,
        assetImports: post.assetImports || [],
        postDir,
      },
    }
  })

  const defaultPath = {
    params: { slug: '__default' },
    props: {
      pubDate: undefined,
      title: siteConfig.title,
      author: siteConfig.author,
      coverImage: undefined,
      assetImports: [],
      postDir: '',
    },
  }

  return [...postPaths, defaultPath]
}

interface SocialCardProps {
  title: string
  pubDate?: string
  author: string
  coverImageBase64?: string
  avatarBase64?: string
  bg?: string
  fg?: string
  accent?: string
  imageSize: number
}
