import { json, LoaderFunction } from "@netlify/remix-runtime";

import pkg from "../../package.json";

const manifest = {
  name: pkg.short_name,
  short_name: pkg.short_name,
  description: pkg.description,
  start_url: "/?utm_source=pwa",
  lang: "de",
  scope: "/",
  theme_color: pkg.color,
  background_color: "#f6f8f2",
  display_override: ["standalone", "minimal-ui", "browser"],
  display: "standalone",
  orientation: "portrait-primary",
  icons: [
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
  ],
  screenshots: [{
    src: "/screenshots/screenshot-index_wide.jpg",
    sizes: "800x600",
    type: "image/jpeg",
    form_factor: "wide",
    label: "Startseite",
  }, {
    src: "/screenshots/screenshot-index_narrow.jpg",
    sizes: "337x600",
    type: "image/jpeg",
    form_factor: "narrow",
    label: "Startseite",
  }, {
    src: "/screenshots/screenshot-mitspielen_wide.jpg",
    sizes: "800x600",
    type: "image/jpeg",
    form_factor: "wide",
    label: "Schätzspiel-Seite",
  }, {
    src: "/screenshots/screenshot-mitspielen_narrow.jpg",
    sizes: "337x600",
    type: "image/jpeg",
    form_factor: "narrow",
    label: "Schätzspiel-Seite",
  }],
};

export const loader: LoaderFunction = () => {
  return json(manifest);
};
