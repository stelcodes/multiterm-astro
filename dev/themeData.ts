import { loadShikiTheme, type BundledShikiTheme } from 'astro-expressive-code'
import { bundledThemes } from 'shiki'
import { flattenThemeColors } from '@utils'

// Use this function to export theme data for analysis
const exportThemeData = async () => {
  const keyArrays = await Promise.all(
    Object.keys(bundledThemes).map(async (theme) => {
      const exTheme = await loadShikiTheme(theme as BundledShikiTheme)
      const flatTheme = flattenThemeColors(exTheme)
      return Object.keys(flatTheme)
    }),
  )
  // Find intersection of all key arrays
  const commonKeys = keyArrays.reduce((acc, keys) =>
    acc.filter((key) => keys.includes(key)),
  )
  const allKeys = keyArrays.flat()
  const keyCount = allKeys.reduce((acc: Record<string, number>, key) => {
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  // Filter keys that appear in less than 10% of themes
  // and sort them alphabetically
  const sortedEntries = Object.entries(keyCount)
    .filter(([_, count]) => count > Math.ceil(Object.keys(bundledThemes).length / 10))
    .sort((a, b) => a[0].localeCompare(b[0]))
  const jsonData = JSON.stringify(
    {
      allKeys: Object.fromEntries(sortedEntries),
      commonKeys: commonKeys.sort(),
      bundledThemes: Object.keys(bundledThemes).sort(),
    },
    null,
    2,
  )
  const outputPath = './data/theme-data.json'
  // Write to file
  const fs = await import('fs/promises')
  await fs.writeFile(outputPath, jsonData, 'utf-8')
  console.log(`Theme data written to ${outputPath}`)
}

await exportThemeData()
