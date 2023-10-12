import { reactive } from "vue";


export const wheels = reactive((() => {
  return [
    { num: 4, den: 4 },
    { num: 16, den: 16 }
  ]
})()) 