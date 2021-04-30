export function sortList(list) {
  if (!list && typeof list != 'array') {
    return
  }
  return [...list].sort((a, b) => {
    if (a.data?.order && b.data?.order) {
      let ord = a.data.order < b.data.order ? -1 : 1
      return ord
    }
    if (a?.lastModified > b?.lastModified) {
      return -1
    } else {
      return 1
    }
  })
}
