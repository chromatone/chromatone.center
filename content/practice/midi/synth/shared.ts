import { useStorage } from "@vueuse/core"
import { useClamp } from "@vueuse/math"
import { computed, reactive } from "vue"

export interface Param {
  name: string
  value: number
  min: number
  max: number
  step: number
}

export function generateUI(params: Param[]) {
  return reactive({
    controls: ((ps) => {
      const control = {}
      ps.forEach(p => {
        control[p.name] = useClamp(useStorage(`es:${p.name}`, p.value), p.min, p.max)
      })
      return control
    })(params),
    groups: computed(() => {
      const accumulator: Record<string, Param[]> = {}
      return params.reduce((acc, val) => {
        const title = val.name.split(':')
        const name = title.pop()
        const group = title.pop()

        acc[group] = acc[group] || []
        acc[group].push(val)
        return acc
      }, accumulator)
    })
  })
}