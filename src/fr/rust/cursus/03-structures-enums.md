# Étape 3 : Structures et Enums

## 📖 Introduction

Les structures (structs) et les énumérations (enums) sont les outils principaux pour créer vos propres types de données en Rust. Ils vous permettent de modéliser votre domaine métier de manière claire et type-safe.

## 🎯 Objectifs d'Apprentissage

- Créer et utiliser des structs
- Implémenter des méthodes avec `impl`
- Maîtriser les enums et le pattern matching
- Comprendre les différents types de structs
- Utiliser les enums pour modéliser des états

## 📚 Concepts Clés

### Structures (Structs)

```rust
// Struct classique
struct User {
    username: String,
    email: String,
    age: u8,
    active: bool,
}

fn main() {
    let user1 = User {
        username: String::from("alice"),
        email: String::from("alice@example.com"),
        age: 25,
        active: true,
    };

    println!("Username: {}", user1.username);
}
```

### Méthodes avec impl

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // Méthode (prend &self)
    fn area(&self) -> u32 {
        self.width * self.height
    }

    // Fonction associée (pas de self)
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("Aire: {}", rect.area());

    let sq = Rectangle::square(20);
}
```

### Enums

```rust
enum Direction {
    North,
    South,
    East,
    West,
}

enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(u8, u8, u8),
}

impl Message {
    fn process(&self) {
        match self {
            Message::Quit => println!("Quitter"),
            Message::Move { x, y } => println!("Déplacer à ({}, {})", x, y),
            Message::Write(text) => println!("Écrire: {}", text),
            Message::ChangeColor(r, g, b) => println!("Couleur: RGB({}, {}, {})", r, g, b),
        }
    }
}
```

### Tuple Structs

```rust
struct Color(u8, u8, u8);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```

## 💪 Exercices

### Exercice 1 : Créer une Struct Person (Facile)

Créez une struct `Person` avec nom, âge et ville, puis une méthode qui affiche une présentation.

```rust
struct Person {
    // TODO: Ajoutez les champs
}

impl Person {
    fn introduce(&self) {
        // TODO: Affichez une présentation
    }
}

fn main() {
    let person = Person {
        name: String::from("Marie"),
        age: 30,
        city: String::from("Paris"),
    };
    person.introduce();
    // Devrait afficher : "Je m'appelle Marie, j'ai 30 ans et j'habite à Paris."
}
```

<details>
<summary>💡 Solution</summary>

```rust
struct Person {
    name: String,
    age: u8,
    city: String,
}

impl Person {
    fn introduce(&self) {
        println!(
            "Je m'appelle {}, j'ai {} ans et j'habite à {}.",
            self.name, self.age, self.city
        );
    }
}

fn main() {
    let person = Person {
        name: String::from("Marie"),
        age: 30,
        city: String::from("Paris"),
    };
    person.introduce();
}
```
</details>

---

### Exercice 2 : Cercle et Aire (Moyen)

Créez une struct `Circle` avec un rayon et implémentez des méthodes pour calculer l'aire et la circonférence.

```rust
struct Circle {
    // TODO
}

impl Circle {
    fn new(radius: f64) -> Circle {
        // TODO
    }

    fn area(&self) -> f64 {
        // TODO: aire = π × r²
    }

    fn circumference(&self) -> f64 {
        // TODO: circonférence = 2 × π × r
    }
}

fn main() {
    let circle = Circle::new(5.0);
    println!("Aire: {:.2}", circle.area());
    println!("Circonférence: {:.2}", circle.circumference());
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::f64::consts::PI;

struct Circle {
    radius: f64,
}

impl Circle {
    fn new(radius: f64) -> Circle {
        Circle { radius }
    }

    fn area(&self) -> f64 {
        PI * self.radius * self.radius
    }

    fn circumference(&self) -> f64 {
        2.0 * PI * self.radius
    }
}

fn main() {
    let circle = Circle::new(5.0);
    println!("Aire: {:.2}", circle.area());
    println!("Circonférence: {:.2}", circle.circumference());
}
```
</details>

---

### Exercice 3 : Compte Bancaire (Moyen)

Créez une struct `BankAccount` avec un solde et des méthodes pour déposer, retirer et afficher le solde.

```rust
struct BankAccount {
    // TODO
}

impl BankAccount {
    fn new(initial_balance: f64) -> BankAccount {
        // TODO
    }

    fn deposit(&mut self, amount: f64) {
        // TODO
    }

    fn withdraw(&mut self, amount: f64) -> bool {
        // TODO: retourne true si succès, false si solde insuffisant
    }

    fn balance(&self) -> f64 {
        // TODO
    }
}

fn main() {
    let mut account = BankAccount::new(100.0);
    account.deposit(50.0);
    println!("Solde: {}", account.balance());  // 150.0

    if account.withdraw(30.0) {
        println!("Retrait réussi, solde: {}", account.balance());  // 120.0
    }

    if !account.withdraw(200.0) {
        println!("Solde insuffisant !");
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
struct BankAccount {
    balance: f64,
}

impl BankAccount {
    fn new(initial_balance: f64) -> BankAccount {
        BankAccount {
            balance: initial_balance,
        }
    }

    fn deposit(&mut self, amount: f64) {
        self.balance += amount;
    }

    fn withdraw(&mut self, amount: f64) -> bool {
        if self.balance >= amount {
            self.balance -= amount;
            true
        } else {
            false
        }
    }

    fn balance(&self) -> f64 {
        self.balance
    }
}

fn main() {
    let mut account = BankAccount::new(100.0);
    account.deposit(50.0);
    println!("Solde: {}", account.balance());

    if account.withdraw(30.0) {
        println!("Retrait réussi, solde: {}", account.balance());
    }

    if !account.withdraw(200.0) {
        println!("Solde insuffisant !");
    }
}
```
</details>

---

### Exercice 4 : Enum de Formes (Difficile)

Créez un enum `Shape` représentant différentes formes géométriques et une méthode pour calculer leur aire.

```rust
enum Shape {
    // TODO: Circle, Rectangle, Triangle
}

impl Shape {
    fn area(&self) -> f64 {
        // TODO: Calculez l'aire selon la forme
    }
}

fn main() {
    let circle = Shape::Circle { radius: 5.0 };
    let rect = Shape::Rectangle { width: 10.0, height: 20.0 };
    let triangle = Shape::Triangle { base: 8.0, height: 6.0 };

    println!("Aire cercle: {:.2}", circle.area());
    println!("Aire rectangle: {:.2}", rect.area());
    println!("Aire triangle: {:.2}", triangle.area());
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::f64::consts::PI;

enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Triangle { base: f64, height: f64 },
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle { radius } => PI * radius * radius,
            Shape::Rectangle { width, height } => width * height,
            Shape::Triangle { base, height } => 0.5 * base * height,
        }
    }
}

fn main() {
    let circle = Shape::Circle { radius: 5.0 };
    let rect = Shape::Rectangle { width: 10.0, height: 20.0 };
    let triangle = Shape::Triangle { base: 8.0, height: 6.0 };

    println!("Aire cercle: {:.2}", circle.area());
    println!("Aire rectangle: {:.2}", rect.area());
    println!("Aire triangle: {:.2}", triangle.area());
}
```
</details>

---

### Exercice 5 : Machine à États (Difficile)

Créez une machine à café avec différents états (Idle, Brewing, Ready, Error) en utilisant un enum.

```rust
enum CoffeeMachineState {
    // TODO: Définir les états
}

struct CoffeeMachine {
    state: CoffeeMachineState,
}

impl CoffeeMachine {
    fn new() -> CoffeeMachine {
        // TODO
    }

    fn start_brewing(&mut self) {
        // TODO: Transition Idle -> Brewing
    }

    fn finish_brewing(&mut self) {
        // TODO: Transition Brewing -> Ready
    }

    fn serve(&mut self) {
        // TODO: Transition Ready -> Idle
    }

    fn error(&mut self) {
        // TODO: N'importe quel état -> Error
    }

    fn status(&self) {
        // TODO: Afficher l'état actuel
    }
}

fn main() {
    let mut machine = CoffeeMachine::new();
    machine.status();  // "Machine inactive"
    machine.start_brewing();
    machine.status();  // "Préparation en cours..."
    machine.finish_brewing();
    machine.status();  // "Café prêt !"
    machine.serve();
    machine.status();  // "Machine inactive"
}
```

<details>
<summary>💡 Solution</summary>

```rust
enum CoffeeMachineState {
    Idle,
    Brewing,
    Ready,
    Error(String),
}

struct CoffeeMachine {
    state: CoffeeMachineState,
}

impl CoffeeMachine {
    fn new() -> CoffeeMachine {
        CoffeeMachine {
            state: CoffeeMachineState::Idle,
        }
    }

    fn start_brewing(&mut self) {
        match self.state {
            CoffeeMachineState::Idle => {
                self.state = CoffeeMachineState::Brewing;
            }
            _ => {
                self.state = CoffeeMachineState::Error(
                    "Impossible de démarrer la préparation".to_string(),
                );
            }
        }
    }

    fn finish_brewing(&mut self) {
        match self.state {
            CoffeeMachineState::Brewing => {
                self.state = CoffeeMachineState::Ready;
            }
            _ => {
                self.state = CoffeeMachineState::Error(
                    "Aucune préparation en cours".to_string(),
                );
            }
        }
    }

    fn serve(&mut self) {
        match self.state {
            CoffeeMachineState::Ready => {
                self.state = CoffeeMachineState::Idle;
            }
            _ => {
                self.state = CoffeeMachineState::Error("Aucun café prêt".to_string());
            }
        }
    }

    fn error(&mut self) {
        self.state = CoffeeMachineState::Error("Erreur générale".to_string());
    }

    fn status(&self) {
        match &self.state {
            CoffeeMachineState::Idle => println!("Machine inactive"),
            CoffeeMachineState::Brewing => println!("Préparation en cours..."),
            CoffeeMachineState::Ready => println!("Café prêt !"),
            CoffeeMachineState::Error(msg) => println!("Erreur: {}", msg),
        }
    }
}

fn main() {
    let mut machine = CoffeeMachine::new();
    machine.status();
    machine.start_brewing();
    machine.status();
    machine.finish_brewing();
    machine.status();
    machine.serve();
    machine.status();
}
```
</details>

## 🎯 Défi Bonus : Jeu de Cartes

Créez des enums pour représenter les cartes à jouer (Couleur, Valeur) et une struct `Card`. Implémentez une fonction qui compare deux cartes.

## ✅ Points de Vérification

Avant de passer à l'étape suivante, assurez-vous de :
- [ ] Savoir créer et instancier des structs
- [ ] Pouvoir implémenter des méthodes avec `impl`
- [ ] Comprendre la différence entre méthodes et fonctions associées
- [ ] Maîtriser les enums et le pattern matching
- [ ] Savoir utiliser les enums pour modéliser des états
- [ ] Avoir réussi tous les exercices

## 📖 Pour Aller Plus Loin

- Les struct updates (`..` syntax)
- Les unit structs
- Les newtype patterns
- Les enums génériques

Prêt pour l'étape 4 ? Direction [Option et Result](./04-option-result.md) ! 🚀
