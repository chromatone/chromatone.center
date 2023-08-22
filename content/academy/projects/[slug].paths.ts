import { useItems } from "../../../db"

export default {
  async paths() {

    const projects = await useItems('projects', {
      fields: [
        '*',
      ]
    })

    return projects.map(ev => {
      let content = ev.content
      delete ev.content
      return { params: ev, content }
    })
  }
}