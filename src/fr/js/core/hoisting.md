# Hoisting

T'as déjà appelé une fonction **avant** de la déclarer et ça marche ? Ou utilisé une variable avant de la définir et tout plante ? Bienvenue dans le délire du **hoisting**.

## C'est quoi cette sorcellerie ?

Le hoisting, littéralement "hisser" en anglais, c'est quand JavaScript **remonte** tes déclarations en haut du scope avant d'exécuter ton code. Imagine que JS lit ton code deux fois :

**Première lecture** : "Ok, je note toutes les déclarations que je vois"  
**Deuxième lecture** : "Maintenant j'exécute le code"

C'est comme si tu préparais une recette en sortant tous les ingrédients **avant** de commencer à cuisiner. Sauf que JavaScript fait ça tout seul, dans ton dos.

## Les fonctions : le mode VIP

Les **fonctions classiques** sont entièrement remontées. Tu peux les appeler n'importe où.

```javascript
manger(); // ✅ Ça marche !

function manger() {
  console.log("Je bouffe un burger");
}
```

JavaScript voit ton code comme ça :

```javascript
function manger() {
  console.log("Je bouffe un burger");
}

manger(); // Logique maintenant
```

Pratique, mais attention aux **function expressions** :

```javascript
boire(); // ❌ TypeError: boire is not a function

var boire = function () {
  console.log("Une bière fraîche");
};
```

Pourquoi ? Parce que seule la **déclaration** de `var boire` est remontée, pas l'assignation.

```javascript
var boire; // Hoisted, mais vaut undefined

boire(); // undefined n'est pas une fonction, boom

boire = function () {
  console.log("Une bière fraîche");
};
```

## Var : le bordel organisé

Avec `var`, la déclaration est remontée mais l'**initialisation reste en place**.

```javascript
console.log(age); // undefined (pas d'erreur !)
var age = 25;
console.log(age); // 25
```

Ce que JS comprend :

```javascript
var age; // Déclaration remontée
console.log(age); // undefined
age = 25; // Initialisation
console.log(age); // 25
```

C'est comme si tu réservais une place au resto, mais t'arrives pour commander plus tard. La place existe (undefined), elle est juste vide.

## Let et Const : la Temporal Dead Zone

Avec `let` et `const`, c'est **différent**. Techniquement ils sont aussi hoisted, mais dans une zone où tu peux pas y toucher : la **Temporal Dead Zone** (TDZ).

```javascript
console.log(nom); // ❌ ReferenceError: Cannot access 'nom' before initialization
let nom = "Bob";
```

La TDZ c'est la période entre le début du scope et la ligne où tu déclares ta variable. Pendant ce temps, la variable existe dans les limbes mais t'y as pas accès.

```javascript
{
  // TDZ commence ici ☠️
  console.log(prenom); // ReferenceError
  // TDZ continue...
  let prenom = "Alice"; // TDZ se termine ici ✨
  console.log(prenom); // 'Alice'
}
```

C'est volontaire. Les créateurs de ES6 voulaient éviter le bordel du `var` où tu pouvais utiliser une variable avant de la déclarer.

## Le piège vicieux

```javascript
var x = 10;

function test() {
  console.log(x); // undefined ??
  var x = 20;
}

test();
```

Tu pensais voir `10` ? **Nope.** Tu vois `undefined`.

Pourquoi ? Parce que le `var x` **à l'intérieur de la fonction** est remonté en haut du scope de la fonction. Ça masque le `x` global.

```javascript
var x = 10;

function test() {
  var x; // Hoisted ici
  console.log(x); // undefined
  x = 20;
}
```

C'est le **shadowing** : la variable locale cache la globale.

## Classes : pareil que let

Les classes aussi ont une TDZ :

```javascript
const chat = new Animal(); // ❌ ReferenceError

class Animal {
  constructor() {
    console.log("Miaou");
  }
}
```

Contrairement aux fonctions classiques, les classes doivent être déclarées **avant** d'être utilisées. Pas de passe-droit.

## Import : toujours en premier

Les `import` sont **automatiquement remontés** tout en haut du fichier, peu importe où tu les mets.

```javascript
console.log(addition(2, 3)); // ✅ Ça marche

import { addition } from "./utils.js";
```

C'est pour ça que les imports sont **toujours exécutés en premier**, même si tu les fous en bas du fichier. JavaScript les remonte au sommet.

## Le conseil

> **Déclare toujours tes variables en haut du scope.** Ça évite les surprises et rend ton code lisible.

Utilise `const` par défaut, `let` si t'as besoin de réassigner, et **oublie `var`**. Sérieux, c'est 2025, lâche le `var`.

```javascript
// ✅ Propre
const MAX_USERS = 100;
let count = 0;

function increment() {
  count++;
}

// ❌ Le chaos
increment();

var count = 0;

function increment() {
  count++;
}
```

Le hoisting c'est pas une feature que tu dois utiliser, c'est un **comportement à comprendre** pour éviter les bugs chelous. Maintenant t'es armé. 💪
