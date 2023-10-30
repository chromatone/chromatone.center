import { reactive, toRaw, ref } from 'vue'


export function useSVGFile(file) {
  const anchor = ref('')

  const download = reactive({
    file: file,
    url: ''
  })

  function saveSVG(pic, deep) {

    let svg = document.getElementById(pic);
    if (deep) svg = svg.childNodes[0]
    if (!svg) return
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    download.url = url
    download.file = toRaw(file)

    setTimeout(() => {
      anchor.value.click()
    }, 100);
  }

  return {
    download, anchor, saveSVG
  }
}

