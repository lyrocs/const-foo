import { sidebar } from "vuepress-theme-hope";

export const esSidebar = sidebar({
  "/es/": [
    "",
    {
      text: "JavaScript",
      icon: "laptop-code",
      prefix: "js/",
      link: "js/",
      children: "structure",
    },
    {
      text: "TypeScript",
      icon: "laptop-code",
      prefix: "ts/",
      link: "ts/",
      children: "structure",
    },
    {
      text: "Rust",
      icon: "laptop-code",
      prefix: "rust/",
      link: "rust/",
      children: "structure",
    }
  ],
});
