import { useItems } from "../../../db"

export default {
  async load() {
    const tools = await useItems('tools')
    return tools
  }
}