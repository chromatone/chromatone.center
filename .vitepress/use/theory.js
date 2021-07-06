import { ChordType } from '@tonaljs/tonal'

ChordType.add(['1P', '2m'], ['2m'], 'minor second')
ChordType.add(['1P', '2M'], ['2M'], 'major second')
ChordType.add(['1P', '3m'], ['3m'], 'minor third')
ChordType.add(['1P', '3M'], ['3M'], 'major third')
ChordType.add(['1P', '4P'], ['4P'], 'perfect fourth')
ChordType.add(['1P', '5d'], ['TT'], 'tritone')

ChordType.add(['1P', '5P'], ['5P'], 'perfect fifth')
ChordType.add(['1P', '6m'], ['6m'], 'minor sixth')
ChordType.add(['1P', '6M'], ['6M'], 'major sixth')
ChordType.add(['1P', '7m'], ['7m'], 'minor seventh')
ChordType.add(['1P', '7M'], ['7M'], 'major seventh')

export default ChordType.all()

export function getCursorPositionInRect(event, svgElement, rect) {
  var svgPoint = svgElement.createSVGPoint()
  svgPoint.x = event.clientX
  svgPoint.y = event.clientY
  let correct = svgPoint.matrixTransform(svgElement.getScreenCTM().inverse())
  let bounds = rect.getBBox()
  mouse.x =
    correct.x < bounds.width ? (correct.x < 0 ? 0 : correct.x) : bounds.width
  mouse.y =
    correct.y < bounds.height ? (correct.y < 0 ? 0 : correct.y) : bounds.height
  mouse.normY = 1 - mouse.y / bounds.height
  mouse.normX = mouse.x / bounds.width
}
