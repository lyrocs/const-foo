---
# This is the title of the article
title: Option
# This is the icon of the page
# icon: atom
# This control sidebar order
order: 1
# Set author
author: Lyrocs
# Set writing time
date: 2025-09-25
# A page can have multiple categories
category:
  - Rust
# A page can have multiple tags
tag:
  - Rust
  - Guide
# this page is sticky in article list
sticky: true
# this page will appear in starred articles
star: true
comment: false
# You can customize footer content
footer: Footer content for test
# You can customize copyright content
copyright: No Copyright
---

# Result et Option : Arrêtez de Penser en Termes de `null`

Si vous venez d'un langage comme Java, C\# ou JavaScript, vous connaissez sans doute la valeur `null` (ou `undefined`). Son inventeur, Tony Hoare, l'a lui-même qualifiée d'"erreur à un milliard de dollars" car elle est la source d'innombrables bugs et crashs inattendus (`NullPointerException`, `Cannot read properties of undefined`, etc.).

Rust adopte une approche radicalement différente pour gérer l'absence de valeur ou les erreurs. Au lieu de laisser une valeur être "nulle" par surprise, Rust nous force à gérer ces cas explicitement grâce à son système de types. Les deux outils principaux pour cela sont les `enum` **`Option<T>`** et **`Result<T, E>`**.

## `Option<T>` : La Gestion de l'Absence de Valeur

Quand une fonction peut retourner une valeur... ou ne rien retourner du tout, elle ne renvoie pas `null`. Elle renvoie une `Option<T>`.

Pensez à `Option<T>` comme à une **boîte** 📦. Cette boîte peut contenir :

- Soit une valeur de type `T` : `Some(valeur)`.
- Soit absolument rien : `None`.

Le compilateur Rust vous oblige à vérifier le contenu de la boîte avant de pouvoir l'utiliser. Fini les surprises \!

### Exemple : Trouver un utilisateur

Imaginons une fonction qui cherche un utilisateur dans une liste. Il est possible qu'on ne le trouve pas.

```rust
struct User {
    id: u32,
    name: String,
}

// Cette fonction retourne une Option<&User>, pas un &User ou null.
fn find_user_by_id(users: &[User], id: u32) -> Option<&User> {
    for user in users {
        if user.id == id {
            return Some(user); // On a trouvé l'utilisateur, on le met dans la boîte "Some"
        }
    }
    None // On n'a rien trouvé, on retourne la boîte "None"
}

fn main() {
    let users = vec![
        User { id: 1, name: "Alice".to_string() },
        User { id: 2, name: "Bob".to_string() },
    ];

    // On cherche un utilisateur qui existe
    let found_user = find_user_by_id(&users, 2);

    // On est OBLIGÉ de gérer les deux cas : Some et None
    match found_user {
        Some(user) => println!("Utilisateur trouvé : {}", user.name),
        None => println!("Utilisateur non trouvé."),
    }

    // On cherche un utilisateur qui n'existe pas
    let missing_user = find_user_by_id(&users, 99);
    match missing_user {
        Some(user) => println!("Utilisateur trouvé : {}", user.name),
        None => println!("Utilisateur non trouvé pour l'ID 99."),
    }
}
```

**Sortie :**

```
Utilisateur trouvé : Bob
Utilisateur non trouvé pour l'ID 99.
```

Avec `Option`, le cas où la valeur est absente n'est plus une exception, mais un état normal et attendu que le compilateur vous force à gérer.

---

## `Result<T, E>` : La Gestion des Erreurs

Quand une fonction peut soit réussir et retourner une valeur, soit échouer pour une raison spécifique, elle renvoie un `Result<T, E>`.

`Result<T, E>` est aussi une boîte, mais avec deux issues possibles :

- Un succès, contenant la valeur : `Ok(valeur)`.
- Une erreur, contenant une information sur l'échec : `Err(erreur)`.

L'avantage est que le type de l'erreur `E` est explicite. Vous savez quel genre de problème peut survenir.

### Exemple : Parser une chaîne de caractères

```rust
use std::num::ParseIntError;

// Cette fonction retourne soit un u32, soit une erreur de parsing.
fn parse_number(s: &str) -> Result<u32, ParseIntError> {
    s.parse::<u32>() // La méthode parse() renvoie déjà un Result !
}

fn main() {
    let good_number_str = "42";
    let bad_number_str = "Hello";

    // Gérer un cas de succès
    match parse_number(good_number_str) {
        Ok(number) => println!("Le nombre est : {}", number),
        Err(e) => println!("Erreur : {}", e),
    }

    // Gérer un cas d'échec
    match parse_number(bad_number_str) {
        Ok(number) => println!("Le nombre est : {}", number),
        Err(e) => println!("Erreur de parsing : {}", e),
    }
}
```

**Sortie :**

```
Le nombre est : 42
Erreur de parsing : invalid digit found in string
```

### Le Super-pouvoir : L'Opérateur `?`

Gérer chaque erreur avec un `match` peut être verbeux. Rust offre l'opérateur `?` pour propager les erreurs simplement. Si une fonction renvoie un `Result`, `?` fait ceci :

- Si le résultat est `Ok(valeur)`, il "déballe" la valeur et continue l'exécution.
- Si le résultat est `Err(erreur)`, il arrête immédiatement la fonction actuelle et propage l'`Err` à l'appelant.

**Exemple sans `?` :**

```rust
fn get_and_double(s: &str) -> Result<u32, ParseIntError> {
    match s.parse::<u32>() {
        Ok(n) => Ok(n * 2),
        Err(e) => Err(e),
    }
}
```

**Exemple avec `?` (plus idiomatique et lisible) :**

```rust
fn get_and_double_with_q(s: &str) -> Result<u32, ParseIntError> {
    let n = s.parse::<u32>()?; // Si parse() échoue, la fonction s'arrête et renvoie l'erreur
    Ok(n * 2)
}
```

Les deux fonctions sont strictement équivalentes, mais la version avec `?` est beaucoup plus propre.

---

## Conclusion

En adoptant `Option<T>` et `Result<T, E>`, Rust élimine l'une des sources de bugs les plus courantes en programmation. Il transforme les problèmes qui n'apparaîtraient qu'à l'exécution (runtime) en des cas que vous devez gérer logiquement à la **compilation**.

Cette approche rend le code plus sûr, plus explicite et, au final, plus facile à maintenir. C'est un changement de paradigme, mais c'est l'une des raisons pour lesquelles Rust est tant apprécié pour la création de logiciels robustes.
