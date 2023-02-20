// src/index.ts
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import sharp from "sharp";

// src/browser.ts
function normalize(url2) {
  return url2 += url2.endsWith("/") ? "" : "/";
}

// src/index.ts
import * as url from "url";
function extendRoutes({
  root = url.fileURLToPath(new URL("..", import.meta.url)),
  publicFolder = "public",
  graymatter = {
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->"
  },
  mediaFolder = "media_files",
  mediaTypes = {
    icon: { width: 300, height: 300, fit: "inside" },
    cover: { size: 1200, height: 800, fit: "inside" }
  }
} = {}) {
  function extendRoute(route) {
    const pageDir = path.resolve(root, route.component.substring(1));
    const frontmatter = matter.read(pageDir, graymatter);
    const { data, excerpt, content } = frontmatter;
    const { name, path: routePath, component } = route;
    const page = {
      ...route,
      name,
      path: normalize(routePath),
      component,
      ...data,
      excerpt,
      empty: !content,
      content: ""
    };
    if (data.type == "block") {
      page.content = content;
    }
    for (let media in mediaTypes) {
      if (data[media]) {
        let file = data[media];
        const filePath = path.join(route.path, file);
        const fileName = filePath.split("/").filter(Boolean).join("-");
        const publicPath = path.resolve(root, publicFolder, mediaFolder, media);
        const fullPath = path.join(publicPath, fileName);
        const url2 = path.join("/", mediaFolder, media, fileName);
        page[media] = url2;
        if (fs.existsSync(fullPath)) {
          continue;
        }
        if (!fs.existsSync(path.dirname(fullPath))) {
          fs.mkdirSync(
            path.dirname(fullPath),
            { recursive: true }
          );
        }
        if (filePath.endsWith(".svg")) {
          fs.copyFileSync(
            path.resolve(root, filePath.substring(1)),
            fullPath
          );
        } else {
          sharp(path.resolve(root, filePath.substring(1))).resize({
            width: media == "icon" ? 300 : 1200,
            height: media == "icon" ? 300 : 1200,
            fit: "inside"
          }).toFile(fullPath, (err, info) => {
            if (err) {
              console.log(err, filePath, info);
            }
          });
        }
      }
    }
    return page;
  }
  return { extendRoute };
}
export {
  extendRoutes
};
//# sourceMappingURL=index.js.map