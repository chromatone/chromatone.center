import { useItems } from "../../../db"

export default {
  async load() {
    const tools = await useItems('tools', {
      sort: ['title']
    })
    return tools
  }
}