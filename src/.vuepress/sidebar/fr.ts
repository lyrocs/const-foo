import { sidebar } from "vuepress-theme-hope";

export const frSidebar = sidebar({
  "/fr/": [
    "",
    // "portfolio",
    // {
    //   text: "Demo",
    //   icon: "laptop-code",
    //   prefix: "demo/",
    //   link: "demo/",
    //   children: "structure",
    // },
    {
      text: "JavaScript",
      icon: "laptop-code",
      prefix: "js/",
      link: "js/",
      children: "structure",
    },
    {
      text: "TypeScript",
      icon: "at",
      prefix: "ts/",
      link: "ts/",
      children: "structure",
    },
    {
      text: "Rust",
      icon: "rupee-sign",
      prefix: "rust/",
      link: "rust/",
      children: "structure",
    },
    {
      text: "Tools",
      icon: "toolbox",
      prefix: "tools/",
      link: "tools/",
      children: "structure",
    }
  ],
});
