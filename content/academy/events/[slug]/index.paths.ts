import { useItems } from "../../../../data"

export default {
  async paths() {

    const events = await useItems('events', {
      fields: [
        '*',
        {
          media: ['*', { directus_files_id: ['*'] }],
          place: ['title', 'city', 'country', 'slug', { logo: ['id'] }],
          project: ['*']
        }
      ]
    })

    return events.map(ev => {
      let content = ev.content
      delete ev.content
      return { params: ev, content }
    })
  }
}