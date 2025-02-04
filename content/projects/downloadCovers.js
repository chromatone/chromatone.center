import download from 'image-downloader'

import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from 'node:fs'


export async function downloadCovers(records = [], {
  field = 'cover',
  folder = 'cover',
  query = 'quality=70&width=800&height=800&format=webp'
} = options) {

  const dirname = path.dirname(fileURLToPath(import.meta.url));
  let dest = path.resolve(dirname, '../public/', folder)
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const urls = []

  for (let r of records) {
    if (!r?.[field]) continue
    let filePath = path.resolve(dest, `${r.slug}.webp`)
    if (fs.existsSync(filePath)) continue
    console.log(r, r[field])
    let url = `https://db.chromatone.center/assets/${r[field]?.id}?${query}&download`
    urls.push({ url, slug: r.slug, dest: filePath })
  }


  const chunkSize = 5;
  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize);
    await Promise.all(chunk.map(rec => {
      console.log('downloading file:', rec.slug + '.webp')
      return download.image(rec)
    }));
  }

}