import { createDirectus, rest, staticToken, readItems } from '@directus/sdk'

export default {
  load: async () => await createDirectus('https://db.chromatone.center/')
    .with(rest())
    .with(staticToken('W12HVtPiXYK3V5baFBO28I0XwgkGH9YY'))
    .request(readItems('tools', {
      sort: ['title'],
      filter: {
        type: {
          _eq: 'tool'
        }
      }
    }))
}