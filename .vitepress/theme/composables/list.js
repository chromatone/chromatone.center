export function sortList(list) {
  if (!list && typeof list != 'array') {
    return
  }
  return [...list].sort((a, b) => {
    if (a?.data && b?.date) {
      return a.date > b.date ? -1 : 1
    }
    if (a?.lastModified > b?.lastModified) {
      return -1
    } else {
      return 1
    }
  })
}
