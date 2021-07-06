import { reactive, ref, onMounted } from 'vue'

export function useSvgMouse() {
  const svg = ref(null)
  const area = ref(null)

  const mouse = reactive({
    x: 0,
    y: 0,
    normX: 0,
    normY: 0,
  })

  onMounted(() => {
    svg.value.addEventListener('mousemove', getCursorPosition)
  })

  function getCursorPosition(event, svgElement = svg.value, rect = area.value) {
    var svgPoint = svgElement.createSVGPoint()
    svgPoint.x = event.clientX
    svgPoint.y = event.clientY
    let correct = svgPoint.matrixTransform(svgElement.getScreenCTM().inverse())
    if (rect) {
      let bounds = rect.getBBox()
      mouse.x =
        correct.x < bounds.width
          ? correct.x < 0
            ? 0
            : correct.x
          : bounds.width
      mouse.y =
        correct.y < bounds.height
          ? correct.y < 0
            ? 0
            : correct.y
          : bounds.height
      mouse.normY = 1 - mouse.y / bounds.height
      mouse.normX = mouse.x / bounds.width
    } else {
      mouse.x = correct.x
      mouse.y = correct.y
    }
  }

  return {
    svg,
    area,
    mouse,
  }
}
