# Event loop

T'as déjà eu ce moment bizarre où tu te demandes pourquoi ton `console.log` s'affiche dans le mauvais ordre ? Ou pourquoi ton code asynchrone fait n'importe quoi ? Bienvenue dans le monde merveilleux de l'**event loop**.

## C'est quoi ce bordel ?

Imagine que JavaScript c'est un **restaurant avec un seul serveur**. Ouais, un seul. Pas de backup, pas d'équipe. Ce serveur doit prendre les commandes, les apporter en cuisine, ramener les plats... tout ça **un truc à la fois**.

C'est ça JavaScript : **single-threaded**. Une seule file d'exécution. Mais alors comment il gère plusieurs trucs en même temps ? Spoiler : il gère pas vraiment.

## La stack, la queue et le loop

Trois concepts que tu vas kiffer :

**La Call Stack** c'est ta liste de tâches immédiates. Tout ce qui doit être exécuté _maintenant_. C'est une pile (LIFO pour les intimes) : le dernier arrivé, premier servi.

```javascript
function a() {
  console.log("A");
  b();
}

function b() {
  console.log("B");
}

a();
// Stack: a() → b() → console.log → ...
```

**La Task Queue** (ou callback queue), c'est la liste d'attente des trucs asynchrones. Genre les `setTimeout`, les événements DOM, les promesses... Ils patientent là, sagement.

**L'Event Loop**, c'est le videur du club. Son boulot ? Checker en permanence : "La stack est vide ? Cool, je prends le prochain dans la queue."

## Un exemple qui fait mal

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

console.log("3");
```

Tu t'attends à `1, 2, 3` ? **Nope.** Tu vas avoir `1, 3, 2`.

Pourquoi ? Parce que même avec un délai de `0ms`, le `setTimeout` va dans la **Task Queue**. L'event loop va d'abord finir tout ce qui est dans la stack (le `console.log('3')`), et _ensuite_ il ira chercher le callback du setTimeout.

## Les Microtasks : le coupe-file VIP

Les promesses, c'est pas n'importe qui. Elles ont leur propre queue : la **Microtask Queue**. Et cette queue a la **priorité absolue** sur la Task Queue.

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```

Résultat : `1, 4, 3, 2`

Le flow :

1. Stack vide ? Non, on exécute tout le code synchrone → `1`, `4`
2. Stack vide ! Event loop check les _microtasks_ d'abord → `3`
3. Microtasks vides ? Ok, on passe aux _tasks_ → `2`

La promesse **coupe la queue** du setTimeout. C'est le passe VIP du club.

## Un piège classique dans une boucle

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}
```

Tu penses voir `0, 1, 2` ? Tu vas avoir `3, 3, 3`.

Pourquoi ? Parce que `var` n'a pas de scope de bloc. Quand les setTimeout s'exécutent (après la boucle), `i` vaut déjà `3`.

La fix avec `let` :

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}
// 0, 1, 2 ✨
```

Chaque itération crée un nouveau scope avec `let`. Problème réglé.

## Async/Await : le sucre syntaxique

```javascript
async function fetch() {
  console.log("1");

  const result = await Promise.resolve("2");
  console.log(result);

  console.log("3");
}

console.log("0");
fetch();
console.log("4");
```

Output : `0, 1, 4, 2, 3`

Le `await` met la fonction en pause. Tout ce qui est **après** le `await` devient une microtask. C'est comme si tu avais fait un `.then()`.

## Le truc à retenir

L'event loop, c'est pas sorcier :

> **Stack vide ?** → Check les microtasks → Check les tasks → Repeat

JavaScript fait semblant d'être asynchrone, mais en vrai il fait juste **très bien la queue** au Pôle Emploi. Un seul guichet, mais une organisation militaire.

Maintenant t'as plus d'excuse pour tes bugs de timing. Go coder. 🚀
