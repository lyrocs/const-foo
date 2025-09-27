---
# This is the title of the article
title: Modules ES Natifs
# This is the icon of the page
# icon: atom
# This control sidebar order
order: 5
# Set author
author: Lyrocs
# Set writing time
date: 2025-09-27
# A page can have multiple categories
category:
  - JavaScript
# A page can have multiple tags
tag:
  - JavaScript
  - Guide
# this page is sticky in article list
sticky: true
# this page will appear in starred articles
star: true
comment: false
# You can customize footer content
footer: Footer content for test
# You can customize copyright content
copyright: No Copyright
---

# Modules ES Natifs : Comment JavaScript a Appris à s'Organiser Sans Bundler

Pendant des années, organiser son code JavaScript pour le web était complexe. On utilisait des solutions comme CommonJS (pour Node.js) ou AMD, puis on "compilait" tout avec des outils comme Webpack ou Rollup. Mais aujourd'hui, les navigateurs comprennent nativement un système de modules officiel : les **Modules ES** (ou ESM).

---

## Qu'est-ce qu'un Module ES Natif ?

Un module ES natif est simplement un **fichier JavaScript qui peut importer ou exporter des fonctionnalités** (variables, fonctions, classes) vers ou depuis d'autres fichiers JavaScript, directement dans le navigateur, sans avoir besoin d'un outil de build en phase de développement.

C'est le standard officiel du langage JavaScript (depuis l'ES6/ES2015) pour organiser le code en morceaux réutilisables.

---

## Comment ça fonctionne ?

La magie opère grâce à deux éléments clés : la syntaxe `import`/`export` et un attribut spécial dans la balise `<script>`.

### 1. La Syntaxe `export` et `import`

- **`export`** : Ce mot-clé permet de rendre des parties de votre code accessibles depuis d'autres fichiers.

  **`utils.js`**

  ```javascript
  // On exporte une constante
  export const PI = 3.14;

  // On exporte une fonction
  export function add(a, b) {
    return a + b;
  }
  ```

- **`import`** : Ce mot-clé permet de récupérer les fonctionnalités exportées par un autre module.

  **`main.js`**

  ```javascript
  // On importe spécifiquement ce dont on a besoin depuis utils.js
  import { PI, add } from "./utils.js";

  console.log("La valeur de PI est :", PI);
  console.log("5 + 3 =", add(5, 3));
  ```

### 2. La Balise `<script type="module">`

Pour que le navigateur traite un fichier JavaScript comme un module (et comprenne donc `import`/`export`), vous devez l'inclure dans votre HTML avec l'attribut `type="module"`.

**`index.html`**

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <title>Modules ES Natifs</title>
  </head>
  <body>
    <h1>Regardez la console !</h1>

    <script type="module" src="main.js"></script>
  </body>
</html>
```

Lorsque le navigateur charge cette page, il voit type="module", lit main.js, voit que ce dernier a besoin de utils.js, et va automatiquement charger ce deuxième fichier.

## Caractéristiques Importantes des Modules

Portée (Scope) isolée : Chaque module a sa propre portée. Les variables déclarées dans un module ne sont pas accessibles globalement, ce qui évite les conflits.

Mode Strict par défaut : Tout le code à l'intérieur d'un module s'exécute automatiquement en "use strict", ce qui active des règles de codage plus propres et plus sûres.

Chargement unique : Un module n'est chargé et exécuté qu'une seule fois, même s'il est importé par plusieurs autres modules.

## Conclusion : L'Impact sur l'Outillage Moderne

Les modules ES natifs sont la technologie qui a rendu possible des outils comme Vite. En s'appuyant sur la capacité du navigateur à gérer lui-même le graphe de dépendances en développement, Vite peut offrir un serveur de développement quasi instantané, car il n'a plus besoin de "bundler" tout le code avant de pouvoir afficher la page. C'est une véritable révolution pour l'expérience de développement web.
