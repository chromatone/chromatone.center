import { useItems } from "../../../../db"

export default {
  async paths() {

    const projects = await useItems('projects', {
      fields: [
        '*',
        {
          events: [
            '*',
            { project: ['title'] }
          ]
        }
      ]
    })

    return projects.map(ev => {
      let content = ev.content
      delete ev.content
      return { params: ev, content }
    })
  }
}