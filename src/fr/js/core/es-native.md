# Modules ES Natifs

Les modules ES (ECMAScript Modules), c'est le système de modules natif de JavaScript. Avant ça, tu avais CommonJS avec Node.js, AMD pour le navigateur, ou pire : tout mettre dans le scope global comme un sauvage. Maintenant, tu as un **standard universel** qui fonctionne partout.

## Import et Export : les bases

Un module, c'est juste un fichier JavaScript qui exporte des trucs. Tu peux exporter des fonctions, des variables, des classes... tout ce que tu veux.

**Export nommé** : tu exportes plusieurs éléments

```javascript
// math.js
export const PI = 3.14159;

export function addition(a, b) {
  return a + b;
}

export function multiplication(a, b) {
  return a * b;
}
```

**Import nommé** : tu choisis ce que tu veux

```javascript
// app.js
import { addition, PI } from "./math.js";

console.log(addition(2, 3)); // 5
console.log(PI); // 3.14159
```

Tu peux aussi tout importer d'un coup avec un **namespace** :

```javascript
import * as Math from "./math.js";

console.log(Math.addition(2, 3)); // 5
console.log(Math.PI); // 3.14159
```

## Export par défaut : un seul élément vedette

Parfois, ton module exporte **un seul truc principal**. C'est là qu'intervient l'export par défaut.

```javascript
// User.js
export default class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Salut, je suis ${this.name}`;
  }
}
```

L'import devient plus simple :

```javascript
import User from "./User.js";

const bob = new User("Bob");
console.log(bob.greet());
```

Remarque : **pas d'accolades** pour l'import par défaut. Et tu peux le renommer comme tu veux :

```javascript
import Utilisateur from "./User.js"; // Même chose
```

## Mixer les deux : nommé + défaut

Tu peux combiner export par défaut et exports nommés dans le même fichier.

```javascript
// api.js
export default function fetchData(url) {
  return fetch(url).then((r) => r.json());
}

export const API_URL = "https://api.example.com";
export const TIMEOUT = 5000;
```

Import :

```javascript
import fetchData, { API_URL, TIMEOUT } from "./api.js";

fetchData(API_URL);
```

L'export par défaut vient **toujours en premier**, sans accolades. Les exports nommés suivent, entre accolades.

## Renommer à l'import et l'export

Tu peux donner des alias avec `as` :

```javascript
// utils.js
function calculerTVA(prix) {
  return prix * 1.2;
}

export { calculerTVA as calculateVAT };
```

```javascript
import { calculateVAT as tva } from "./utils.js";

console.log(tva(100)); // 120
```

Pratique quand tu veux éviter les conflits de noms.

## Re-exporter : le barrel pattern

Imagine que tu as plein de fichiers séparés, mais tu veux les exposer via un seul point d'entrée. C'est le **barrel pattern**.

```javascript
// components/Button.js
export default function Button() { /* ... */ }

// components/Input.js
export default function Input() { /* ... */ }

// components/Card.js
export default function Card() { /* ... */ }
```

Tu crées un fichier `index.js` qui re-exporte tout :

```javascript
// components/index.js
export { default as Button } from "./Button.js";
export { default as Input } from "./Input.js";
export { default as Card } from "./Card.js";
```

Maintenant, tu peux importer depuis un seul endroit :

```javascript
import { Button, Input, Card } from "./components/index.js";
```

Beaucoup plus propre. Tu peux aussi utiliser la syntaxe raccourcie :

```javascript
// components/index.js
export * from "./Button.js";
export * from "./Input.js";
```

## Imports dynamiques : charge à la demande

Les imports statiques sont évalués **avant** l'exécution du code. Mais parfois, tu veux charger un module **conditionnellement** ou **à la demande**.

```javascript
async function loadModule() {
  if (userWantsFeature) {
    const module = await import("./heavyFeature.js");
    module.init();
  }
}
```

L'`import()` dynamique retourne une **Promise**. C'est parfait pour le code splitting et améliorer les performances.

Exemple avec un routeur :

```javascript
async function navigateTo(page) {
  let component;

  switch (page) {
    case "home":
      component = await import("./pages/Home.js");
      break;
    case "profile":
      component = await import("./pages/Profile.js");
      break;
  }

  component.default.render();
}
```

## Side effects : import sans rien récupérer

Parfois, tu veux juste **exécuter** un fichier sans importer quoi que ce soit.

```javascript
// polyfills.js
Array.prototype.last = function () {
  return this[this.length - 1];
};
```

```javascript
// app.js
import "./polyfills.js"; // Juste pour exécuter le code

const arr = [1, 2, 3];
console.log(arr.last()); // 3
```

C'est utile pour les polyfills, les styles CSS, ou tout code d'initialisation.

## Top-level await : attendre au niveau module

Depuis ES2022, tu peux utiliser `await` **directement au niveau du module**, sans fonction async.

```javascript
// config.js
const response = await fetch("/api/config");
export const config = await response.json();
```

```javascript
// app.js
import { config } from "./config.js";

console.log(config); // Déjà résolu
```

Attention : ça peut bloquer l'exécution des autres modules qui dépendent de celui-ci. Utilise ça intelligemment.

## Modules dans le navigateur

Pour utiliser les modules ES dans le navigateur, tu dois ajouter `type="module"` :

```html
<script type="module" src="app.js"></script>
```

Ou inline :

```html
<script type="module">
  import { greet } from "./utils.js";
  greet();
</script>
```

Les modules dans le navigateur ont quelques particularités :

- Ils sont **toujours en strict mode**
- Ils sont **defer par défaut** (exécutés après le parsing du HTML)
- Ils ont leur **propre scope** (pas de pollution du global)
- Le **CORS** s'applique pour les imports cross-origin

## Import maps : mapper les modules

Les import maps te permettent de contrôler la résolution des modules dans le navigateur.

```html
<script type="importmap">
  {
    "imports": {
      "lodash": "https://cdn.skypack.dev/lodash",
      "react": "/node_modules/react/index.js",
      "@/utils": "./src/utils/index.js"
    }
  }
</script>

<script type="module">
  import _ from "lodash"; // Résolu via l'import map
  import { helper } from "@/utils"; // Alias
</script>
```

C'est comme un système de mapping qui dit au navigateur où trouver chaque module.

## CommonJS vs ES Modules

Les différences principales :

**CommonJS** (Node.js traditionnel) :

```javascript
// Export
module.exports = { foo: "bar" };

// Import
const myModule = require("./myModule");
```

**ES Modules** :

```javascript
// Export
export const foo = "bar";

// Import
import { foo } from "./myModule.js";
```

Les ES Modules sont **asynchrones** et **statiques** (analysés avant l'exécution). CommonJS est **synchrone** et **dynamique**. Dans Node.js moderne, tu peux utiliser les deux, mais il faut spécifier `"type": "module"` dans ton `package.json` pour utiliser les ES Modules.

## Tree shaking : éliminer le code mort

L'un des gros avantages des ES Modules, c'est le **tree shaking**. Les bundlers comme Webpack ou Rollup peuvent analyser tes imports et **supprimer le code non utilisé**.

```javascript
// utils.js
export function used() {
  return "utilisé";
}
export function unused() {
  return "jamais appelé";
}
```

```javascript
// app.js
import { used } from "./utils.js";

console.log(used());
```

Le bundler va voir que `unused` n'est jamais importé et va le **supprimer du bundle final**. Ça réduit la taille de ton code en production.

Ça marche parce que les imports ES sont **statiques** : on peut analyser le graphe de dépendances sans exécuter le code.

## Circular dependencies : attention danger

Les dépendances circulaires, c'est quand deux modules s'importent mutuellement.

```javascript
// a.js
import { b } from "./b.js";
export const a = "A";
console.log(b);
```

```javascript
// b.js
import { a } from "./a.js";
export const b = "B";
console.log(a);
```

Ça peut fonctionner dans certains cas grâce au hoisting des exports, mais c'est **risqué**. Tu peux te retrouver avec des valeurs `undefined` si l'ordre d'initialisation est mauvais.

La solution : **restructurer ton code** pour éviter ces dépendances. Souvent, ça signifie créer un troisième module qui contient la logique partagée.

## Résumé rapide

Les modules ES natifs te donnent :

- **Export nommé** pour plusieurs exports : `export { foo, bar }`
- **Export par défaut** pour un export principal : `export default MyClass`
- **Import statique** : analysé avant l'exécution, optimisable
- **Import dynamique** : `import()` retourne une Promise, parfait pour le lazy loading
- **Tree shaking** : élimine le code mort automatiquement
- **Standard universel** : fonctionne dans Node.js et le navigateur

Les modules, c'est la base d'une architecture propre. Découpe ton code en morceaux réutilisables, maintiens des responsabilités claires, et ton projet restera maintenable même quand il grossit.
