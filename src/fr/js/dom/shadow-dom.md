# Shadow DOM

Tu en as marre que tes styles CSS se bagarrent entre eux ? Que tes scripts interfèrent avec le reste de la page ? Le **Shadow DOM** c'est ta **bulle privée** dans le navigateur. Imagine pouvoir créer un petit univers parallèle où tes éléments vivent tranquillement, à l'abri du chaos extérieur.

## Le concept : ton propre petit monde

Le Shadow DOM te permet de créer un **DOM complètement isolé** à l'intérieur d'un élément. C'est comme avoir une maison avec des murs **insonorisés** : ce qui se passe dedans reste dedans, et ce qui se passe dehors n'entre pas.

```javascript
// Crée ton propre shadow root
const host = document.createElement("div");
const shadowRoot = host.attachShadow({ mode: "open" });

// À l'intérieur du shadow DOM
shadowRoot.innerHTML = `
  <style>
    p { color: red; font-size: 20px; }
  </style>
  <p>Je suis dans le shadow DOM !</p>
`;

document.body.appendChild(host);
```

Le style `color: red` ne s'appliquera **qu'au paragraphe** dans le shadow DOM, même si tu as d'autres `<p>` sur ta page !

## Anatomie : host, shadow root et shadow tree

```javascript
const host = document.createElement("my-component");
//     ↑ L'élément "hôte" visible dans le DOM principal

const shadowRoot = host.attachShadow({ mode: "open" });
//                  ↑ Le "shadow root" - point d'entrée de ton univers parallèle

shadowRoot.innerHTML = `
  <div class="container">
    <h2>Shadow content</h2>
  </div>
`;
// ↑ La "shadow tree" - ton DOM privé
```

## Les modes : open vs closed

### Mode 'open' : porte ouverte

```javascript
const openShadow = element.attachShadow({ mode: "open" });

// Accessible depuis l'extérieur
console.log(element.shadowRoot); // Retourne le shadowRoot
element.shadowRoot.querySelector("p"); // Fonctionne
```

### Mode 'closed' : bunker fermé

```javascript
const closedShadow = element.attachShadow({ mode: "closed" });

// Inaccessible depuis l'extérieur
console.log(element.shadowRoot); // null
// element.shadowRoot.querySelector('p'); // Error!

// Mais toi tu gardes la référence
closedShadow.querySelector("p"); // Fonctionne depuis l'intérieur
```

## Encapsulation CSS : la vraie magie

Le plus gros avantage, c'est l'**isolation CSS**. Tes styles ne fuient pas, et ceux de l'extérieur n'entrent pas :

```javascript
// Dans le document principal
document.head.innerHTML += `
  <style>
    p { color: blue; background: yellow; }
    .special { font-weight: bold; }
  </style>
`;

// Ton composant shadow
const myComponent = document.createElement("div");
const shadow = myComponent.attachShadow({ mode: "open" });

shadow.innerHTML = `
  <style>
    p { color: red; }
    .special { text-decoration: underline; }
  </style>
  <p class="special">Je suis rouge et souligné !</p>
`;

document.body.appendChild(myComponent);
```

Le paragraphe dans le shadow DOM sera **rouge et souligné**, pas bleu et sur fond jaune !

## Styliser depuis l'extérieur : les CSS custom properties

Tu ne peux pas styliser directement l'intérieur du shadow DOM, mais tu peux utiliser les **CSS custom properties** comme des "fenêtres" :

```javascript
const shadow = element.attachShadow({ mode: "open" });

shadow.innerHTML = `
  <style>
    .button {
      background: var(--button-bg, blue);
      color: var(--button-color, white);
      padding: var(--button-padding, 8px 16px);
    }
  </style>
  <button class="button">Click me</button>
`;

// Depuis l'extérieur, tu peux "passer" des valeurs
element.style.setProperty("--button-bg", "green");
element.style.setProperty("--button-color", "black");
```

## ::slotted() et les slots : les points d'entrée

Les **slots** te permettent d'injecter du contenu de l'extérieur dans ton shadow DOM :

```javascript
// Ton composant shadow
const shadow = element.attachShadow({ mode: "open" });
shadow.innerHTML = `
  <style>
    .container { border: 2px solid blue; padding: 10px; }
    ::slotted(h1) { color: red; }
    ::slotted(.highlight) { background: yellow; }
  </style>
  <div class="container">
    <slot name="title"></slot>
    <slot></slot> <!-- slot par défaut -->
  </div>
`;

// Dans le document principal
element.innerHTML = `
  <h1 slot="title">Mon titre</h1>
  <p class="highlight">Contenu principal</p>
  <span>Autre contenu</span>
`;
```

Le contenu "passe à travers" dans les slots, mais tu peux le styliser avec `::slotted()`.

## :host et :host() : styliser ton conteneur

```javascript
const shadow = element.attachShadow({ mode: "open" });

shadow.innerHTML = `
  <style>
    /* Style par défaut de l'hôte */
    :host {
      display: block;
      border: 1px solid gray;
    }

    /* Style conditionnel de l'hôte */
    :host(.active) {
      border-color: blue;
    }

    :host([disabled]) {
      opacity: 0.5;
    }
  </style>
  <p>Contenu du composant</p>
`;
```

## Composant custom réutilisable

Voici un exemple complet d'un composant réutilisable :

```javascript
class TooltipComponent extends HTMLElement {
  constructor() {
    super();

    // Crée le shadow DOM
    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host {
          position: relative;
          display: inline-block;
        }

        .tooltip {
          visibility: hidden;
          background: black;
          color: white;
          padding: 5px;
          border-radius: 4px;
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s;
        }

        :host(:hover) .tooltip {
          visibility: visible;
          opacity: 1;
        }
      </style>

      <slot></slot>
      <div class="tooltip">${this.getAttribute("text") || "Tooltip"}</div>
    `;
  }
}

// Enregistre le composant
customElements.define("my-tooltip", TooltipComponent);
```

Utilisation :

```html
<my-tooltip text="Ceci est une info utile"> Survole-moi ! </my-tooltip>
```

## Événements et Shadow DOM : la propagation

Les événements **traversent** la frontière du shadow DOM, mais leur `target` est ajusté :

```javascript
const shadow = element.attachShadow({ mode: "open" });
shadow.innerHTML = `<button>Click inside shadow</button>`;

// Écouteur dans le shadow DOM
shadow.querySelector("button").addEventListener("click", (e) => {
  console.log("Target dans shadow:", e.target); // <button>
  console.log("Composed path:", e.composedPath()); // Chemin complet
});

// Écouteur sur l'hôte
element.addEventListener("click", (e) => {
  console.log("Target sur host:", e.target); // element (pas le button!)
});
```

## Manipulation depuis JavaScript

```javascript
const shadow = element.attachShadow({ mode: "open" });
shadow.innerHTML = `<p id="content">Hello</p>`;

// querySelector fonctionne dans le shadow
const p = shadow.querySelector("#content");
p.textContent = "Hello Shadow!";

// Mais pas depuis l'extérieur
document.querySelector("#content"); // null (pas trouvé)
```

## Détection et support

```javascript
if ("attachShadow" in Element.prototype) {
  console.log("Shadow DOM supporté !");

  // Crée ton composant shadow
  createShadowComponent();
} else {
  console.log("Fallback pour les vieux navigateurs");

  // Version normale sans encapsulation
  createRegularComponent();
}
```

## Cas d'usage parfaits

### 1. Widgets tiers

```javascript
// Widget qui ne peut pas interférer avec le site host
class WeatherWidget extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "closed" });

    shadow.innerHTML = `
      <style>
        /* Tous tes styles sont sûrs ici */
        .weather { /* ... */ }
      </style>
      <div class="weather">
        <!-- Widget météo -->
      </div>
    `;
  }
}
```

### 2. Composants de design system

```javascript
// Bouton avec style garanti
class DesignButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "size"];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        button {
          border: none;
          border-radius: var(--button-radius, 4px);
          padding: var(--button-padding);
          background: var(--button-bg);
          color: var(--button-color);
          cursor: pointer;
        }

        :host([variant="primary"]) {
          --button-bg: blue;
          --button-color: white;
        }

        :host([variant="secondary"]) {
          --button-bg: gray;
          --button-color: black;
        }
      </style>

      <button><slot></slot></button>
    `;
  }
}

customElements.define("ds-button", DesignButton);
```

## En résumé

Le Shadow DOM c'est ton **sanctuaire privé** dans la page web :

- **Encapsulation CSS** totale
- **Isolation du DOM** garantie
- **Réutilisabilité** maximale
- **Pas d'effets de bord** sur le reste de la page

> **Règle d'or** : Utilise le Shadow DOM quand tu veux créer des composants complètement **autonomes et réutilisables**.

C'est l'outil parfait pour créer des composants qui fonctionnent **partout**, peu importe le chaos CSS environnant !

## Exemple complet en action

Tu veux voir tout ça en pratique ? J'ai préparé un **exemple interactif complet** qui montre l'encapsulation CSS, les slots, et les custom properties en action :

👉 **[Voir l'exemple Shadow DOM sur JSFiddle](https://jsfiddle.net/7amxtwnf/3/)**

Tu peux modifier le code directement et voir les résultats en temps réel. C'est parfait pour expérimenter et comprendre comment tout s'articule !
