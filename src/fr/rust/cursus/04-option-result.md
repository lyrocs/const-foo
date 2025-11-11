# Étape 4 : Option et Result

## 📖 Introduction

`Option<T>` et `Result<T, E>` sont deux enums fondamentaux en Rust qui remplacent les concepts de `null` et d'exceptions. Ils permettent de gérer l'absence de valeur et les erreurs de manière explicite et type-safe.

## 🎯 Objectifs d'Apprentissage

- Comprendre et utiliser `Option<T>`
- Maîtriser `Result<T, E>` pour la gestion d'erreurs
- Utiliser l'opérateur `?` pour propager les erreurs
- Connaître les méthodes utiles : `unwrap`, `expect`, `map`, `and_then`
- Combiner plusieurs `Option` et `Result`

## 📚 Concepts Clés

### Option&lt;T&gt;

`Option` représente une valeur qui peut être présente (`Some`) ou absente (`None`).

```rust
fn divide(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

fn main() {
    match divide(10, 2) {
        Some(result) => println!("Résultat: {}", result),
        None => println!("Division par zéro !"),
    }
}
```

### Result&lt;T, E&gt;

`Result` représente une opération qui peut réussir (`Ok`) ou échouer (`Err`).

```rust
use std::fs::File;

fn open_file(path: &str) -> Result<File, std::io::Error> {
    File::open(path)
}

fn main() {
    match open_file("test.txt") {
        Ok(file) => println!("Fichier ouvert !"),
        Err(e) => println!("Erreur: {}", e),
    }
}
```

### L'Opérateur ?

L'opérateur `?` propage automatiquement les erreurs :

```rust
fn read_number_from_file(path: &str) -> Result<i32, Box<dyn std::error::Error>> {
    let content = std::fs::read_to_string(path)?;  // Propage l'erreur si échec
    let number = content.trim().parse::<i32>()?;    // Propage l'erreur si échec
    Ok(number)
}
```

### Méthodes Utiles

```rust
// unwrap() : panic si None/Err
let x = Some(5).unwrap();  // 5
// Some(5).unwrap();  // panic!

// expect() : panic avec message personnalisé
let y = Some(10).expect("Devrait avoir une valeur");

// unwrap_or() : valeur par défaut si None
let z = None.unwrap_or(42);  // 42

// map() : transforme la valeur interne
let doubled = Some(5).map(|x| x * 2);  // Some(10)

// and_then() : chaîne des opérations qui retournent Option/Result
let result = Some(5)
    .and_then(|x| Some(x * 2))
    .and_then(|x| Some(x + 1));  // Some(11)
```

## 💪 Exercices

### Exercice 1 : Trouver dans un Tableau (Facile)

Créez une fonction qui trouve la position d'un élément dans un tableau.

```rust
fn find_position(arr: &[i32], target: i32) -> Option<usize> {
    // TODO: Retourne Some(index) si trouvé, None sinon
}

fn main() {
    let numbers = [10, 20, 30, 40, 50];

    match find_position(&numbers, 30) {
        Some(pos) => println!("Trouvé à la position {}", pos),
        None => println!("Non trouvé"),
    }

    match find_position(&numbers, 99) {
        Some(pos) => println!("Trouvé à la position {}", pos),
        None => println!("Non trouvé"),
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn find_position(arr: &[i32], target: i32) -> Option<usize> {
    for (index, &value) in arr.iter().enumerate() {
        if value == target {
            return Some(index);
        }
    }
    None
}

// Ou avec les méthodes d'itérateur :
fn find_position_iter(arr: &[i32], target: i32) -> Option<usize> {
    arr.iter().position(|&x| x == target)
}

fn main() {
    let numbers = [10, 20, 30, 40, 50];

    match find_position(&numbers, 30) {
        Some(pos) => println!("Trouvé à la position {}", pos),
        None => println!("Non trouvé"),
    }

    match find_position(&numbers, 99) {
        Some(pos) => println!("Trouvé à la position {}", pos),
        None => println!("Non trouvé"),
    }
}
```
</details>

---

### Exercice 2 : Division Sécurisée (Facile)

Créez une fonction de division qui gère la division par zéro.

```rust
fn safe_divide(a: f64, b: f64) -> Option<f64> {
    // TODO
}

fn main() {
    println!("{:?}", safe_divide(10.0, 2.0));  // Some(5.0)
    println!("{:?}", safe_divide(10.0, 0.0));  // None
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn safe_divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 {
        None
    } else {
        Some(a / b)
    }
}

fn main() {
    println!("{:?}", safe_divide(10.0, 2.0));
    println!("{:?}", safe_divide(10.0, 0.0));
}
```
</details>

---

### Exercice 3 : Parser des Nombres (Moyen)

Créez une fonction qui parse une chaîne en nombre et retourne un `Result`.

```rust
fn parse_number(s: &str) -> Result<i32, String> {
    // TODO: Utilisez parse() et convertissez l'erreur en String
}

fn main() {
    match parse_number("42") {
        Ok(n) => println!("Nombre: {}", n),
        Err(e) => println!("Erreur: {}", e),
    }

    match parse_number("abc") {
        Ok(n) => println!("Nombre: {}", n),
        Err(e) => println!("Erreur: {}", e),
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn parse_number(s: &str) -> Result<i32, String> {
    s.parse::<i32>()
        .map_err(|e| format!("Impossible de parser '{}': {}", s, e))
}

fn main() {
    match parse_number("42") {
        Ok(n) => println!("Nombre: {}", n),
        Err(e) => println!("Erreur: {}", e),
    }

    match parse_number("abc") {
        Ok(n) => println!("Nombre: {}", n),
        Err(e) => println!("Erreur: {}", e),
    }
}
```
</details>

---

### Exercice 4 : Chaîner des Options (Moyen)

Créez une fonction qui récupère un utilisateur par ID, puis son email.

```rust
struct User {
    id: u32,
    name: String,
    email: Option<String>,
}

fn find_user(users: &[User], id: u32) -> Option<&User> {
    // TODO
}

fn get_user_email(users: &[User], id: u32) -> Option<String> {
    // TODO: Trouvez l'utilisateur puis récupérez son email
}

fn main() {
    let users = vec![
        User { id: 1, name: "Alice".to_string(), email: Some("alice@example.com".to_string()) },
        User { id: 2, name: "Bob".to_string(), email: None },
        User { id: 3, name: "Charlie".to_string(), email: Some("charlie@example.com".to_string()) },
    ];

    println!("{:?}", get_user_email(&users, 1));  // Some("alice@example.com")
    println!("{:?}", get_user_email(&users, 2));  // None (pas d'email)
    println!("{:?}", get_user_email(&users, 99)); // None (utilisateur inexistant)
}
```

<details>
<summary>💡 Solution</summary>

```rust
struct User {
    id: u32,
    name: String,
    email: Option<String>,
}

fn find_user(users: &[User], id: u32) -> Option<&User> {
    users.iter().find(|u| u.id == id)
}

fn get_user_email(users: &[User], id: u32) -> Option<String> {
    find_user(users, id)
        .and_then(|user| user.email.clone())
}

fn main() {
    let users = vec![
        User { id: 1, name: "Alice".to_string(), email: Some("alice@example.com".to_string()) },
        User { id: 2, name: "Bob".to_string(), email: None },
        User { id: 3, name: "Charlie".to_string(), email: Some("charlie@example.com".to_string()) },
    ];

    println!("{:?}", get_user_email(&users, 1));
    println!("{:?}", get_user_email(&users, 2));
    println!("{:?}", get_user_email(&users, 99));
}
```
</details>

---

### Exercice 5 : Calculateur avec Gestion d'Erreurs (Difficile)

Créez un calculateur qui parse deux nombres et effectue une opération, en gérant toutes les erreurs possibles.

```rust
#[derive(Debug)]
enum CalculatorError {
    ParseError(String),
    DivisionByZero,
    UnknownOperation,
}

fn calculate(a: &str, op: &str, b: &str) -> Result<f64, CalculatorError> {
    // TODO: Parse a et b, effectue l'opération, gère les erreurs
}

fn main() {
    println!("{:?}", calculate("10", "+", "5"));   // Ok(15.0)
    println!("{:?}", calculate("10", "/", "2"));   // Ok(5.0)
    println!("{:?}", calculate("10", "/", "0"));   // Err(DivisionByZero)
    println!("{:?}", calculate("abc", "+", "5"));  // Err(ParseError)
    println!("{:?}", calculate("10", "%", "5"));   // Err(UnknownOperation)
}
```

<details>
<summary>💡 Solution</summary>

```rust
#[derive(Debug)]
enum CalculatorError {
    ParseError(String),
    DivisionByZero,
    UnknownOperation,
}

fn calculate(a: &str, op: &str, b: &str) -> Result<f64, CalculatorError> {
    let num_a = a.parse::<f64>()
        .map_err(|_| CalculatorError::ParseError(format!("Cannot parse '{}'", a)))?;

    let num_b = b.parse::<f64>()
        .map_err(|_| CalculatorError::ParseError(format!("Cannot parse '{}'", b)))?;

    match op {
        "+" => Ok(num_a + num_b),
        "-" => Ok(num_a - num_b),
        "*" => Ok(num_a * num_b),
        "/" => {
            if num_b == 0.0 {
                Err(CalculatorError::DivisionByZero)
            } else {
                Ok(num_a / num_b)
            }
        }
        _ => Err(CalculatorError::UnknownOperation),
    }
}

fn main() {
    println!("{:?}", calculate("10", "+", "5"));
    println!("{:?}", calculate("10", "/", "2"));
    println!("{:?}", calculate("10", "/", "0"));
    println!("{:?}", calculate("abc", "+", "5"));
    println!("{:?}", calculate("10", "%", "5"));
}
```
</details>

## 🎯 Défi Bonus : Validateur de Configuration

Créez un système de validation de configuration qui :
1. Lit plusieurs champs depuis des variables d'environnement
2. Valide chaque champ (non vide, format correct, etc.)
3. Combine tous les résultats
4. Retourne soit une config valide, soit toutes les erreurs

## ✅ Points de Vérification

Avant de passer à l'étape suivante, assurez-vous de :
- [ ] Comprendre quand utiliser `Option` vs `Result`
- [ ] Savoir utiliser l'opérateur `?`
- [ ] Connaître les méthodes `unwrap`, `expect`, `unwrap_or`
- [ ] Pouvoir chaîner des opérations avec `map` et `and_then`
- [ ] Savoir créer des types d'erreurs personnalisés
- [ ] Avoir réussi tous les exercices

## 📖 Pour Aller Plus Loin

- `ok_or()` et `ok_or_else()` pour convertir Option en Result
- `transpose()` pour inverser Option&lt;Result&gt; en Result&lt;Option&gt;
- Les combinateurs `or`, `or_else`, `filter`
- Le trait `Try` (nightly)

Prêt pour l'étape 5 ? Direction [Collections](./05-collections.md) ! 🚀
