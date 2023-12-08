import { computed, ref } from 'vue'
import type { Route, ContentData } from 'vitepress'

export function usePages(route: Route, routes: ContentData[]) {

  const rs = ref(routes)

  const pages = computed(() => getPages(rs.value))
  const children = computed(() => pages.value[cleanLink(route.path)])
  const parents = computed(() => getParents(route.path, rs.value))
  const siblings = computed(() => getSiblings(route.path, rs.value))

  return { pages, siblings, children, parents }
}

export function useChildren(route: Route, routes: ContentData[]) {
  return computed(() => getPages(routes)[cleanLink(route.path)])
}

export function useParents(route: Route, routes: ContentData[]) {
  return computed(() => getParents(route.path, routes))
}

export function useSiblings(route: Route, routes: ContentData[]) {
  return computed(() => getSiblings(route.path, routes))
}

export function usePage(route: Route, routes: ContentData[]) {
  return computed(() => getPage(route.path, routes))
}


export function getPage(path: string, routes: ContentData[]) {
  return routes.find((p) => {
    return cleanLink(p.url) == cleanLink(path)
  });
}

export function getPages(routes: ContentData[]) {
  let pageList: Record<string, ContentData[]> = {}
  for (let route of routes) {
    const folder = normalize(route.url.split("/").slice(0, -2).join("/"))
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


export function getParents(path: string, routes: ContentData[]) {
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


export function getSiblings(path: string, routes: ContentData[]) {
  let prev: ContentData, next: ContentData, index: number, total: number
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


export function normalize(url: string) {
  return (url += url.endsWith("/") ? "" : "/");
}

export function cleanLink(url: string) {
  return (url || '').replace(/\/[^/]*\.(html)$/, '/')
}

export function webP(file: string) {
  return (file || '').replace(/\.[^.]+$/, '.webp')
}