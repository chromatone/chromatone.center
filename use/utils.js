export const mimeExtMap = {
  "video/webm": "webm",
  "video/webm;codecs=h264": "mp4",
  "video/x-matroska;codecs=avc1": "mkv"
}

export function getFilename(media, mimeType) {
  const d = new Date()

  const pad = v => `${v}`.padStart(2, "0")

  const date = `${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
    d.getHours()
  )}${pad(d.getMinutes())}`

  const ext = mimeType ? mimeExtMap[mimeType] : "webm"

  return `${[date, media, recordingName.value]
    .filter(el => !!el)
    .join("-")}.${ext}`
}