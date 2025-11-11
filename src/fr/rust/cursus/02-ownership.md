# Étape 2 : Ownership et Borrowing

## 📖 Introduction

L'**ownership** (propriété) est le concept le plus unique et fondamental de Rust. C'est ce qui permet à Rust de garantir la sécurité mémoire sans garbage collector. Au début, cela peut sembler contraignant, mais c'est ce qui rend Rust si puissant et sûr.

## 🎯 Objectifs d'Apprentissage

- Comprendre les trois règles de l'ownership
- Maîtriser le concept de move (déplacement)
- Utiliser les références immutables et mutables
- Comprendre le borrowing et ses règles
- Savoir quand utiliser `clone()` vs références

## 📚 Concepts Clés

### Les Trois Règles de l'Ownership

1. Chaque valeur en Rust a un **propriétaire** (owner)
2. Il ne peut y avoir qu'**un seul propriétaire** à la fois
3. Quand le propriétaire sort du scope, la valeur est **libérée** (dropped)

### Move (Déplacement)

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;  // s1 est "déplacé" vers s2

    // println!("{}", s1);  // ❌ Erreur ! s1 n'est plus valide
    println!("{}", s2);     // ✅ OK
}
```

### Clone (Copie Profonde)

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();  // Copie complète

    println!("s1 = {}, s2 = {}", s1, s2);  // ✅ Les deux sont valides
}
```

### Références (Borrowing)

Au lieu de transférer la propriété, on peut **emprunter** une référence :

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);  // Emprunte s1 (ne le déplace pas)

    println!("La longueur de '{}' est {}.", s1, len);  // ✅ s1 est toujours valide
}

fn calculate_length(s: &String) -> usize {
    s.len()
}  // s sort du scope, mais ne possède pas la String, donc rien n'est libéré
```

### Références Mutables

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);  // Emprunte s de manière mutable

    println!("{}", s);  // Affiche "hello, world"
}

fn change(s: &mut String) {
    s.push_str(", world");
}
```

### Règles du Borrowing

1. Vous pouvez avoir soit :
   - **Une seule référence mutable** : `&mut T`
   - **Plusieurs références immutables** : `&T`
2. Mais jamais les deux en même temps dans le même scope
3. Les références doivent toujours être valides

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s;     // ✅ OK
    let r2 = &s;     // ✅ OK
    println!("{} et {}", r1, r2);
    // r1 et r2 ne sont plus utilisées après

    let r3 = &mut s; // ✅ OK maintenant
    r3.push_str("!");
}
```

## 💪 Exercices

### Exercice 1 : Comprendre les Moves (Facile)

Corrigez ce code pour qu'il compile :

```rust
fn main() {
    let s1 = String::from("Rust");
    print_string(s1);
    print_string(s1);  // ❌ Erreur ! s1 a été déplacé
}

fn print_string(s: String) {
    println!("{}", s);
}
```

<details>
<summary>💡 Solution</summary>

```rust
// Solution 1 : Utiliser des références
fn main() {
    let s1 = String::from("Rust");
    print_string(&s1);
    print_string(&s1);  // ✅ OK, on emprunte seulement
}

fn print_string(s: &String) {
    println!("{}", s);
}

// Solution 2 : Cloner
fn main() {
    let s1 = String::from("Rust");
    print_string(s1.clone());
    print_string(s1);  // ✅ OK, s1 est toujours valide
}

fn print_string(s: String) {
    println!("{}", s);
}
```
</details>

---

### Exercice 2 : Modifier une String (Moyen)

Écrivez une fonction qui ajoute un point d'exclamation à la fin d'une String.

```rust
fn add_exclamation(/* TODO: paramètres */) {
    // TODO: Ajoutez un '!' à la fin de la string
}

fn main() {
    let mut message = String::from("Bonjour");
    add_exclamation(/* TODO */);
    println!("{}", message);  // Devrait afficher "Bonjour!"
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn add_exclamation(s: &mut String) {
    s.push('!');
}

fn main() {
    let mut message = String::from("Bonjour");
    add_exclamation(&mut message);
    println!("{}", message);  // Affiche "Bonjour!"
}
```
</details>

---

### Exercice 3 : Premier et Dernier (Moyen)

Écrivez une fonction qui retourne le premier et le dernier caractère d'une string.

```rust
fn first_and_last(s: &String) -> (char, char) {
    // TODO: Retournez le premier et dernier caractère
    // Indice : utilisez .chars(), .next() et .last()
}

fn main() {
    let text = String::from("Rust");
    let (first, last) = first_and_last(&text);
    println!("Premier: {}, Dernier: {}", first, last);
    // Devrait afficher : Premier: R, Dernier: t
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn first_and_last(s: &String) -> (char, char) {
    let first = s.chars().next().unwrap();
    let last = s.chars().last().unwrap();
    (first, last)
}

fn main() {
    let text = String::from("Rust");
    let (first, last) = first_and_last(&text);
    println!("Premier: {}, Dernier: {}", first, last);
}
```
</details>

---

### Exercice 4 : Swap de Strings (Difficile)

Écrivez une fonction qui échange le contenu de deux Strings.

```rust
fn swap_strings(/* TODO: paramètres */) {
    // TODO: Échangez le contenu de a et b
}

fn main() {
    let mut a = String::from("Hello");
    let mut b = String::from("World");

    println!("Avant: a = {}, b = {}", a, b);
    swap_strings(/* TODO */);
    println!("Après: a = {}, b = {}", a, b);
    // Devrait afficher : Après: a = World, b = Hello
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn swap_strings(a: &mut String, b: &mut String) {
    std::mem::swap(a, b);
}

// Ou manuellement :
fn swap_strings_manual(a: &mut String, b: &mut String) {
    let temp = a.clone();
    *a = b.clone();
    *b = temp;
}

fn main() {
    let mut a = String::from("Hello");
    let mut b = String::from("World");

    println!("Avant: a = {}, b = {}", a, b);
    swap_strings(&mut a, &mut b);
    println!("Après: a = {}, b = {}", a, b);
}
```
</details>

---

### Exercice 5 : Compter les Mots (Difficile)

Créez une fonction qui compte le nombre de mots dans une string (séparés par des espaces).

```rust
fn count_words(s: &String) -> usize {
    // TODO: Comptez les mots
}

fn main() {
    let text = String::from("Rust est un langage génial");
    let count = count_words(&text);
    println!("Nombre de mots : {}", count);  // Devrait afficher : 5
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn count_words(s: &String) -> usize {
    s.split_whitespace().count()
}

// Ou manuellement :
fn count_words_manual(s: &String) -> usize {
    if s.is_empty() {
        return 0;
    }

    let mut count = 0;
    let mut in_word = false;

    for c in s.chars() {
        if c.is_whitespace() {
            in_word = false;
        } else if !in_word {
            in_word = true;
            count += 1;
        }
    }

    count
}

fn main() {
    let text = String::from("Rust est un langage génial");
    let count = count_words(&text);
    println!("Nombre de mots : {}", count);
}
```
</details>

---

### Exercice 6 : Plus Long Mot (Difficile)

Trouvez le mot le plus long dans une string.

```rust
fn longest_word(s: &String) -> String {
    // TODO: Trouvez et retournez le mot le plus long
}

fn main() {
    let text = String::from("Rust est fantastique");
    let longest = longest_word(&text);
    println!("Mot le plus long : {}", longest);  // Devrait afficher : fantastique
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn longest_word(s: &String) -> String {
    s.split_whitespace()
        .max_by_key(|word| word.len())
        .unwrap_or("")
        .to_string()
}

fn main() {
    let text = String::from("Rust est fantastique");
    let longest = longest_word(&text);
    println!("Mot le plus long : {}", longest);
}
```
</details>

## 🎯 Défi Bonus : Palindrome

Écrivez une fonction qui vérifie si une string est un palindrome (se lit de la même manière dans les deux sens). Ignorez les espaces et la casse.

```rust
fn is_palindrome(s: &String) -> bool {
    // TODO: Vérifiez si c'est un palindrome
}

fn main() {
    let test1 = String::from("kayak");
    let test2 = String::from("A man a plan a canal Panama");
    let test3 = String::from("hello");

    println!("{} : {}", test1, is_palindrome(&test1));  // true
    println!("{} : {}", test2, is_palindrome(&test2));  // true
    println!("{} : {}", test3, is_palindrome(&test3));  // false
}
```

## ✅ Points de Vérification

Avant de passer à l'étape suivante, assurez-vous de :
- [ ] Comprendre les trois règles de l'ownership
- [ ] Savoir quand une valeur est déplacée (move) vs copiée
- [ ] Maîtriser la différence entre `&T` et `&mut T`
- [ ] Comprendre les règles du borrowing
- [ ] Savoir quand utiliser `clone()` est approprié
- [ ] Avoir réussi tous les exercices

## 📖 Pour Aller Plus Loin

- Le trait `Copy` pour les types qui se copient au lieu de se déplacer
- Le trait `Drop` pour personnaliser le nettoyage
- Les slices : `&str` et `&[T]`
- Le déréférencement avec `*`

Prêt pour l'étape 3 ? Direction [Structures et Enums](./03-structures-enums.md) ! 🚀
