# Étape 7 : Traits et Génériques

## 📖 Introduction

Les traits et les génériques sont au cœur du système de types de Rust. Les traits définissent des comportements partagés (comme les interfaces), et les génériques permettent d'écrire du code réutilisable pour différents types. Ensemble, ils permettent un polymorphisme puissant et type-safe.

## 🎯 Objectifs d'Apprentissage

- Comprendre et créer des traits
- Implémenter des traits pour vos types
- Utiliser des types génériques
- Comprendre les trait bounds
- Connaître les traits standards importants
- Combiner génériques et traits

## 📚 Concepts Clés

### Traits

Un trait définit un ensemble de méthodes qu'un type doit implémenter :

```rust
trait Drawable {
    fn draw(&self);
}

struct Circle {
    radius: f64,
}

struct Rectangle {
    width: f64,
    height: f64,
}

impl Drawable for Circle {
    fn draw(&self) {
        println!("Dessin d'un cercle de rayon {}", self.radius);
    }
}

impl Drawable for Rectangle {
    fn draw(&self) {
        println!("Dessin d'un rectangle {}x{}", self.width, self.height);
    }
}

fn render(item: &impl Drawable) {
    item.draw();
}
```

### Génériques

Les génériques permettent d'écrire du code pour n'importe quel type :

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn new(x: T, y: T) -> Self {
        Point { x, y }
    }
}

fn main() {
    let int_point = Point::new(5, 10);
    let float_point = Point::new(1.5, 2.5);
}
```

### Trait Bounds

Restreindre les types génériques avec des traits :

```rust
use std::fmt::Display;

fn print_it<T: Display>(item: T) {
    println!("{}", item);
}

// Ou avec la syntaxe where
fn print_it_where<T>(item: T)
where
    T: Display,
{
    println!("{}", item);
}
```

### Traits Standards Importants

```rust
// Clone : duplication de valeur
#[derive(Clone)]
struct MyType {
    value: i32,
}

// Copy : types copiables au lieu de déplacés
#[derive(Copy, Clone)]
struct SmallType {
    x: i32,
}

// Debug : affichage pour le débogage
#[derive(Debug)]
struct DebugType {
    name: String,
}

// PartialEq : comparaison d'égalité
#[derive(PartialEq)]
struct Point {
    x: i32,
    y: i32,
}
```

## 💪 Exercices

### Exercice 1 : Trait Summary (Facile)

Créez un trait `Summary` avec une méthode qui résume un article.

```rust
trait Summary {
    fn summarize(&self) -> String;
}

struct Article {
    title: String,
    author: String,
    content: String,
}

struct Tweet {
    username: String,
    content: String,
}

// TODO: Implémentez Summary pour Article et Tweet

fn main() {
    let article = Article {
        title: "Rust est génial".to_string(),
        author: "Alice".to_string(),
        content: "Le contenu...".to_string(),
    };

    let tweet = Tweet {
        username: "bob".to_string(),
        content: "J'adore Rust!".to_string(),
    };

    println!("{}", article.summarize());
    println!("{}", tweet.summarize());
}
```

<details>
<summary>💡 Solution</summary>

```rust
trait Summary {
    fn summarize(&self) -> String;
}

struct Article {
    title: String,
    author: String,
    content: String,
}

struct Tweet {
    username: String,
    content: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} par {}", self.title, self.author)
    }
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("@{}: {}", self.username, self.content)
    }
}

fn main() {
    let article = Article {
        title: "Rust est génial".to_string(),
        author: "Alice".to_string(),
        content: "Le contenu...".to_string(),
    };

    let tweet = Tweet {
        username: "bob".to_string(),
        content: "J'adore Rust!".to_string(),
    };

    println!("{}", article.summarize());
    println!("{}", tweet.summarize());
}
```
</details>

---

### Exercice 2 : Fonction Générique Max (Facile)

Créez une fonction générique qui trouve le maximum entre deux valeurs.

```rust
fn max<T>(a: T, b: T) -> T {
    // TODO: Retourne le plus grand
    // Indice : utilisez le trait PartialOrd
}

fn main() {
    println!("{}", max(5, 10));
    println!("{}", max(3.5, 2.1));
    println!("{}", max('a', 'z'));
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn max<T: PartialOrd>(a: T, b: T) -> T {
    if a > b {
        a
    } else {
        b
    }
}

fn main() {
    println!("{}", max(5, 10));
    println!("{}", max(3.5, 2.1));
    println!("{}", max('a', 'z'));
}
```
</details>

---

### Exercice 3 : Container Générique (Moyen)

Créez un container générique avec des méthodes.

```rust
struct Container<T> {
    // TODO
}

impl<T> Container<T> {
    fn new(value: T) -> Self {
        // TODO
    }

    fn get(&self) -> &T {
        // TODO
    }

    fn set(&mut self, value: T) {
        // TODO
    }
}

fn main() {
    let mut container = Container::new(42);
    println!("{}", container.get());
    container.set(100);
    println!("{}", container.get());

    let string_container = Container::new(String::from("Hello"));
    println!("{}", string_container.get());
}
```

<details>
<summary>💡 Solution</summary>

```rust
struct Container<T> {
    value: T,
}

impl<T> Container<T> {
    fn new(value: T) -> Self {
        Container { value }
    }

    fn get(&self) -> &T {
        &self.value
    }

    fn set(&mut self, value: T) {
        self.value = value;
    }
}

fn main() {
    let mut container = Container::new(42);
    println!("{}", container.get());
    container.set(100);
    println!("{}", container.get());

    let string_container = Container::new(String::from("Hello"));
    println!("{}", string_container.get());
}
```
</details>

---

### Exercice 4 : Trait Area (Moyen)

Créez un trait `Area` et implémentez-le pour différentes formes.

```rust
trait Area {
    fn area(&self) -> f64;
}

struct Circle {
    radius: f64,
}

struct Rectangle {
    width: f64,
    height: f64,
}

struct Triangle {
    base: f64,
    height: f64,
}

// TODO: Implémentez Area pour chaque forme

fn print_area<T: Area>(shape: &T) {
    println!("Aire: {:.2}", shape.area());
}

fn main() {
    let circle = Circle { radius: 5.0 };
    let rect = Rectangle { width: 10.0, height: 20.0 };
    let triangle = Triangle { base: 8.0, height: 6.0 };

    print_area(&circle);
    print_area(&rect);
    print_area(&triangle);
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::f64::consts::PI;

trait Area {
    fn area(&self) -> f64;
}

struct Circle {
    radius: f64,
}

struct Rectangle {
    width: f64,
    height: f64,
}

struct Triangle {
    base: f64,
    height: f64,
}

impl Area for Circle {
    fn area(&self) -> f64 {
        PI * self.radius * self.radius
    }
}

impl Area for Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
}

impl Area for Triangle {
    fn area(&self) -> f64 {
        0.5 * self.base * self.height
    }
}

fn print_area<T: Area>(shape: &T) {
    println!("Aire: {:.2}", shape.area());
}

fn main() {
    let circle = Circle { radius: 5.0 };
    let rect = Rectangle { width: 10.0, height: 20.0 };
    let triangle = Triangle { base: 8.0, height: 6.0 };

    print_area(&circle);
    print_area(&rect);
    print_area(&triangle);
}
```
</details>

---

### Exercice 5 : Iterator Personnalisé (Difficile)

Créez un itérateur qui compte de 1 à n.

```rust
struct Counter {
    // TODO
}

impl Counter {
    fn new(max: u32) -> Self {
        // TODO
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        // TODO
    }
}

fn main() {
    let counter = Counter::new(5);

    for num in counter {
        println!("{}", num);  // 1, 2, 3, 4, 5
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
struct Counter {
    current: u32,
    max: u32,
}

impl Counter {
    fn new(max: u32) -> Self {
        Counter { current: 0, max }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        self.current += 1;

        if self.current <= self.max {
            Some(self.current)
        } else {
            None
        }
    }
}

fn main() {
    let counter = Counter::new(5);

    for num in counter {
        println!("{}", num);
    }

    // Utiliser les méthodes d'itérateur
    let sum: u32 = Counter::new(10).sum();
    println!("Somme 1..10: {}", sum);
}
```
</details>

---

### Exercice 6 : Comparable (Difficile)

Créez un trait pour comparer la taille de différents objets.

```rust
trait Comparable {
    fn size(&self) -> usize;

    fn is_bigger_than(&self, other: &Self) -> bool {
        self.size() > other.size()
    }
}

struct File {
    name: String,
    bytes: usize,
}

struct Folder {
    name: String,
    item_count: usize,
}

// TODO: Implémentez Comparable pour File et Folder

fn largest<T: Comparable>(items: &[T]) -> Option<&T> {
    // TODO: Retourne le plus grand élément
}

fn main() {
    let files = vec![
        File { name: "a.txt".to_string(), bytes: 100 },
        File { name: "b.txt".to_string(), bytes: 500 },
        File { name: "c.txt".to_string(), bytes: 250 },
    ];

    if let Some(largest) = largest(&files) {
        println!("Plus grand fichier: {} ({} bytes)", largest.name, largest.bytes);
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
trait Comparable {
    fn size(&self) -> usize;

    fn is_bigger_than(&self, other: &Self) -> bool {
        self.size() > other.size()
    }
}

struct File {
    name: String,
    bytes: usize,
}

struct Folder {
    name: String,
    item_count: usize,
}

impl Comparable for File {
    fn size(&self) -> usize {
        self.bytes
    }
}

impl Comparable for Folder {
    fn size(&self) -> usize {
        self.item_count
    }
}

fn largest<T: Comparable>(items: &[T]) -> Option<&T> {
    if items.is_empty() {
        return None;
    }

    let mut largest = &items[0];

    for item in &items[1..] {
        if item.is_bigger_than(largest) {
            largest = item;
        }
    }

    Some(largest)
}

fn main() {
    let files = vec![
        File { name: "a.txt".to_string(), bytes: 100 },
        File { name: "b.txt".to_string(), bytes: 500 },
        File { name: "c.txt".to_string(), bytes: 250 },
    ];

    if let Some(largest) = largest(&files) {
        println!("Plus grand fichier: {} ({} bytes)", largest.name, largest.bytes);
    }
}
```
</details>

## 🎯 Défi Bonus : Système de Plugin

Créez un système de plugin où :
- Un trait `Plugin` définit `name()` et `execute()`
- Plusieurs plugins concrets implémentent ce trait
- Un `PluginManager` générique stocke et exécute des plugins
- Utilisez les trait objects (`Box<dyn Plugin>`) pour stocker différents types

## ✅ Points de Vérification

Avant de passer à l'étape suivante, assurez-vous de :
- [ ] Comprendre la différence entre traits et interfaces
- [ ] Savoir créer et implémenter des traits
- [ ] Pouvoir utiliser des types génériques
- [ ] Maîtriser les trait bounds
- [ ] Connaître les principaux traits standards
- [ ] Avoir réussi tous les exercices

## 📖 Pour Aller Plus Loin

- Les associated types
- Les trait objects (`dyn Trait`)
- Les super-traits
- Le trait `From` et `Into`
- Les blanket implementations

Prêt pour l'étape 8 ? Direction [Lifetimes](./08-lifetimes.md) ! 🚀
