import { createDirectus, rest, readItems, staticToken } from '@directus/sdk'

export default {
  async paths() {
    let projects = []

    try {
      projects = await createDirectus('https://db.chromatone.center/').with(staticToken('HDqt6uvSbGyYnL4tdi3jntEHOj7i_aYp')).with(rest()).request(readItems('projects', {
        fields: ['*', 'cover.id', 'program.title']
      }))
    } catch (e) {
      console.log('Projects paths not loaded', e)
    }

    return projects.map(project => {
      let content = project.content
      delete project.content
      return {
        params: {
          ...project
        },
        content
      }
    })
  }
}