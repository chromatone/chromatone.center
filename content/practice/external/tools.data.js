import { useItems } from "../../../db/database"

export default {
  async load() {
    const tools = await useItems('tools', {
      sort: ['title'],
      filter: {
        type: {
          _eq: 'tool'
        }
      }
    })
    return tools
  }
}