// src/browser.ts
var pages;
function getPages(routes) {
  if (pages)
    return pages;
  pages = {};
  for (let route of routes) {
    if (route.path == "/")
      continue;
    const split = route.path.split("/").slice(0, -2).join("/");
    const folder = normalize(split);
    pages[folder] = pages[folder] || [];
    pages[folder].push(route);
  }
  for (let folder in pages) {
    pages[folder].sort((a, b) => {
      if (a?.date && b?.date) {
        return a.date > b.date ? -1 : 1;
      } else {
        return 0;
      }
    });
  }
  return pages;
}
function getPage(path, routes) {
  return routes.find((p) => normalize(p.path) == path);
}
function getSiblings(path, routes) {
  let prev, next, index, total;
  const folder = normalize(path.split("/").slice(0, -2).join("/"));
  const pages2 = getPages(routes);
  const list = pages2[folder];
  if (list) {
    total = list.length;
    index = list.findIndex((page) => normalize(page.path) == path);
    if (index >= 0 && index <= list.length) {
      next = list[index + 1];
    }
    if (index > 0) {
      prev = list[index - 1];
    }
  }
  return { prev, next, index, total };
}
function getParents(path, routes) {
  const parents = [];
  const url = path.split("/").filter(Boolean);
  for (let i in url) {
    const link = "/" + url.slice(0, -i).join("/") + "/";
    parents.push(
      routes.find((r) => {
        return r.path == link;
      })
    );
  }
  return parents.filter(Boolean).reverse();
}
function normalize(url) {
  return url += url.endsWith("/") ? "" : "/";
}
export {
  getPage,
  getPages,
  getParents,
  getSiblings,
  normalize,
  pages
};
//# sourceMappingURL=browser.js.map