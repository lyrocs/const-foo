# Étape 8 : Lifetimes

## 📖 Introduction

Les lifetimes sont l'une des fonctionnalités les plus uniques (et parfois intimidantes) de Rust. Ils permettent au compilateur de garantir que les références sont toujours valides. La bonne nouvelle ? Le compilateur déduit souvent les lifetimes automatiquement. Vous ne devez les annoter explicitement que dans certains cas.

## 🎯 Objectifs d'Apprentissage

- Comprendre ce qu'est un lifetime
- Savoir quand les annotations de lifetime sont nécessaires
- Maîtriser la syntaxe des lifetimes
- Comprendre les règles d'élision de lifetime
- Utiliser les lifetimes avec les structs
- Connaître le lifetime `'static`

## 📚 Concepts Clés

### Pourquoi les Lifetimes ?

Les lifetimes garantissent qu'une référence ne vit jamais plus longtemps que la valeur qu'elle référence :

```rust
fn main() {
    let r;

    {
        let x = 5;
        r = &x;  // ❌ Erreur ! x sera détruit à la fin du bloc
    }

    // println!("{}", r);  // r pointerait vers une mémoire invalide !
}
```

### Syntaxe de Base

```rust
// 'a est un paramètre de lifetime
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("long string");
    let string2 = String::from("short");

    let result = longest(&string1, &string2);
    println!("Plus long: {}", result);
}
```

Cette annotation signifie : "la référence retournée vivra au moins aussi longtemps que les deux paramètres".

### Lifetimes dans les Structs

```rust
struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn level(&self) -> i32 {
        3
    }

    fn announce_and_return(&self, announcement: &str) -> &str {
        println!("Attention: {}", announcement);
        self.part
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().unwrap();

    let excerpt = Excerpt {
        part: first_sentence,
    };
}
```

### Règles d'Élision

Rust peut déduire les lifetimes dans certains cas :

1. Chaque référence en paramètre obtient son propre lifetime
2. S'il n'y a qu'un seul lifetime en entrée, il est assigné à toutes les sorties
3. Si `&self` ou `&mut self` est présent, son lifetime est assigné aux sorties

```rust
// Ces deux fonctions sont équivalentes :
fn first_word(s: &str) -> &str { /* ... */ }
fn first_word<'a>(s: &'a str) -> &'a str { /* ... */ }
```

### Le Lifetime 'static

`'static` signifie que la référence peut vivre pour toute la durée du programme :

```rust
let s: &'static str = "Je suis stocké dans le binaire";
```

## 💪 Exercices

### Exercice 1 : Première Occurrence (Facile)

Créez une fonction qui retourne la première occurrence d'un caractère dans une string.

```rust
fn first_occurrence(text: &str, ch: char) -> Option<&str> {
    // TODO: Retourne une slice commençant au caractère trouvé
}

fn main() {
    let text = "Hello, Rust!";
    if let Some(rest) = first_occurrence(text, 'R') {
        println!("{}", rest);  // "Rust!"
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn first_occurrence(text: &str, ch: char) -> Option<&str> {
    text.find(ch).map(|index| &text[index..])
}

// Avec annotation explicite (équivalent) :
fn first_occurrence_explicit<'a>(text: &'a str, ch: char) -> Option<&'a str> {
    text.find(ch).map(|index| &text[index..])
}

fn main() {
    let text = "Hello, Rust!";
    if let Some(rest) = first_occurrence(text, 'R') {
        println!("{}", rest);
    }
}
```
</details>

---

### Exercice 2 : Plus Long de Deux (Moyen)

Implémentez `longest` qui retourne la plus longue des deux strings.

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    // TODO
}

fn main() {
    let string1 = String::from("long string is long");
    let result;

    {
        let string2 = String::from("xyz");
        result = longest(&string1, &string2);
        println!("Plus long: {}", result);
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("long string is long");
    let result;

    {
        let string2 = String::from("xyz");
        result = longest(&string1, &string2);
        println!("Plus long: {}", result);
    }
    // result peut toujours être utilisé ici car il fait référence à string1
}
```
</details>

---

### Exercice 3 : Struct avec Référence (Moyen)

Créez une struct qui stocke une référence vers un nom.

```rust
struct User {
    // TODO: Ajoutez un champ name qui est une référence
}

impl User {
    fn new(name: &str) -> User {
        // TODO
    }

    fn greet(&self) {
        println!("Bonjour, {}!", self.name);
    }
}

fn main() {
    let name = String::from("Alice");
    let user = User::new(&name);
    user.greet();
}
```

<details>
<summary>💡 Solution</summary>

```rust
struct User<'a> {
    name: &'a str,
}

impl<'a> User<'a> {
    fn new(name: &'a str) -> User<'a> {
        User { name }
    }

    fn greet(&self) {
        println!("Bonjour, {}!", self.name);
    }
}

fn main() {
    let name = String::from("Alice");
    let user = User::new(&name);
    user.greet();
}
```
</details>

---

### Exercice 4 : Parser de Mots (Difficile)

Créez une struct qui parse des mots d'un texte et les stocke.

```rust
struct WordParser {
    // TODO: Stockez le texte et l'index courant
}

impl WordParser {
    fn new(text: &str) -> WordParser {
        // TODO
    }

    fn next_word(&mut self) -> Option<&str> {
        // TODO: Retourne le prochain mot
    }
}

fn main() {
    let text = "Rust est génial";
    let mut parser = WordParser::new(&text);

    while let Some(word) = parser.next_word() {
        println!("{}", word);
    }
    // Devrait afficher : Rust, est, génial
}
```

<details>
<summary>💡 Solution</summary>

```rust
struct WordParser<'a> {
    text: &'a str,
    position: usize,
}

impl<'a> WordParser<'a> {
    fn new(text: &'a str) -> WordParser<'a> {
        WordParser { text, position: 0 }
    }

    fn next_word(&mut self) -> Option<&'a str> {
        // Sauter les espaces
        while self.position < self.text.len()
            && self.text.as_bytes()[self.position].is_ascii_whitespace()
        {
            self.position += 1;
        }

        if self.position >= self.text.len() {
            return None;
        }

        let start = self.position;

        // Trouver la fin du mot
        while self.position < self.text.len()
            && !self.text.as_bytes()[self.position].is_ascii_whitespace()
        {
            self.position += 1;
        }

        Some(&self.text[start..self.position])
    }
}

fn main() {
    let text = "Rust est génial";
    let mut parser = WordParser::new(&text);

    while let Some(word) = parser.next_word() {
        println!("{}", word);
    }
}
```
</details>

---

### Exercice 5 : Multiples Lifetimes (Difficile)

Créez une fonction avec plusieurs lifetimes différents.

```rust
// Cette fonction retourne une partie de x, donc le lifetime
// de retour dépend seulement de x, pas de y
fn get_part<'a, 'b>(x: &'a str, _y: &'b str) -> &'a str {
    // TODO: Retourne les 5 premiers caractères de x
}

fn main() {
    let string1 = String::from("Hello World");

    {
        let string2 = String::from("temporary");
        let result = get_part(&string1, &string2);
        println!("{}", result);
    }

    // result pourrait toujours être utilisé ici car il vient de string1
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn get_part<'a, 'b>(x: &'a str, _y: &'b str) -> &'a str {
    let end = x.len().min(5);
    &x[..end]
}

// Ou avec une seule lifetime si on n'utilise pas y :
fn get_part_simple(x: &str, _y: &str) -> &str {
    let end = x.len().min(5);
    &x[..end]
}

fn main() {
    let string1 = String::from("Hello World");

    {
        let string2 = String::from("temporary");
        let result = get_part(&string1, &string2);
        println!("{}", result);
    }
}
```
</details>

---

### Exercice 6 : Struct Context (Difficile)

Créez une struct qui garde le contexte d'un texte et permet d'extraire des parties.

```rust
struct Context {
    // TODO: Stockez le texte original
}

impl Context {
    fn new(text: &str) -> Context {
        // TODO
    }

    fn get_line(&self, index: usize) -> Option<&str> {
        // TODO: Retourne la n-ième ligne
    }

    fn get_lines(&self, start: usize, end: usize) -> Vec<&str> {
        // TODO: Retourne plusieurs lignes
    }
}

fn main() {
    let text = "Ligne 1\nLigne 2\nLigne 3\nLigne 4";
    let ctx = Context::new(&text);

    if let Some(line) = ctx.get_line(1) {
        println!("{}", line);  // "Ligne 2"
    }

    let lines = ctx.get_lines(0, 2);
    for line in lines {
        println!("{}", line);
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
struct Context<'a> {
    text: &'a str,
}

impl<'a> Context<'a> {
    fn new(text: &'a str) -> Context<'a> {
        Context { text }
    }

    fn get_line(&self, index: usize) -> Option<&'a str> {
        self.text.lines().nth(index)
    }

    fn get_lines(&self, start: usize, end: usize) -> Vec<&'a str> {
        self.text
            .lines()
            .skip(start)
            .take(end - start)
            .collect()
    }
}

fn main() {
    let text = "Ligne 1\nLigne 2\nLigne 3\nLigne 4";
    let ctx = Context::new(&text);

    if let Some(line) = ctx.get_line(1) {
        println!("{}", line);
    }

    let lines = ctx.get_lines(0, 2);
    for line in lines {
        println!("{}", line);
    }
}
```
</details>

## 🎯 Défi Bonus : Cache de Strings

Créez un système de cache qui :
- Stocke des références vers des strings
- Permet de récupérer une string par clé
- Gère correctement les lifetimes pour garantir que les strings cachées vivent assez longtemps
- Implémente une méthode `get_or_insert` qui ajoute une valeur si elle n'existe pas

## ✅ Points de Vérification

Avant de passer à l'étape suivante, assurez-vous de :
- [ ] Comprendre pourquoi les lifetimes existent
- [ ] Savoir annoter les lifetimes quand nécessaire
- [ ] Connaître les règles d'élision
- [ ] Pouvoir utiliser les lifetimes avec des structs
- [ ] Comprendre `'static`
- [ ] Avoir réussi tous les exercices

## 📖 Pour Aller Plus Loin

- Les lifetime bounds (`T: 'a`)
- Les lifetimes avec les closures
- Les lifetimes higher-ranked (`for<'a>`)
- Comprendre les messages d'erreur du compilateur

Prêt pour l'étape 9 ? Direction [Concurrence](./09-concurrence.md) ! 🚀
