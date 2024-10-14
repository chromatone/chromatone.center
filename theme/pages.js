import { computed, ref } from 'vue'

export function usePages(route, routes) {

  const rs = ref(routes)

  const pages = computed(() => getPages(rs.value))
  const children = computed(() => pages.value[cleanLink(route.path)])
  const parents = computed(() => getParents(route.path, rs.value))
  const siblings = computed(() => getSiblings(route.path, rs.value))

  return { pages, siblings, children, parents }
}

export function useChildren(route, routes) {
  return computed(() => getPages(routes)[route.path])
}

export function useParents(route, routes) {
  return computed(() => getParents(route.path, routes))
}

export function useSiblings(route, routes) {
  return computed(() => getSiblings(route.path, routes))
}

export function usePage(route, routes) {
  return computed(() => getPage(route.path, routes))
}


export function getPage(path, routes) {
  return routes.find((p) => {
    return cleanLink(p.url) == cleanLink(path)
  });
}

export function getPages(routes) {
  let pageList = {}
  for (let route of routes) {
    const folder = normalize(route.url.split("/").slice(0, -2).join("/"))
    if (route.frontmatter?.hidden || route.url == '/') continue
    pageList[folder] = pageList[folder] || [];
    pageList[folder].push(route);
  }
  for (let folder in pageList) {
    pageList[folder].sort((a, b) => {
      if (a.frontmatter?.date && b.frontmatter?.date) {
        return a.frontmatter.date > b.frontmatter.date ? -1 : 1;
      } else {
        return 0;
      }
    });
  }
  return pageList;
}


export function getParents(path, routes) {
  path = cleanLink(path)
  const parents = [];
  const url = path.split("/").filter(Boolean);
  for (let i = 0; i <= url.length; i++) {
    const link = normalize("/" + url.slice(0, i).join("/"))
    parents.push(
      routes.find((r) => {
        return cleanLink(r.url) == link;
      })
    );
  }
  return parents.filter(Boolean);
}


export function getSiblings(path, routes) {
  let prev = null
  let next = null
  let index = 0
  let total = 0
  const folder = normalize(path.split("/").slice(0, -2).join("/"));
  const list = getPages(routes)[folder]

  if (list) {
    total = list.length
    index = list.findIndex((page) => cleanLink(page.url) == cleanLink(path));
    if (index >= 0 && index <= list.length) {
      next = list[index + 1];
    }
    if (index > 0) {
      prev = list[index - 1];
    }
  }
  return { next, prev, index, total }
}


export function normalize(url) {
  return (url += url.endsWith("/") ? "" : "/");
}

export function cleanLink(url) {
  return (url || '').replace(/\/[^/]*\.(html)$/, '/')
}

export function webP(file) {
  return (file || '').replace(/\.[^.]+$/, '.webp')
}