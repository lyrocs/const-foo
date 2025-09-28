---
# This is the title of the article
title: Event loop
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

# La Boucle d'Événements (Event Loop) : Le Secret de l'Asynchronisme en JavaScript

Le JavaScript est un langage **mono-thread**, ce qui signifie qu'il ne peut faire qu'une seule chose à la fois. Pourtant, il est capable de gérer des opérations longues (comme des appels réseau ou des minuteurs) sans jamais bloquer l'interface utilisateur. Comment est-ce possible ? Le secret réside dans un mécanisme appelé la **Boucle d'Événements (Event Loop)**.

---

## Le Principe : Ne Jamais Attendre

Pensez à un chef cuisinier 🧑‍🍳 dans une petite cuisine. Il ne peut faire qu'une seule tâche à la fois (hacher des légumes).

- **Approche synchrone (bloquante)** : S'il met un plat au four pour 30 minutes, il attend devant le four sans rien faire. Toute la cuisine est à l'arrêt.
- **Approche asynchrone (non-bloquante)** : Il met le plat au four, **lance un minuteur (une Web API)**, et continue de hacher d'autres légumes. Quand le minuteur sonne, il s'occupe du plat.

La Boucle d'Événements est le système qui permet au "chef" JavaScript de ne jamais attendre.

---

## Les 4 Acteurs Clés

Ce mécanisme repose sur quatre composants :

1.  **La Pile d'Appels (Call Stack)** : C'est là où les fonctions en cours d'exécution sont empilées. C'est la liste de tâches "à faire maintenant".
2.  **Les API du Navigateur (Web APIs)** : Ce sont des fonctionnalités fournies par le navigateur (et non par le moteur JS lui-même) pour gérer les opérations longues, comme `setTimeout`, `fetch` (pour les requêtes réseau), ou les écouteurs d'événements (`addEventListener`).
3.  **La File de Tâches (Task Queue ou Macrotask Queue)** : C'est une file d'attente où les callbacks des opérations terminées (comme la fonction de `setTimeout`) sont placés en attendant que la Pile d'Appels soit vide.
4.  **La File de Microtâches (Microtask Queue)** : Une file d'attente spéciale avec une **plus haute priorité** que la Task Queue. Elle est utilisée pour les callbacks des `Promises` (`.then()`, `.catch()`, `.finally()`) et `async/await`.

---

## Exemple de Code

Analysons ce code classique pour voir la Boucle d'Événements en action :

```javascript
console.log("A : Début du script"); // Synchrone

setTimeout(() => {
  console.log("C : Fin du minuteur"); // Asynchrone (Macrotask)
}, 0);

Promise.resolve().then(() => {
  console.log("D : Promesse résolue"); // Asynchrone (Microtask)
});

console.log("B : Fin du script"); // Synchrone
```

### L'Ordre d'Exécution

console.log('A') est ajouté à la Pile d'Appels et exécuté immédiatement.

Sortie : A : Début du script

setTimeout est ajouté à la Pile. Le navigateur le prend en charge (Web API) et lance son minuteur de 0 ms. La fonction setTimeout est retirée de la Pile.

Promise.resolve().then() est ajouté à la Pile. La promesse se résout immédiatement. Son callback (() => console.log('D')) est placé dans la File de Microtâches. La fonction est retirée de la Pile.

console.log('B') est ajouté à la Pile et exécuté.

Sortie : B : Fin du script

La Pile d'Appels est maintenant vide. La Boucle d'Événements regarde s'il y a des tâches à exécuter. Elle vérifie TOUJOURS la File de Microtâches en premier.

Le callback de la promesse est dans la File de Microtâches. Il est déplacé vers la Pile d'Appels et exécuté.

Sortie : D : Promesse résolue

La Pile est de nouveau vide. La File de Microtâches est vide. La Boucle d'Événements regarde maintenant la File de Tâches.

Le minuteur de setTimeout a terminé depuis longtemps. Son callback (() => console.log('C')) est dans la File de Tâches. Il est déplacé vers la Pile d'Appels et exécuté.

Sortie : C : Fin du minuteur

### Résultat Final dans la Console :

A : Début du script
B : Fin du script
D : Promesse résolue
C : Fin du minuteur

## Conclusion

La Boucle d'Événements est le cœur du modèle de concurrence de JavaScript. En orchestrant ces différentes files d'attente, elle permet à un seul thread de gérer de multiples opérations de manière efficace et non-bloquante, ce qui est essentiel pour des applications web fluides et réactives.
