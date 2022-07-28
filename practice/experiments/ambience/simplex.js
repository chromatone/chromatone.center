import { useStorage } from '@vueuse/core';
import { createNoise2D } from 'simplex-noise';

export const simplex = createNoise2D();

const count = ref(0)

export const tracks = reactive({})
export const zoom = useClamp(useStorage('ambient-noise-zoom', 100), 50, 500)

useRafFn(() => {
  count.value += 1
})

export function useSimplex({ title = 'simplex', size = 10, minSpeed = 0.001, maxSpeed = 10000 } = {}) {

  const progress = ref(0)

  const radius = useClamp(useStorage(title + '-radius', Math.random() * 250), 1, 250)

  const speed = useClamp(useStorage(title, Math.random() * 1000), minSpeed, maxSpeed)

  watch(count, () => progress.value += speed.value / 10000)

  const polar = computed(() => polarXY(radius.value, progress.value))

  const random = computed(() => simplex(polar.value.x / zoom.value, polar.value.y / zoom.value)
  )

  tracks[title] = reactive({ polar, radius, speed, random })

  return { random, polar, progress, count, speed, radius }
}

export function polarXY(radius = 1, angle = 0) {
  let radians = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: radius * Math.cos(radians),
    y: radius * Math.sin(radians),
  };
}