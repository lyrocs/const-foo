# L'héritage prototypal

Tu as déjà entendu parler d'héritage en programmation ? En JavaScript, on fait les choses différemment du reste du monde. Pas de classes traditionnelles (enfin, pas vraiment), mais un système basé sur des **prototypes**. C'est comme si chaque objet avait un "parent spirituel" qui lui transmet ses pouvoirs.

## Le prototype, c'est quoi exactement ?

Imagine que chaque objet JavaScript porte une **carte d'identité secrète** qui pointe vers un autre objet. Cette carte, c'est le `__proto__` (ou plus proprement `Object.getPrototypeOf()`). Quand tu demandes quelque chose à un objet qu'il n'a pas, il va voir son prototype pour lui demander.

```javascript
const animal = {
  respire: true,
  mange: function () {
    console.log("Miam miam !");
  },
};

const chien = {
  aboie: true,
};

// On lie chien à animal via le prototype
Object.setPrototypeOf(chien, animal);

console.log(chien.respire); // true - hérité d'animal
chien.mange(); // "Miam miam !" - méthode héritée
```

## La chaîne prototypale : une histoire de famille

C'est là que ça devient intéressant. Si ton objet ne trouve pas ce qu'il cherche chez son prototype direct, il va voir le prototype du prototype, et ainsi de suite. C'est comme remonter un arbre généalogique jusqu'à trouver l'ancêtre qui a la réponse.

```javascript
const mammifere = {
  sangChaud: true,
  type: "mammifère",
};

const animal = {
  respire: true,
  mange: function () {
    console.log("Miam !");
  },
};

const chien = {
  aboie: true,
};

// Construction de la chaîne
Object.setPrototypeOf(animal, mammifere);
Object.setPrototypeOf(chien, animal);

console.log(chien.sangChaud); // true - vient de mammifere
console.log(chien.respire); // true - vient d'animal
console.log(chien.aboie); // true - propriété propre
```

## Object.create() : la méthode propre

Au lieu de bricoler avec `setPrototypeOf`, tu peux utiliser `Object.create()` qui fait ça proprement dès la création :

```javascript
const vehicule = {
  demarrer() {
    console.log("Vrooom !");
  },
  vitesseMax: 0,
};

const voiture = Object.create(vehicule);
voiture.vitesseMax = 180;
voiture.nbPortes = 4;

voiture.demarrer(); // "Vrooom !" - hérité
console.log(voiture.vitesseMax); // 180 - redéfini
```

## Les fonctions constructeurs : l'ancienne école

Avant ES6, on utilisait des fonctions constructeurs avec `new`. Chaque fonction a une propriété `prototype` qui devient le prototype des objets créés :

```javascript
function Animal(nom) {
  this.nom = nom;
}

Animal.prototype.manger = function () {
  console.log(`${this.nom} mange`);
};

function Chien(nom, race) {
  Animal.call(this, nom); // Super constructor
  this.race = race;
}

// Héritage prototypal
Chien.prototype = Object.create(Animal.prototype);
Chien.prototype.constructor = Chien;

Chien.prototype.aboyer = function () {
  console.log(`${this.nom} aboie !`);
};

const rex = new Chien("Rex", "Berger");
rex.manger(); // "Rex mange" - hérité d'Animal
rex.aboyer(); // "Rex aboie !" - méthode de Chien
```

## Classes ES6 : du sucre syntaxique

Les classes ES6, c'est juste une **façade plus jolie** sur le même système prototypal :

```javascript
class Animal {
  constructor(nom) {
    this.nom = nom;
  }

  manger() {
    console.log(`${this.nom} mange`);
  }
}

class Chien extends Animal {
  constructor(nom, race) {
    super(nom);
    this.race = race;
  }

  aboyer() {
    console.log(`${this.nom} aboie !`);
  }
}

const rex = new Chien("Rex", "Berger");
// Même résultat qu'avant, syntaxe plus claire
```

## hasOwnProperty() vs in : connaître ses affaires

Pour savoir si une propriété appartient vraiment à ton objet ou si elle vient d'un prototype :

```javascript
const chien = { nom: "Rex" };
const animal = { respire: true };
Object.setPrototypeOf(chien, animal);

console.log("nom" in chien); // true
console.log("respire" in chien); // true (hérité)

console.log(chien.hasOwnProperty("nom")); // true
console.log(chien.hasOwnProperty("respire")); // false (hérité)
```

## Le piège du prototype partagé

**Attention !** Si tu modifies le prototype, ça affecte tous les objets qui l'utilisent :

```javascript
function Chat(nom) {
  this.nom = nom;
}

Chat.prototype.jouets = []; // Erreur classique !

const felix = new Chat("Felix");
const garfield = new Chat("Garfield");

felix.jouets.push("souris");
console.log(garfield.jouets); // ["souris"] - Oops !

// Solution : initialiser dans le constructeur
function ChatCorrige(nom) {
  this.nom = nom;
  this.jouets = []; // Chaque chat a ses propres jouets
}
```

## Performance et optimisations

Le moteur JavaScript optimise la recherche dans la chaîne prototypale, mais plus elle est longue, plus c'est lent. **Garde tes chaînes courtes** et évite de modifier les prototypes après création quand c'est possible.

```javascript
// Rapide - propriété propre
console.log(objet.maPropriete);

// Plus lent - remonte la chaîne
console.log(objet.proprieteHeritee);
```

## En résumé

L'héritage prototypal, c'est comme un **système de délégation** où chaque objet peut demander de l'aide à ses "parents". C'est plus flexible que l'héritage classique mais demande de comprendre cette logique de chaîne.

> **Règle d'or** : Un objet JavaScript, c'est ses propriétés + tout ce qu'il peut emprunter à ses prototypes.

Maintenant tu sais pourquoi JavaScript est si unique. Pas de classes "vraies", juste des objets qui se passent le relais !
