---
# This is the title of the article
title: Closure
# This is the icon of the page
# icon: atom
# This control sidebar order
order: 1
# Set author
author: Lyrocs
# Set writing time
date: 2025-09-25
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

## Qu'est-ce qu'une 'closure' (fermeture) en JavaScript ?

Une closure (ou fermeture en français) est une fonction qui se souvient de l'environnement dans lequel elle a été créée. Cela signifie qu'une fonction interne a toujours accès aux variables et aux paramètres de sa fonction externe, même après que la fonction externe a terminé son exécution.

En d'autres termes, une closure est la combinaison d'une fonction et de l'environnement lexical dans lequel cette fonction a été déclarée.

### Exemple

Voici un exemple classique pour illustrer le concept de closure :

```javascript
function creerCompteur() {
  let compteur = 0;

  return function () {
    compteur += 1;
    return compteur;
  };
}

const compteur1 = creerCompteur();

console.log(compteur1()); // Affiche 1
console.log(compteur1()); // Affiche 2
console.log(compteur1()); // Affiche 3

// Chaque appel à creerCompteur() crée une nouvelle closure avec son propre compteur.
const compteur2 = creerCompteur();
console.log(compteur2()); // Affiche 1
console.log(compteur2()); // Affiche 2
```

### Explication de l'exemple

1.  La fonction `creerCompteur` est appelée et initialise une variable locale `compteur` à `0`.
2.  Elle retourne une nouvelle fonction (une fonction anonyme). C'est cette fonction interne qui est une closure.
3.  Lorsque `creerCompteur()` a fini de s'exécuter, on pourrait s'attendre à ce que la variable `compteur` soit détruite (car elle est hors de portée).
4.  Cependant, la fonction interne "se souvient" de son environnement de création. Elle conserve une référence à la variable `compteur` de sa fonction parente.
5.  Ainsi, chaque fois que nous appelons `compteur1()`, la fonction interne peut accéder et modifier la variable `compteur`.

Chaque appel à `creerCompteur` crée un nouvel environnement d'exécution et une nouvelle closure. C'est pourquoi `compteur1` et `compteur2` ont des états indépendants.
