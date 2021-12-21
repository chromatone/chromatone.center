const isProd = process.env.NODE_ENV === "production";

const site = isProd ? "https://www.chromatone.center" : "http://localhost:3000";

export const metaData = {
  title: "Chromatone",
  description: "Universal color music notation and communication",
  site,
  locale: "en",
  icon: "/media/logo/holologo.svg",
  image: "/media/logo/cardtw.png",
  author: "davay",
  twitter: "https://twitter.com/defucc",
  tags: "color, music, stickers, posters, theory, webapp, science",
};
