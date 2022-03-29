import { metaData } from "./config/constants.js";
import head from "./config/head.js";
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
        lang: "en-US",
        title: metaData.title,
        description: metaData.description,
      },
    },
    logo: "/media/logo/holologo.svg",
    icon: "/media/logo/icon.svg",
    repo: "https://github.com/chromatone/chromatone.center",
  },
  markdown: {
    config: (md) => {
      md.use(mdLinks, {
        internalDomains: ["localhost", "chromatone.center"],
      });
    },
  },
};
