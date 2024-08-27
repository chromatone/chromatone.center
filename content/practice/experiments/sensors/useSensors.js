// useSensors.js
import { ref, onUnmounted } from 'vue'

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
const isMobile = /Mobi|Android/i.test(navigator.userAgent)

function requestPermission(type) {
  if (isIOS && typeof DeviceMotionEvent.requestPermission === 'function') {
    return DeviceMotionEvent.requestPermission().then(state => state === 'granted')
  }
  if (isMobile) {
    // On mobile, we'll assume permission is granted if the API is available
    return Promise.resolve(type in window)
  }
  // On desktop, we'll just resolve true as permissions are typically not required
  return Promise.resolve(true)
}

export function useSensors() {
  const motion = ref({ x: 0, y: 0, z: 0 })
  const orientation = ref({ alpha: 0, beta: 0, gamma: 0 })
  const isMotionActive = ref(false)
  const isOrientationActive = ref(false)

  let motionHandler, orientationHandler

  function handleMotion(event) {
    const acc = event.accelerationIncludingGravity || event.acceleration
    if (acc) {
      motion.value = {
        x: Math.abs(acc.x || 0),
        y: Math.abs(acc.y || 0),
        z: Math.abs(acc.z || 0)
      }
    }
  }

  function handleOrientation(event) {
    orientation.value = {
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0
    }
  }

  function activateMotion() {
    if (isMotionActive.value) return Promise.resolve()

    return requestPermission('DeviceMotionEvent')
      .then(granted => {
        if (granted) {
          motionHandler = handleMotion
          window.addEventListener('devicemotion', motionHandler)
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
          orientationHandler = handleOrientation
          window.addEventListener('deviceorientation', orientationHandler)
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
    if (motionHandler) {
      window.removeEventListener('devicemotion', motionHandler)
      isMotionActive.value = false
    }
  }

  function deactivateOrientation() {
    if (orientationHandler) {
      window.removeEventListener('deviceorientation', orientationHandler)
      isOrientationActive.value = false
    }
  }

  onUnmounted(() => {
    deactivateMotion()
    deactivateOrientation()
  })

  return {
    motion,
    orientation,
    isMotionActive,
    isOrientationActive,
    activateMotion,
    activateOrientation,
    deactivateMotion,
    deactivateOrientation
  }
}