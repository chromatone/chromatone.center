import { useItems } from "../../../db"

export default {
  async load() {
    const projects = await useItems('projects',
      {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        fields: [
          '*'
        ]
      })
    return { projects }
  }
}