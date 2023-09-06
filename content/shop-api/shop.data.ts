import { useItems } from "../../data"

export default {
  async load() {
    // const products = await useItems('products',
    //   {
    //     filter: {
    //       status: {
    //         _eq: 'published'
    //       },
    //       // project: {
    //       //   _eq: '0fde2a85-a24b-4446-b8ce-68e49a6c03e8'
    //       // }
    //     },
    //     // sort: ['-date'],
    //     fields: [
    //       '*',
    //       { category: ['slug'] }
    //     ]
    //   })

    const categories = await useItems('categories',
      {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        fields: [
          '*',
          {
            products: ['*',
              { category: ['slug'] }]
          }
        ]
      })

    return {
      // products,
      categories
    }
  }
}