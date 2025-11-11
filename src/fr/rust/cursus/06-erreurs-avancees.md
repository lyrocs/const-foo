# Étape 6 : Gestion d'Erreurs Avancée

## 📖 Introduction

Au-delà des `Result` et `Option` de base, Rust offre des outils puissants pour créer des systèmes de gestion d'erreurs robustes et expressifs. Cette étape vous apprendra à créer vos propres types d'erreurs, à les composer et à gérer des erreurs complexes.

## 🎯 Objectifs d'Apprentissage

- Créer des types d'erreurs personnalisés
- Implémenter les traits `Error`, `Display` et `Debug`
- Convertir entre différents types d'erreurs
- Utiliser `Box<dyn Error>` pour l'abstraction
- Comprendre les bibliothèques d'erreurs (thiserror, anyhow)
- Gérer des erreurs provenant de sources multiples

## 📚 Concepts Clés

### Créer un Type d'Erreur Personnalisé

```rust
use std::fmt;

#[derive(Debug)]
enum MathError {
    DivisionByZero,
    NegativeSquareRoot,
    Overflow,
}

impl fmt::Display for MathError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            MathError::DivisionByZero => write!(f, "Division par zéro"),
            MathError::NegativeSquareRoot => write!(f, "Racine carrée d'un nombre négatif"),
            MathError::Overflow => write!(f, "Dépassement de capacité"),
        }
    }
}

impl std::error::Error for MathError {}

fn divide(a: f64, b: f64) -> Result<f64, MathError> {
    if b == 0.0 {
        Err(MathError::DivisionByZero)
    } else {
        Ok(a / b)
    }
}
```

### Box&lt;dyn Error&gt;

Pour accepter n'importe quel type d'erreur :

```rust
use std::error::Error;

fn do_something() -> Result<(), Box<dyn Error>> {
    let content = std::fs::read_to_string("file.txt")?;
    let number: i32 = content.trim().parse()?;
    Ok(())
}
```

### Conversion d'Erreurs avec From

```rust
#[derive(Debug)]
struct MyError {
    message: String,
}

impl From<std::io::Error> for MyError {
    fn from(error: std::io::Error) -> Self {
        MyError {
            message: format!("IO Error: {}", error),
        }
    }
}

impl From<std::num::ParseIntError> for MyError {
    fn from(error: std::num::ParseIntError) -> Self {
        MyError {
            message: format!("Parse Error: {}", error),
        }
    }
}

fn read_number() -> Result<i32, MyError> {
    let content = std::fs::read_to_string("number.txt")?;  // Converti auto
    let number = content.trim().parse()?;                   // Converti auto
    Ok(number)
}
```

## 💪 Exercices

### Exercice 1 : Erreur de Validation (Facile)

Créez un type d'erreur pour valider un âge.

```rust
use std::fmt;

#[derive(Debug)]
enum AgeError {
    // TODO: TooYoung, TooOld, Negative
}

impl fmt::Display for AgeError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // TODO
    }
}

impl std::error::Error for AgeError {}

fn validate_age(age: i32) -> Result<i32, AgeError> {
    // TODO: Rejeter si < 0, < 18, ou > 120
}

fn main() {
    println!("{:?}", validate_age(25));   // Ok(25)
    println!("{:?}", validate_age(-5));   // Err(Negative)
    println!("{:?}", validate_age(10));   // Err(TooYoung)
    println!("{:?}", validate_age(150));  // Err(TooOld)
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::fmt;

#[derive(Debug)]
enum AgeError {
    TooYoung,
    TooOld,
    Negative,
}

impl fmt::Display for AgeError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AgeError::TooYoung => write!(f, "Trop jeune (minimum 18 ans)"),
            AgeError::TooOld => write!(f, "Âge invalide (maximum 120 ans)"),
            AgeError::Negative => write!(f, "L'âge ne peut pas être négatif"),
        }
    }
}

impl std::error::Error for AgeError {}

fn validate_age(age: i32) -> Result<i32, AgeError> {
    if age < 0 {
        Err(AgeError::Negative)
    } else if age < 18 {
        Err(AgeError::TooYoung)
    } else if age > 120 {
        Err(AgeError::TooOld)
    } else {
        Ok(age)
    }
}

fn main() {
    println!("{:?}", validate_age(25));
    println!("{:?}", validate_age(-5));
    println!("{:?}", validate_age(10));
    println!("{:?}", validate_age(150));
}
```
</details>

---

### Exercice 2 : Validation d'Email (Moyen)

Créez un validateur d'email avec des erreurs spécifiques.

```rust
#[derive(Debug)]
enum EmailError {
    // TODO: Empty, NoAtSign, NoLocalPart, NoDomain
}

fn validate_email(email: &str) -> Result<(), EmailError> {
    // TODO: Vérifier les règles de base d'un email
}

fn main() {
    println!("{:?}", validate_email("user@example.com"));  // Ok(())
    println!("{:?}", validate_email(""));                  // Err(Empty)
    println!("{:?}", validate_email("userexample.com"));   // Err(NoAtSign)
    println!("{:?}", validate_email("@example.com"));      // Err(NoLocalPart)
    println!("{:?}", validate_email("user@"));             // Err(NoDomain)
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::fmt;

#[derive(Debug)]
enum EmailError {
    Empty,
    NoAtSign,
    NoLocalPart,
    NoDomain,
}

impl fmt::Display for EmailError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            EmailError::Empty => write!(f, "L'email ne peut pas être vide"),
            EmailError::NoAtSign => write!(f, "L'email doit contenir un '@'"),
            EmailError::NoLocalPart => write!(f, "L'email doit avoir une partie locale"),
            EmailError::NoDomain => write!(f, "L'email doit avoir un domaine"),
        }
    }
}

impl std::error::Error for EmailError {}

fn validate_email(email: &str) -> Result<(), EmailError> {
    if email.is_empty() {
        return Err(EmailError::Empty);
    }

    if !email.contains('@') {
        return Err(EmailError::NoAtSign);
    }

    let parts: Vec<&str> = email.split('@').collect();

    if parts[0].is_empty() {
        return Err(EmailError::NoLocalPart);
    }

    if parts.len() < 2 || parts[1].is_empty() {
        return Err(EmailError::NoDomain);
    }

    Ok(())
}

fn main() {
    println!("{:?}", validate_email("user@example.com"));
    println!("{:?}", validate_email(""));
    println!("{:?}", validate_email("userexample.com"));
    println!("{:?}", validate_email("@example.com"));
    println!("{:?}", validate_email("user@"));
}
```
</details>

---

### Exercice 3 : Conversion d'Erreurs (Moyen)

Créez une erreur unifiée qui peut contenir différents types d'erreurs.

```rust
#[derive(Debug)]
enum AppError {
    IoError(std::io::Error),
    ParseError(std::num::ParseIntError),
    Custom(String),
}

impl From<std::io::Error> for AppError {
    // TODO
}

impl From<std::num::ParseIntError> for AppError {
    // TODO
}

fn read_config(path: &str) -> Result<i32, AppError> {
    // TODO: Lire un fichier et parser le contenu en i32
    // Utiliser ? pour propager les erreurs
}

fn main() {
    match read_config("config.txt") {
        Ok(value) => println!("Config: {}", value),
        Err(e) => println!("Erreur: {:?}", e),
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::fmt;

#[derive(Debug)]
enum AppError {
    IoError(std::io::Error),
    ParseError(std::num::ParseIntError),
    Custom(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::IoError(e) => write!(f, "IO Error: {}", e),
            AppError::ParseError(e) => write!(f, "Parse Error: {}", e),
            AppError::Custom(msg) => write!(f, "Error: {}", msg),
        }
    }
}

impl std::error::Error for AppError {}

impl From<std::io::Error> for AppError {
    fn from(error: std::io::Error) -> Self {
        AppError::IoError(error)
    }
}

impl From<std::num::ParseIntError> for AppError {
    fn from(error: std::num::ParseIntError) -> Self {
        AppError::ParseError(error)
    }
}

fn read_config(path: &str) -> Result<i32, AppError> {
    let content = std::fs::read_to_string(path)?;
    let value = content.trim().parse::<i32>()?;
    Ok(value)
}

fn main() {
    match read_config("config.txt") {
        Ok(value) => println!("Config: {}", value),
        Err(e) => println!("Erreur: {}", e),
    }
}
```
</details>

---

### Exercice 4 : Système de Login (Difficile)

Créez un système de login avec différentes erreurs possibles.

```rust
#[derive(Debug)]
struct User {
    username: String,
    password: String,
    active: bool,
}

#[derive(Debug)]
enum LoginError {
    // TODO: UserNotFound, WrongPassword, AccountDisabled, InvalidFormat
}

fn login(users: &[User], username: &str, password: &str) -> Result<&User, LoginError> {
    // TODO
}

fn main() {
    let users = vec![
        User { username: "alice".to_string(), password: "pass123".to_string(), active: true },
        User { username: "bob".to_string(), password: "secret".to_string(), active: false },
    ];

    match login(&users, "alice", "pass123") {
        Ok(user) => println!("Connecté en tant que {}", user.username),
        Err(e) => println!("Erreur: {:?}", e),
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::fmt;

#[derive(Debug)]
struct User {
    username: String,
    password: String,
    active: bool,
}

#[derive(Debug)]
enum LoginError {
    UserNotFound,
    WrongPassword,
    AccountDisabled,
    InvalidFormat,
}

impl fmt::Display for LoginError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            LoginError::UserNotFound => write!(f, "Utilisateur non trouvé"),
            LoginError::WrongPassword => write!(f, "Mot de passe incorrect"),
            LoginError::AccountDisabled => write!(f, "Compte désactivé"),
            LoginError::InvalidFormat => write!(f, "Format invalide"),
        }
    }
}

impl std::error::Error for LoginError {}

fn login(users: &[User], username: &str, password: &str) -> Result<&User, LoginError> {
    if username.is_empty() || password.is_empty() {
        return Err(LoginError::InvalidFormat);
    }

    let user = users
        .iter()
        .find(|u| u.username == username)
        .ok_or(LoginError::UserNotFound)?;

    if !user.active {
        return Err(LoginError::AccountDisabled);
    }

    if user.password != password {
        return Err(LoginError::WrongPassword);
    }

    Ok(user)
}

fn main() {
    let users = vec![
        User { username: "alice".to_string(), password: "pass123".to_string(), active: true },
        User { username: "bob".to_string(), password: "secret".to_string(), active: false },
    ];

    println!("{:?}", login(&users, "alice", "pass123"));
    println!("{:?}", login(&users, "alice", "wrong"));
    println!("{:?}", login(&users, "bob", "secret"));
    println!("{:?}", login(&users, "charlie", "any"));
}
```
</details>

---

### Exercice 5 : Parser JSON Simplifié (Difficile)

Créez un parser JSON basique avec gestion d'erreurs détaillée.

```rust
#[derive(Debug)]
enum JsonError {
    // TODO: UnexpectedEnd, InvalidCharacter, InvalidNumber, etc.
}

fn parse_number(s: &str) -> Result<f64, JsonError> {
    // TODO
}

fn main() {
    println!("{:?}", parse_number("42.5"));
    println!("{:?}", parse_number("abc"));
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::fmt;

#[derive(Debug)]
enum JsonError {
    UnexpectedEnd,
    InvalidCharacter(char),
    InvalidNumber(String),
    ParseError(String),
}

impl fmt::Display for JsonError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            JsonError::UnexpectedEnd => write!(f, "Fin inattendue"),
            JsonError::InvalidCharacter(c) => write!(f, "Caractère invalide: {}", c),
            JsonError::InvalidNumber(s) => write!(f, "Nombre invalide: {}", s),
            JsonError::ParseError(msg) => write!(f, "Erreur de parsing: {}", msg),
        }
    }
}

impl std::error::Error for JsonError {}

fn parse_number(s: &str) -> Result<f64, JsonError> {
    if s.is_empty() {
        return Err(JsonError::UnexpectedEnd);
    }

    s.trim()
        .parse::<f64>()
        .map_err(|_| JsonError::InvalidNumber(s.to_string()))
}

fn main() {
    println!("{:?}", parse_number("42.5"));
    println!("{:?}", parse_number("abc"));
    println!("{:?}", parse_number(""));
}
```
</details>

## 🎯 Défi Bonus : API Client avec Gestion d'Erreurs

Créez un client HTTP simulé qui gère :
- Erreurs de connexion réseau
- Codes de statut HTTP (404, 500, etc.)
- Erreurs de parsing JSON
- Timeouts

Créez une hiérarchie d'erreurs complète avec conversions automatiques.

## ✅ Points de Vérification

Avant de passer à l'étape suivante, assurez-vous de :
- [ ] Savoir créer des types d'erreurs personnalisés
- [ ] Pouvoir implémenter Display et Error
- [ ] Comprendre Box&lt;dyn Error&gt;
- [ ] Savoir utiliser From pour la conversion d'erreurs
- [ ] Maîtriser la propagation d'erreurs avec ?
- [ ] Avoir réussi tous les exercices

## 📖 Pour Aller Plus Loin

- La crate `thiserror` pour simplifier les types d'erreurs
- La crate `anyhow` pour les applications
- Le trait `Termination` pour main()
- Les erreurs non-récupérables avec `panic!`

Prêt pour l'étape 7 ? Direction [Traits et Génériques](./07-traits-generiques.md) ! 🚀
