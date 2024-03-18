/** @type {import('workbox-build').GenerateSWOptions} */
module.exports = {
  cacheId: "bingobaby",
  globDirectory: "public/",
  globPatterns: ["**/*.{png,xml,js,css,ico,svg,ttf,mp4,webm}"],
  swDest: "public/sw.js",
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};
