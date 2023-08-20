import { useItems } from "../../../db"

export default {
  async paths() {

    const posts = await useItems('devlog')

    return posts.map(ev => {
      let content = ev.content
      delete ev.content
      return { params: ev, content }
    })
  }
}