import { createDirectus, rest, staticToken, readItem, readItems } from '@directus/sdk'
import { loadEnv } from 'vitepress'

const env = loadEnv('', process.cwd())

export const client = createDirectus('https://db.chromatone.center/').with(rest()).with(staticToken('W12HVtPiXYK3V5baFBO28I0XwgkGH9YY'))

export async function useItems(collection, query) {
  try {
    const items = await client.request(readItems(collection, query))

    return items
  } catch (e) {
    console.log(e)
  }
}

//array:https://synth.playtronica.com,http://localhost:4173,https://tsoop.com,https://chromatone.center