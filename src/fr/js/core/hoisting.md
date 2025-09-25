---
# This is the title of the article
title: Hoisting
# This is the icon of the page
# icon: atom
# This control sidebar order
order: 2
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

## Comment fonctionne le 'hoisting' (hissage) avec `let` et `const` ?

Le 'hoisting' (ou hissage) est un mécanisme de JavaScript où les déclarations de variables et de fonctions sont déplacées au sommet de leur portée (scope) avant l'exécution du code. Cependant, ce comportement diffère entre `var`, `let`, et `const`.

### Hoisting avec `var`

Avec `var`, seule la déclaration est hissée, pas l'initialisation. La variable est initialisée avec la valeur `undefined` par défaut.

```javascript
console.log(maVariable); // Affiche undefined
var maVariable = 5;
console.log(maVariable); // Affiche 5
```

Ici, la déclaration `var maVariable` est hissée au sommet, mais son assignation `= 5` ne l'est pas. Le code est interprété comme ceci :

```javascript
var maVariable;
console.log(maVariable); // undefined
maVariable = 5;
console.log(maVariable); // 5
```

### Hoisting avec `let` et `const`

Les variables déclarées avec `let` et `const` sont également hissées, mais elles ne sont pas initialisées. Elles entrent dans ce qu'on appelle la **Zone Morte Temporelle** (Temporal Dead Zone - TDZ).

Toute tentative d'accéder à une variable dans la TDZ avant sa déclaration résulte en une `ReferenceError`.

```javascript
// console.log(monLet); // Lève une ReferenceError: Cannot access 'monLet' before initialization

let monLet = 10;
console.log(monLet); // Affiche 10
```

La variable `monLet` est dans la TDZ depuis le début de sa portée (le scope du bloc) jusqu'à sa déclaration effective (`let monLet = 10;`).

Le même comportement s'applique à `const` :

```javascript
// console.log(maConst); // Lève une ReferenceError

const maConst = 20;
console.log(maConst); // Affiche 20
```

### Résumé

| Déclaration | Hissée ? | Initialisée à `undefined` ? | Comportement                                                          |
| :---------- | :------: | :-------------------------: | :-------------------------------------------------------------------- |
| `var`       |   Oui    |             Oui             | Accessible avant la déclaration, sa valeur est `undefined`.           |
| `let`       |   Oui    |             Non             | Non accessible avant la déclaration (TDZ), lève une `ReferenceError`. |
| `const`     |   Oui    |             Non             | Non accessible avant la déclaration (TDZ), lève une `ReferenceError`. |
