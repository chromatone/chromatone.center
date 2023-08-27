import { useItems } from "../../../../db"

export default {
  async paths() {

    const events = await useItems('events', {
      fields: [
        '*',
        {
          place: ['title', 'city', 'country', { logo: ['id'] }],
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