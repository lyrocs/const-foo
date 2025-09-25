import { navbar } from "vuepress-theme-hope";

export const esNavbar = navbar([
  "/es/",
  "/es/portfolio",
  "/es/demo/",
  {
    text: "Guide",
    icon: "lightbulb",
    prefix: "/es/guide/",
    children: [
      {
        text: "Bar",
        icon: "lightbulb",
        prefix: "bar/",
        children: ["baz", { text: "...", icon: "ellipsis", link: "" }],
      },
      {
        text: "Foo",
        icon: "lightbulb",
        prefix: "foo/",
        children: ["ray", { text: "...", icon: "ellipsis", link: "" }],
      },
    ],
  },
  {
    text: "V2 Docs",
    icon: "book",
    link: "https://theme-hope.vuejs.press/es/",
  },
]);
