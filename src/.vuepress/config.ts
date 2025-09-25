import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "fr-FR",
      title: "Const-foo",
      description: "A place to learn about JavaScript, TypeScript, and Rust, from core concepts to frameworks and tools used in web development.",
    },
    "/es/": {
      lang: "es-ES",
      title: "Const-foo",
      description: "A place to learn about JavaScript, TypeScript, and Rust, from core concepts to frameworks and tools used in web development.",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
