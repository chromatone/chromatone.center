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
      ],
    })

    return projects.map(p => {
      let content = p.content
      delete p.content
      return { params: p, content }
    })
  }
}