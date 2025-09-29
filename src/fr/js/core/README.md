---
title: Core concepts
date: 2025-09-25
index: true
icon: atom
breadcrumb: false
editLink: false
lastUpdated: false
prev: false
next: false
category:
  - JavaScript
---

Bienvenue sur cette collection d'articles qui démystifient les concepts clés de JavaScript. Pas de blabla, juste ce que tu dois savoir avec des exemples concrets.

---

## **Le Hoisting en JS**

Pourquoi ton code marche alors qu'il devrait pas ? Découvre comment JavaScript remonte tes déclarations en haut du scope avant même d'exécuter ton code. Tu comprendras enfin pourquoi `var` fait n'importe quoi et pourquoi les fonctions peuvent être appelées avant leur déclaration.

**Ce que tu vas apprendre :** Les différences entre `var`, `let` et `const`, la Temporal Dead Zone, le shadowing, et comment éviter les pièges classiques du hoisting.

[Lire l'article →](./hoisting.md)

---

## **Les Closures en JavaScript**

La magie du scope capturé. Les closures, c'est quand une fonction se souvient des variables de son environnement même après que ce dernier ait disparu. Un concept puissant qui te permet de créer des variables privées, des factory functions et bien plus.

**Ce que tu vas apprendre :** Le scope lexical, l'encapsulation de données, les pièges dans les boucles, la memoization, et comment éviter les memory leaks.

[Lire l'article →](./closure.md)

---

## **L'Event Loop en JS**

Arrête de faire semblant de comprendre pourquoi ton `console.log` s'affiche dans le désordre. L'event loop, c'est le moteur qui permet à JavaScript d'être asynchrone alors qu'il n'a qu'un seul thread. Comprends la différence entre la Call Stack, la Task Queue et les Microtasks.

**Ce que tu vas apprendre :** Comment fonctionne la concurrence en JS, pourquoi les promesses ont la priorité, les pièges avec `setTimeout(0)`, et le vrai comportement d'async/await.

[Lire l'article →](./event-loop.md)

---

## **Les Modules ES Natifs**

Organise ton code comme un pro avec le système de modules natif de JavaScript. Fini le temps où tout était dans le scope global ou les bidouilles avec CommonJS. Les ES Modules sont le standard universel qui fonctionne partout : navigateur et Node.js.

**Ce que tu vas apprendre :** Export/import nommés et par défaut, les imports dynamiques, le tree shaking, les import maps, et comment structurer proprement tes projets.

[Lire l'article →](./es-native.md)

---

## À propos

Ces articles adoptent un ton direct et accessible, avec un maximum d'exemples de code. L'objectif : que tu comprennes vraiment les concepts, pas juste que tu les survoles. Chaque article peut être lu indépendamment, alors commence par celui qui t'intéresse le plus.

Happy coding! 🚀
