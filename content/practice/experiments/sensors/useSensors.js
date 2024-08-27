// useSensors.js
import { ref, computed } from 'vue'
import { useDeviceMotion, useDeviceOrientation } from '@vueuse/core'

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
const isMobile = /Mobi|Android/i.test(navigator.userAgent)

function requestPermission(type) {
  if (isIOS && typeof DeviceMotionEvent.requestPermission === 'function') {
    return DeviceMotionEvent.requestPermission().then(state => state === 'granted')
  }
  if (isMobile) {
    return Promise.resolve(type in window)
  }
  return Promise.resolve(true)
}

export function useSensors() {
  const isMotionActive = ref(false)
  const isOrientationActive = ref(false)

  const {
    acceleration,
    rotationRate: rotation,
  } = useDeviceMotion()

  const {
    alpha,
    beta,
    gamma
  } = useDeviceOrientation()

  const motion = computed(() => ({
    x: Math.abs(acceleration.value?.x || 0),
    y: Math.abs(acceleration.value?.y || 0),
    z: Math.abs(acceleration.value?.z || 0)
  }))

  const orientation = computed(() => ({
    alpha: alpha.value || 0,
    beta: beta.value || 0,
    gamma: gamma.value || 0
  }))

  const totalAcceleration = computed(() => {
    return Math.sqrt(
      Math.pow(motion.value.x, 2) +
      Math.pow(motion.value.y, 2) +
      Math.pow(motion.value.z, 2)
    )
  })

  const isDeviceFlat = computed(() => {
    return Math.abs(orientation.value.beta) < 5 && Math.abs(orientation.value.gamma) < 5
  })

  const deviceOrientation = computed(() => {
    if (orientation.value.beta > 45 && orientation.value.beta < 135) return 'portrait'
    if (orientation.value.beta < -45 && orientation.value.beta > -135) return 'portrait-upside-down'
    if (orientation.value.gamma > 45) return 'landscape-left'
    if (orientation.value.gamma < -45) return 'landscape-right'
    return 'flat'
  })

  function activateMotion() {
    if (isMotionActive.value) return Promise.resolve()

    return requestPermission('DeviceMotionEvent')
      .then(granted => {
        if (granted) {
          isMotionActive.value = true
        } else {
          console.warn('Motion events are not supported or permission denied')
        }
      })
      .catch(error => {
        console.error('Error activating motion sensor:', error)
      })
  }

  function activateOrientation() {
    if (isOrientationActive.value) return Promise.resolve()

    return requestPermission('DeviceOrientationEvent')
      .then(granted => {
        if (granted) {
          isOrientationActive.value = true
        } else {
          console.warn('Orientation events are not supported or permission denied')
        }
      })
      .catch(error => {
        console.error('Error activating orientation sensor:', error)
      })
  }

  function deactivateMotion() {
    isMotionActive.value = false
  }

  function deactivateOrientation() {
    isOrientationActive.value = false
  }

  return {
    motion,
    orientation,
    isMotionActive,
    isOrientationActive,
    activateMotion,
    activateOrientation,
    deactivateMotion,
    deactivateOrientation,
    totalAcceleration,
    isDeviceFlat,
    deviceOrientation,
    rotation
  }
}