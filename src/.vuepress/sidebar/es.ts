import { sidebar } from "vuepress-theme-hope";

export const esSidebar = sidebar({
  "/es/": [
    "",
    "portfolio",
    {
      text: "Demo",
      icon: "laptop-code",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "Docs",
      icon: "book",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "Slides",
      icon: "person-chalkboard",
      link: "https://ecosystem.vuejs.press/es/plugins/markdown/revealjs/demo.html",
    },
  ],
});
