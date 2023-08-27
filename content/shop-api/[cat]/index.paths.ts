import { useItems } from "../../../db"

export default {
  async paths() {

    const categories = await useItems('categories', {
      fields: [
        '*',
        {
          products: [
            '*',
            {
              category: ['slug']
            }
          ]
        }
      ]
    })

    return categories.map(category => {
      let content = category.content
      delete category.content
      return {
        params: {
          ...category,
          cat: category?.slug
        }, content
      }
    })
  }
}