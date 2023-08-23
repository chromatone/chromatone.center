import { useItems } from "../../../db"

export default {
  async load() {
    const events = await useItems('events',
      {
        filter: {
          status: {
            _eq: 'published'
          },
          // project: {
          //   _eq: '0fde2a85-a24b-4446-b8ce-68e49a6c03e8'
          // }
        },
        sort: ['-date'],
        fields: [
          '*',
          {
            place: ['title'],
            project: ['title']
          },
        ]
      })
    return {
      events
    }
  }
}