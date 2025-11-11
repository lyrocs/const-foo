# Étape 1 : Bases et Syntaxe

## 📖 Introduction

Rust est un langage de programmation système qui met l'accent sur la sécurité, la performance et la concurrence. Dans cette première étape, vous allez découvrir les fondamentaux du langage : comment déclarer des variables, utiliser les types primitifs, créer des fonctions et contrôler le flux d'exécution.

## 🎯 Objectifs d'Apprentissage

- Comprendre la différence entre variables mutables et immutables
- Maîtriser les types primitifs de Rust
- Écrire et appeler des fonctions
- Utiliser les structures de contrôle (if, loop, while, for)
- Comprendre les expressions vs les instructions

## 📚 Concepts Clés

### Variables et Mutabilité

En Rust, les variables sont **immutables par défaut**. Pour rendre une variable modifiable, utilisez le mot-clé `mut`.

```rust
fn main() {
    let x = 5;        // Immutable
    // x = 6;         // ❌ Erreur de compilation !

    let mut y = 10;   // Mutable
    y = 15;           // ✅ OK
    println!("y = {}", y);
}
```

### Types Primitifs

```rust
// Entiers
let a: i32 = -42;      // Entier signé 32 bits
let b: u64 = 100;      // Entier non signé 64 bits

// Flottants
let c: f64 = 3.14;     // Flottant 64 bits

// Booléens
let d: bool = true;

// Caractères (Unicode)
let e: char = '🦀';

// Tuples
let t: (i32, f64, char) = (500, 6.4, 'x');
let (x, y, z) = t;     // Déstructuration
```

### Fonctions

Les fonctions utilisent `fn` et peuvent retourner des valeurs :

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b  // Pas de point-virgule = expression retournée
}

fn main() {
    let result = add(5, 7);
    println!("5 + 7 = {}", result);
}
```

### Structures de Contrôle

```rust
// if/else
let number = 6;
if number % 2 == 0 {
    println!("Pair");
} else {
    println!("Impair");
}

// if comme expression
let status = if number > 5 { "grand" } else { "petit" };

// Boucle infinie
loop {
    println!("Infini !");
    break;  // Sort de la boucle
}

// while
let mut n = 0;
while n < 5 {
    n += 1;
}

// for (la plus idiomatique)
for i in 0..5 {  // 0 à 4 (5 exclu)
    println!("{}", i);
}
```

## 💪 Exercices

### Exercice 1 : Température (Facile)

Créez une fonction qui convertit des degrés Celsius en Fahrenheit.
Formule : `F = C × 9/5 + 32`

```rust
fn celsius_to_fahrenheit(celsius: f64) -> f64 {
    // TODO: Implémentez la conversion
}

fn main() {
    let temp_c = 25.0;
    let temp_f = celsius_to_fahrenheit(temp_c);
    println!("{temp_c}°C = {temp_f}°F");
    // Devrait afficher : 25°C = 77°F
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn celsius_to_fahrenheit(celsius: f64) -> f64 {
    celsius * 9.0 / 5.0 + 32.0
}

fn main() {
    let temp_c = 25.0;
    let temp_f = celsius_to_fahrenheit(temp_c);
    println!("{temp_c}°C = {temp_f}°F");
}
```
</details>

---

### Exercice 2 : Fibonacci (Moyen)

Écrivez une fonction qui calcule le n-ième nombre de Fibonacci.
Rappel : `F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)`

```rust
fn fibonacci(n: u32) -> u32 {
    // TODO: Implémentez le calcul de Fibonacci
}

fn main() {
    for i in 0..10 {
        println!("F({i}) = {}", fibonacci(i));
    }
    // Devrait afficher : 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn fibonacci(n: u32) -> u32 {
    if n == 0 {
        return 0;
    }
    if n == 1 {
        return 1;
    }

    let mut prev = 0;
    let mut curr = 1;

    for _ in 2..=n {
        let next = prev + curr;
        prev = curr;
        curr = next;
    }

    curr
}

fn main() {
    for i in 0..10 {
        println!("F({i}) = {}", fibonacci(i));
    }
}
```
</details>

---

### Exercice 3 : FizzBuzz (Facile)

Implémentez le classique FizzBuzz : pour les nombres de 1 à 100 :
- Affichez "Fizz" si divisible par 3
- Affichez "Buzz" si divisible par 5
- Affichez "FizzBuzz" si divisible par 3 ET 5
- Sinon, affichez le nombre

```rust
fn main() {
    // TODO: Implémentez FizzBuzz pour 1 à 100
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn main() {
    for n in 1..=100 {
        match (n % 3, n % 5) {
            (0, 0) => println!("FizzBuzz"),
            (0, _) => println!("Fizz"),
            (_, 0) => println!("Buzz"),
            (_, _) => println!("{}", n),
        }
    }
}

// Ou avec if/else :
fn main_alt() {
    for n in 1..=100 {
        if n % 15 == 0 {
            println!("FizzBuzz");
        } else if n % 3 == 0 {
            println!("Fizz");
        } else if n % 5 == 0 {
            println!("Buzz");
        } else {
            println!("{}", n);
        }
    }
}
```
</details>

---

### Exercice 4 : Nombre Premier (Moyen)

Écrivez une fonction qui détermine si un nombre est premier.

```rust
fn is_prime(n: u32) -> bool {
    // TODO: Déterminez si n est premier
}

fn main() {
    let numbers = [2, 3, 4, 17, 18, 19, 20, 97];
    for &num in &numbers {
        if is_prime(num) {
            println!("{num} est premier");
        } else {
            println!("{num} n'est pas premier");
        }
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn is_prime(n: u32) -> bool {
    if n < 2 {
        return false;
    }
    if n == 2 {
        return true;
    }
    if n % 2 == 0 {
        return false;
    }

    let limit = (n as f64).sqrt() as u32;
    for i in (3..=limit).step_by(2) {
        if n % i == 0 {
            return false;
        }
    }

    true
}

fn main() {
    let numbers = [2, 3, 4, 17, 18, 19, 20, 97];
    for &num in &numbers {
        if is_prime(num) {
            println!("{num} est premier");
        } else {
            println!("{num} n'est pas premier");
        }
    }
}
```
</details>

---

### Exercice 5 : Calculatrice Simple (Difficile)

Créez une calculatrice simple qui prend deux nombres et un opérateur (+, -, *, /) et retourne le résultat.

```rust
fn calculate(a: f64, operator: char, b: f64) -> f64 {
    // TODO: Implémentez la calculatrice
}

fn main() {
    println!("10 + 5 = {}", calculate(10.0, '+', 5.0));
    println!("10 - 5 = {}", calculate(10.0, '-', 5.0));
    println!("10 * 5 = {}", calculate(10.0, '*', 5.0));
    println!("10 / 5 = {}", calculate(10.0, '/', 5.0));
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn calculate(a: f64, operator: char, b: f64) -> f64 {
    match operator {
        '+' => a + b,
        '-' => a - b,
        '*' => a * b,
        '/' => a / b,
        _ => {
            println!("Opérateur non reconnu : {}", operator);
            0.0
        }
    }
}

fn main() {
    println!("10 + 5 = {}", calculate(10.0, '+', 5.0));
    println!("10 - 5 = {}", calculate(10.0, '-', 5.0));
    println!("10 * 5 = {}", calculate(10.0, '*', 5.0));
    println!("10 / 5 = {}", calculate(10.0, '/', 5.0));
}
```
</details>

## 🎯 Défi Bonus

Créez un programme qui :
1. Demande à l'utilisateur de deviner un nombre entre 1 et 100
2. Compare la réponse avec un nombre secret
3. Indique si le nombre est trop grand ou trop petit
4. Continue jusqu'à ce que l'utilisateur trouve

**Indice** : Vous aurez besoin de `use std::io;` pour lire l'entrée utilisateur.

## ✅ Points de Vérification

Avant de passer à l'étape suivante, assurez-vous de :
- [ ] Comprendre la différence entre `let` et `let mut`
- [ ] Savoir déclarer et utiliser les types primitifs
- [ ] Pouvoir écrire des fonctions avec paramètres et valeur de retour
- [ ] Maîtriser les boucles `for`, `while` et `loop`
- [ ] Comprendre la différence entre expressions et instructions
- [ ] Avoir réussi tous les exercices

## 📖 Pour Aller Plus Loin

- Le mot-clé `const` pour les constantes de compilation
- Le shadowing de variables
- Les tableaux de taille fixe `[T; N]`
- Pattern matching avec `match`

Prêt pour l'étape 2 ? Direction [Ownership et Borrowing](./02-ownership.md) ! 🚀
