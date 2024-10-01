import { useItems } from "../../database"

export default {
  async load() {
    const tools = await useItems('tools', {
      sort: ['title'],
      filter: {
        type: {
          _eq: 'resource'
        }
      }
    })
    return tools || []
  }
}