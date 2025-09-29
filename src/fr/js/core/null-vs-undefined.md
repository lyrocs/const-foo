# null vs undefined

Tu t'es déjà arraché les cheveux sur ces deux-là ? `null` et `undefined`, les **jumeaux diaboliques** de JavaScript qui ont l'air de faire la même chose mais qui en réalité sont comme le jour et la nuit. Laisse-moi t'expliquer leur différence une bonne fois pour toutes.

## undefined : "Je n'existe pas (encore)"

`undefined` c'est JavaScript qui te dit : **"Euh... je sais pas ce que c'est"**. C'est l'absence naturelle, quand quelque chose n'a jamais été défini ou initialisé.

```javascript
let truc; // Déclaré mais pas initialisé
console.log(truc); // undefined

const obj = {};
console.log(obj.proprieteInexistante); // undefined

function maFonction(param) {
  console.log(param); // undefined si pas passé
}
maFonction(); // pas de paramètre = undefined
```

## null : "Je suis vide... volontairement"

`null` c'est toi qui dis : **"Cette variable existe, mais je veux qu'elle soit vide"**. C'est un vide intentionnel, une absence programmée.

```javascript
let utilisateur = null; // Volontairement vide
let reponseAPI = null; // En attente de réponse

// Tu peux "vider" une variable
let data = { nom: "Jean" };
data = null; // Je la vide explicitement
```

## La différence philosophique

Pense à ça comme à deux types de **cases vides** :

- **undefined** = Case qui n'a jamais eu d'étiquette
- **null** = Case avec une étiquette "VIDE" écrite dessus

```javascript
// undefined : JavaScript découvre une variable sans valeur
let mystere; // "Qu'est-ce que c'est que ça ?"

// null : Tu déclares explicitement du vide
let intentionVide = null; // "Cette case est vide par choix"
```

## Dans les types : le piège classique

Voici un des **pièges les plus vicieux** de JavaScript :

```javascript
console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object" <- WTF ?!

// Mais attention aux comparaisons
console.log(undefined == null); // true (conversion)
console.log(undefined === null); // false (types différents)
```

Oui, `typeof null` renvoie `"object"`. C'est un **bug historique** de JavaScript qui ne sera jamais corrigé pour ne pas casser l'internet.

## Cas pratiques : quand utiliser quoi ?

### undefined : Les situations naturelles

```javascript
// Variables non initialisées
let compteur; // undefined naturellement

// Propriétés inexistantes
const user = { nom: "Paul" };
console.log(user.age); // undefined

// Paramètres manquants
function saluer(nom, prenom) {
  if (prenom === undefined) {
    return `Salut ${nom} !`;
  }
  return `Salut ${prenom} ${nom} !`;
}

// Fonctions sans return
function procedureVide() {
  console.log("Je fais un truc");
  // return undefined implicite
}
```

### null : Les intentions claires

```javascript
// État initial volontaire
let selectedItem = null; // Rien de sélectionné pour l'instant

// API qui peut ne rien retourner
function trouverUtilisateur(id) {
  const user = database.find(id);
  return user || null; // null si pas trouvé
}

// "Reset" d'une référence
let cache = { data: "important" };
cache = null; // Je libère la mémoire
```

## JSON et les deux compères

En **JSON**, seul `null` existe. `undefined` disparaît complètement :

```javascript
const obj = {
  a: null,
  b: undefined,
  c: "normal",
};

console.log(JSON.stringify(obj));
// {"a":null,"c":"normal"} <- 'b' a disparu !

// En parsant du JSON
JSON.parse('{"valeur": null}'); // { valeur: null }
// undefined n'existe pas en JSON
```

## Vérifications : comment bien les détecter

```javascript
// Vérifier undefined
if (variable === undefined) {
  /* ... */
}
if (typeof variable === "undefined") {
  /* plus sûr */
}

// Vérifier null
if (variable === null) {
  /* ... */
}

// Vérifier les deux (vide en général)
if (variable == null) {
  /* null OU undefined */
}
if (variable == undefined) {
  /* pareil */
}

// Vérifier qu'il y a quelque chose
if (variable != null) {
  /* ni null ni undefined */
}
```

## L'opérateur nullish : la solution moderne

ES2020 nous a donné l'**opérateur nullish** `??` qui ne réagit qu'à `null` et `undefined` :

```javascript
const config = {
  timeout: 0, // Valeur valide !
  retries: null,
};

// Problème avec ||
console.log(config.timeout || 5000); // 5000 (mauvais!)
console.log(config.retries || 3); // 3

// Solution avec ??
console.log(config.timeout ?? 5000); // 0 (correct!)
console.log(config.retries ?? 3); // 3
console.log(config.inexistant ?? "default"); // "default"
```

## Bonnes pratiques : qui utiliser quand ?

### Utilise undefined pour :

- Les valeurs par défaut de paramètres
- Quand tu ne veux pas initialiser une variable
- Les propriétés optionnelles

```javascript
function creerUser(nom, age = undefined) {
  return {
    nom,
    ...(age !== undefined && { age }), // Propriété conditionnelle
  };
}
```

### Utilise null pour :

- Représenter "aucune valeur" intentionnellement
- Reset d'objets/références
- APIs qui peuvent ne rien retourner

```javascript
// État d'une app
const state = {
  currentUser: null, // Personne connecté
  selectedFile: null, // Rien sélectionné
  error: null, // Pas d'erreur
};
```

## Le piège des destructurations

```javascript
// Undefined permet les valeurs par défaut
const { nom = "Anonyme" } = {}; // "Anonyme"
const { age = 25 } = { age: undefined }; // 25

// Null ne déclenche PAS les défauts
const { score = 100 } = { score: null }; // null (pas 100!)
```

## En résumé

**undefined** = "JavaScript ne sait pas"
**null** = "Tu as dit explicitement vide"

> **Règle simple** : Laisse JavaScript gérer `undefined`, utilise `null` quand tu veux dire "vide par choix".

La vraie différence, c'est l'**intention**. `undefined` c'est l'absence accidentelle, `null` c'est l'absence volontaire. Une fois que tu comprends ça, tu ne les confondras plus jamais !
