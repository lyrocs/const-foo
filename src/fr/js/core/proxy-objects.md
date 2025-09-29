# Les objets Proxy

Tu veux **intercepter** tout ce qui se passe avec un objet ? Savoir quand on y accède, le modifie, ou même quand on essaie de le supprimer ? Les `Proxy` sont tes nouveaux meilleurs amis. C'est comme mettre un **garde du corps invisible** autour de tes objets.

## Le concept : un intercepteur universel

Un `Proxy` c'est un **wrapper transparent** autour d'un objet qui te permet d'intercepter et de redéfinir les opérations fondamentales (lecture, écriture, énumération, etc.). Tu peux littéralement prendre le contrôle total de comment ton objet se comporte.

```javascript
const target = { nom: "Jean", age: 25 };

const handler = {
  get(obj, prop) {
    console.log(`On lit la propriété ${prop}`);
    return obj[prop];
  },
  set(obj, prop, value) {
    console.log(`On définit ${prop} = ${value}`);
    obj[prop] = value;
    return true;
  },
};

const proxy = new Proxy(target, handler);

proxy.nom; // "On lit la propriété nom"
proxy.age = 30; // "On définit age = 30"
```

## La syntaxe : target et handler

```javascript
const proxy = new Proxy(target, handler);
```

- **target** : L'objet original que tu veux "surveiller"
- **handler** : Un objet qui définit quelles opérations sont interceptées et comment elles sont redéfinies

Le handler c'est ton **tableau de bord** avec tous les boutons pour contrôler ce qui se passe.

## Les traps : tous tes pouvoirs d'interception

### get : Intercepter la lecture

```javascript
const user = { nom: "Paul" };

const spyUser = new Proxy(user, {
  get(target, prop) {
    if (prop === "secret") {
      return "🤫 Accès refusé !";
    }
    return target[prop]?.toUpperCase() || "Propriété inconnue";
  },
});

console.log(spyUser.nom); // "PAUL"
console.log(spyUser.secret); // "🤫 Accès refusé !"
console.log(spyUser.inexistant); // "Propriété inconnue"
```

### set : Contrôler l'écriture

```javascript
const product = {};

const validatedProduct = new Proxy(product, {
  set(target, prop, value) {
    if (prop === "price" && value < 0) {
      throw new Error("Le prix ne peut pas être négatif !");
    }
    if (prop === "name" && typeof value !== "string") {
      throw new Error("Le nom doit être une chaîne !");
    }

    target[prop] = value;
    console.log(`✅ ${prop} défini à ${value}`);
    return true;
  },
});

validatedProduct.name = "Laptop"; // ✅ name défini à Laptop
validatedProduct.price = 999; // ✅ price défini à 999
// validatedProduct.price = -100; // Error: Le prix ne peut pas être négatif !
```

### has : Contrôler l'opérateur 'in'

```javascript
const secretBox = { public: "visible", _secret: "caché" };

const filteredBox = new Proxy(secretBox, {
  has(target, prop) {
    // Masquer les propriétés qui commencent par _
    if (prop.startsWith("_")) {
      return false;
    }
    return prop in target;
  },
});

console.log("public" in filteredBox); // true
console.log("_secret" in filteredBox); // false (masqué!)
console.log(filteredBox._secret); // "caché" (accessible direct)
```

### deleteProperty : Protéger contre la suppression

```javascript
const protectedObj = { important: "data", temp: "delete me" };

const guardian = new Proxy(protectedObj, {
  deleteProperty(target, prop) {
    if (prop === "important") {
      console.log("🛡️ Propriété protégée !");
      return false; // Suppression refusée
    }
    delete target[prop];
    console.log(`🗑️ ${prop} supprimé`);
    return true;
  },
});

delete guardian.temp; // 🗑️ temp supprimé
delete guardian.important; // 🛡️ Propriété protégée !
```

## Cas pratiques : où les Proxy brillent

### 1. Validation automatique d'objet

```javascript
function createValidatedUser() {
  const user = {};

  return new Proxy(user, {
    set(target, prop, value) {
      const validators = {
        email: (v) => v.includes("@"),
        age: (v) => v >= 0 && v <= 150,
        name: (v) => typeof v === "string" && v.length > 0,
      };

      if (validators[prop] && !validators[prop](value)) {
        throw new Error(`Valeur invalide pour ${prop}: ${value}`);
      }

      target[prop] = value;
      return true;
    },
  });
}

const user = createValidatedUser();
user.name = "Alice"; // ✅
user.age = 25; // ✅
user.email = "alice@email.com"; // ✅
// user.age = -5; // ❌ Error: Valeur invalide pour age: -5
```

### 2. Propriétés dynamiques et calculées

```javascript
const math = new Proxy(
  {},
  {
    get(target, prop) {
      // Propriétés calculées à la volée
      if (prop.startsWith("square_")) {
        const num = parseInt(prop.split("_")[1]);
        return num * num;
      }
      if (prop.startsWith("double_")) {
        const num = parseInt(prop.split("_")[1]);
        return num * 2;
      }
      return target[prop];
    },
  }
);

console.log(math.square_5); // 25
console.log(math.double_10); // 20
console.log(math.square_7); // 49
```

### 3. Array avec indices négatifs (comme Python)

```javascript
function createArray(arr) {
  return new Proxy(arr, {
    get(target, prop) {
      // Indices négatifs
      if (typeof prop === "string" && /^-\d+$/.test(prop)) {
        const index = target.length + parseInt(prop);
        return target[index];
      }
      return target[prop];
    },
  });
}

const myArray = createArray(["a", "b", "c", "d"]);
console.log(myArray[-1]); // "d" (dernier élément)
console.log(myArray[-2]); // "c" (avant-dernier)
```

### 4. Objet avec propriétés case-insensitive

```javascript
function createCaseInsensitiveObj(obj = {}) {
  return new Proxy(obj, {
    get(target, prop) {
      // Chercher la propriété sans tenir compte de la casse
      const key = Object.keys(target).find(
        (k) => k.toLowerCase() === prop.toLowerCase()
      );
      return target[key];
    },
    set(target, prop, value) {
      // Toujours stocker en minuscules
      target[prop.toLowerCase()] = value;
      return true;
    },
  });
}

const config = createCaseInsensitiveObj();
config.DATABASE_URL = "mongodb://...";
console.log(config.database_url); // "mongodb://..."
console.log(config.Database_Url); // "mongodb://..."
```

## Les pièges avancés : plus de contrôle

### apply : Intercepter les appels de fonction

```javascript
function greet(name) {
  return `Salut ${name} !`;
}

const loggedGreet = new Proxy(greet, {
  apply(target, thisArg, argumentsList) {
    console.log(`Appel avec les arguments: ${argumentsList}`);
    const result = target.apply(thisArg, argumentsList);
    console.log(`Résultat: ${result}`);
    return result;
  },
});

loggedGreet("Alice");
// Appel avec les arguments: Alice
// Résultat: Salut Alice !
```

### construct : Intercepter le 'new'

```javascript
class User {
  constructor(name) {
    this.name = name;
  }
}

const TrackedUser = new Proxy(User, {
  construct(target, args) {
    console.log(`Création d'un nouvel utilisateur: ${args[0]}`);
    const instance = new target(...args);
    instance.createdAt = new Date();
    return instance;
  },
});

const user = new TrackedUser("Bob");
// Création d'un nouvel utilisateur: Bob
console.log(user.createdAt); // Date actuelle
```

## Performance et limitations

Les Proxy sont **puissants mais pas gratuits**. Chaque interception a un coût :

```javascript
// Performance normale
const obj = { a: 1 };
const start = performance.now();
for (let i = 0; i < 1000000; i++) {
  obj.a;
}
console.log(`Direct: ${performance.now() - start}ms`);

// Avec Proxy
const proxied = new Proxy(obj, {
  get(target, prop) {
    return target[prop];
  },
});
const start2 = performance.now();
for (let i = 0; i < 1000000; i++) {
  proxied.a;
}
console.log(`Proxy: ${performance.now() - start2}ms`);
```

## Révocabilité : le bouton d'arrêt d'urgence

Tu peux créer un Proxy **révocable** que tu peux désactiver :

```javascript
const { proxy, revoke } = Proxy.revocable(
  { data: "secret" },
  {
    get(target, prop) {
      console.log(`Accès à ${prop}`);
      return target[prop];
    },
  }
);

console.log(proxy.data); // "Accès à data" puis "secret"

revoke(); // On "tue" le proxy

// console.log(proxy.data); // TypeError: Cannot perform 'get' on a proxy that has been revoked
```

## En résumé

Les Proxy c'est comme avoir un **couteau suisse** pour contrôler tes objets :

- **Validation** automatique des données
- **Propriétés virtuelles** calculées à la volée
- **Logs** transparents de tous les accès
- **Comportements custom** impossibles autrement

> **Règle d'or** : Utilise les Proxy quand tu veux changer la _façon_ dont un objet se comporte, pas juste ce qu'il contient.

C'est l'outil ultime pour créer des **API magiques** où les objets font exactement ce que tu veux, quand tu veux !
