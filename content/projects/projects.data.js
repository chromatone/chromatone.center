import { createDirectus, rest, readItems, staticToken } from '@directus/sdk'
import { downloadCovers } from './downloadCovers'

export default {
  async load() {
    let projects = []
    try {
      projects = await createDirectus('https://db.chromatone.center/')
        .with(staticToken('HDqt6uvSbGyYnL4tdi3jntEHOj7i_aYp'))
        .with(rest())
        .request(readItems('projects', {
          sort: '-start_date',
          fields: ['*', 'title', 'description', 'start_date', 'end_date', 'field', 'program.title', 'cover.id']
        }))
    } catch (e) {
      console.log('Projects fetch failed')
    }

    await downloadCovers(projects, {
      folder: 'cover'
    })

    return projects
  }
}