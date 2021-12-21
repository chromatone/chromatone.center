import { metaData } from "./config/constants.js";
import head from "./config/head.js";
import { nav, sidebar, pages, ru_nav, ru_sidebar } from "./config/nav.js";
import mdLinks from "markdown-it-external-links";

export default {
  title: metaData.title,
  description: metaData.description,
  lang: metaData.locale,
  head,
  locales: {
    "/": {
      lang: "en-US",
      title: metaData.title,
      description: metaData.description,
    },
  },
  themeConfig: {
    locales: {
      "/": {
        label: "English",
        selectText: "En",
        nav,
        sidebar,
        lang: "en-US",
        title: metaData.title,
        description: metaData.description,
      },
    },
    logo: "/media/logo/holologo.svg",
    icon: "media/logo/icon.svg",
    repo: "https://github.com/chromatone/chromatone.center",
    pages,
    nav,
    sidebar,
  },
  markdown: {
    config: (md) => {
      md.use(mdLinks, {
        internalDomains: ["localhost", "chromatone.center"],
      });
    },
  },
};
