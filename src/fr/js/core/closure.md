# Closures

Les closures, c'est probablement l'un des concepts les plus puissants de JavaScript. Si tu comprends bien comment elles fonctionnent, tu débloques un niveau supérieur dans ton code. Si tu comprends pas, tu vas te retrouver avec des bugs incompréhensibles.

## Qu'est-ce qu'une closure ?

Une closure, c'est quand une fonction **se souvient** des variables de son scope parent, même après que ce scope parent ait fini de s'exécuter.

Pense à ça comme une **bulle mémoire** : la fonction emporte avec elle un snapshot de son environnement de création.

```javascript
function createCounter() {
  let count = 0; // Variable privée

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

Regarde bien : la fonction retournée **accède toujours à `count`**, même après que `createCounter()` ait terminé son exécution. La variable `count` est "capturée" dans la closure.

## Le scope lexical : la base de tout

Pour comprendre les closures, il faut comprendre le **scope lexical**. En JavaScript, une fonction a accès aux variables de son scope et de tous les scopes parents.

```javascript
const global = "je suis global";

function outer() {
  const outerVar = "je suis dans outer";

  function inner() {
    const innerVar = "je suis dans inner";
    console.log(innerVar); // ✅ Accessible
    console.log(outerVar); // ✅ Accessible
    console.log(global); // ✅ Accessible
  }

  inner();
}

outer();
```

Le scope est déterminé **à l'écriture du code**, pas à l'exécution. C'est pour ça qu'on dit "lexical" : ça dépend de l'emplacement dans le code source.

## Créer des variables privées

Les closures te permettent de créer de véritables **variables privées** en JavaScript, quelque chose qu'on ne peut pas faire autrement avant les classes avec des champs privés.

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Privée, inaccessible de l'extérieur

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },

    withdraw(amount) {
      if (amount > balance) {
        throw new Error("Fonds insuffisants");
      }
      balance -= amount;
      return balance;
    },

    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount(1000);
console.log(account.getBalance()); // 1000
account.deposit(500); // 1500
account.withdraw(200); // 1300

console.log(account.balance); // undefined - impossible d'accéder directement
```

La variable `balance` est complètement **encapsulée**. Tu ne peux la modifier qu'à travers les méthodes exposées. C'est le pattern **Module** dans toute sa splendeur.

## Closures dans les boucles : le piège classique

Tu te souviens de ce problème avec les boucles et `setTimeout` ?

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
// Affiche : 3, 3, 3
```

Pourquoi `3` trois fois ? Parce que `var` n'a pas de scope de bloc, et les trois callbacks **partagent la même variable `i`**. Quand ils s'exécutent, la boucle est terminée et `i` vaut `3`.

La solution avec une closure :

```javascript
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 1000);
  })(i);
}
// Affiche : 0, 1, 2
```

Ici, on crée une **IIFE** (Immediately Invoked Function Expression) qui capture la valeur actuelle de `i` dans le paramètre `j`. Chaque itération crée une nouvelle closure avec sa propre copie de `j`.

Ou plus simplement, utilise `let` qui crée un nouveau scope à chaque itération :

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
// Affiche : 0, 1, 2
```

## Factory functions : générer des fonctions à la demande

Les closures sont parfaites pour créer des **factory functions** qui produisent des fonctions personnalisées.

```javascript
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

Chaque fonction retournée a capturé sa propre valeur de `factor`. Tu as créé des multiplicateurs spécialisés sans dupliquer de code.

Autre exemple avec un système de logging :

```javascript
function createLogger(prefix) {
  return function (message) {
    console.log(`[${prefix}] ${message}`);
  };
}

const errorLog = createLogger("ERROR");
const infoLog = createLogger("INFO");

errorLog("Quelque chose a planté"); // [ERROR] Quelque chose a planté
infoLog("Tout va bien"); // [INFO] Tout va bien
```

## Memoization : optimiser avec les closures

La memoization, c'est une technique d'optimisation qui consiste à **cacher les résultats** de fonctions coûteuses. Les closures sont parfaites pour ça.

```javascript
function memoize(fn) {
  const cache = {}; // Privé dans la closure

  return function (...args) {
    const key = JSON.stringify(args);

    if (key in cache) {
      console.log("Résultat en cache");
      return cache[key];
    }

    console.log("Calcul...");
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);

console.log(memoizedFib(10)); // Calcul...
console.log(memoizedFib(10)); // Résultat en cache
```

Le `cache` est capturé dans la closure et persiste entre les appels. Tu transformes une fonction coûteuse en une fonction avec cache, sans modifier la fonction originale.

## Callbacks et event handlers

Les closures sont omniprésentes dans les callbacks et les event handlers.

```javascript
function setupButton(buttonId, message) {
  const button = document.getElementById(buttonId);
  let clickCount = 0;

  button.addEventListener("click", function () {
    clickCount++;
    console.log(`${message} - Cliqué ${clickCount} fois`);
  });
}

setupButton("btn1", "Bouton 1");
setupButton("btn2", "Bouton 2");
```

Chaque event handler capture son propre `message` et `clickCount`. Les deux boutons ont des compteurs indépendants grâce aux closures.

## Currying : décomposer les fonctions

Le currying, c'est transformer une fonction avec plusieurs paramètres en une série de fonctions à un seul paramètre. Les closures rendent ça trivial.

```javascript
function add(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

console.log(add(1)(2)(3)); // 6

// Ou avec des arrow functions
const addArrow = (a) => (b) => (c) => a + b + c;
console.log(addArrow(1)(2)(3)); // 6
```

Chaque fonction capture le paramètre de la fonction parente. C'est particulièrement utile pour créer des fonctions partiellement appliquées :

```javascript
function multiply(a) {
  return function (b) {
    return a * b;
  };
}

const multiplyBy5 = multiply(5);
console.log(multiplyBy5(10)); // 50
console.log(multiplyBy5(20)); // 100
```

## Le piège de la référence partagée

Attention : les closures capturent des **références**, pas des valeurs.

```javascript
function createFunctions() {
  const functions = [];
  const obj = { value: 0 };

  for (let i = 0; i < 3; i++) {
    functions.push(function () {
      return obj.value;
    });
    obj.value++;
  }

  return functions;
}

const fns = createFunctions();
console.log(fns[0]()); // 3
console.log(fns[1]()); // 3
console.log(fns[2]()); // 3
```

Toutes les fonctions partagent la **même référence** à `obj`. Quand tu les appelles, `obj.value` vaut déjà `3`.

Si tu veux capturer la valeur actuelle, crée une copie :

```javascript
function createFunctions() {
  const functions = [];

  for (let i = 0; i < 3; i++) {
    const value = i; // Copie de la valeur
    functions.push(function () {
      return value;
    });
  }

  return functions;
}

const fns = createFunctions();
console.log(fns[0]()); // 0
console.log(fns[1]()); // 1
console.log(fns[2]()); // 2
```

## Memory leaks : le danger des closures

Les closures peuvent causer des **fuites mémoire** si tu fais pas attention. Les variables capturées ne sont jamais garbage collected tant que la closure existe.

```javascript
function attachHandler() {
  const largeData = new Array(1000000).fill("data");

  document.getElementById("button").addEventListener("click", function () {
    console.log("Clicked");
    // largeData reste en mémoire même si pas utilisé !
  });
}
```

Même si tu n'utilises pas `largeData` dans le handler, il reste en mémoire parce qu'il fait partie du scope de la closure. Solutions :

1. N'importe que ce dont tu as besoin :

```javascript
function attachHandler() {
  const largeData = new Array(1000000).fill("data");
  const needed = largeData[0]; // Juste ce qu'il faut

  document.getElementById("button").addEventListener("click", function () {
    console.log(needed);
  });
}
```

2. Nettoie les event listeners quand tu en as plus besoin :

```javascript
function setupTemporaryHandler() {
  const handler = function () {
    console.log("Clicked");
  };

  const button = document.getElementById("button");
  button.addEventListener("click", handler);

  // Plus tard...
  button.removeEventListener("click", handler);
}
```

## Closures vs Classes

Avec les classes ES6, tu peux te demander si les closures sont encore utiles. La réponse : **oui**.

Comparaison :

```javascript
// Avec closure
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}

// Avec classe
class Counter {
  #count = 0; // Champ privé

  increment() {
    return ++this.#count;
  }

  getCount() {
    return this.#count;
  }
}
```

Les deux approches ont leurs avantages. Les closures sont plus légères et fonctionnelles, les classes offrent plus de structure et d'héritage. Choisis selon ton besoin.

## Comprendre la chaîne de scope

Quand JavaScript cherche une variable, il remonte la **chaîne de scope** jusqu'à la trouver.

```javascript
const a = "global";

function outer() {
  const b = "outer";

  function middle() {
    const c = "middle";

    function inner() {
      const d = "inner";
      console.log(a, b, c, d); // Accède à tous
    }

    inner();
  }

  middle();
}

outer();
```

Chaque fonction a accès à son scope et à tous les scopes parents. La closure capture cette **chaîne complète**. Si `inner` est retournée, elle garde accès à `a`, `b`, et `c`.

## Résumé technique

Une closure, c'est :

- Une fonction qui **capture** son environnement lexical
- Un mécanisme pour créer des **données privées**
- La base des **callbacks**, **event handlers**, et **factory functions**
- Un outil puissant pour la **memoization** et l'**optimisation**
- Une source potentielle de **memory leaks** si mal utilisée

Les closures ne sont pas une feature exotique, elles sont au **cœur même** de JavaScript. Chaque fois que tu passes une callback à `map`, `filter`, ou `addEventListener`, tu utilises des closures. Maîtrise-les, et tu maîtrises JavaScript.
