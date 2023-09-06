import { createDirectus, rest, staticToken, readItem, readItems } from '@directus/sdk'
import { loadEnv } from 'vitepress'

const env = loadEnv('', process.cwd())

export const client = createDirectus('https://db.chromatone.center/').with(rest()).with(staticToken(env.VITE_CMS_KEY))

export async function useItems(collection, query?) {
  try {
    const items = await client.request(readItems(collection, query))

    return items
  } catch (e) {
    console.log(e)
  }
}

//array:https://synth.playtronica.com,http://localhost:4173,https://tsoop.com,https://chromatone.center