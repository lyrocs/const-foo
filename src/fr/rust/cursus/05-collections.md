# Étape 5 : Collections

## 📖 Introduction

Les collections sont des structures de données qui peuvent contenir plusieurs valeurs. Contrairement aux tableaux, elles sont allouées sur le heap et peuvent grandir ou rétrécir dynamiquement. Les trois collections principales sont `Vec<T>`, `HashMap<K, V>` et `String`.

## 🎯 Objectifs d'Apprentissage

- Maîtriser les vecteurs (`Vec<T>`)
- Utiliser les HashMaps pour stocker des paires clé-valeur
- Comprendre String et les différences avec &str
- Manipuler les collections avec les méthodes d'itérateur
- Connaître les patterns d'utilisation courants

## 📚 Concepts Clés

### Vec&lt;T&gt; - Vecteurs

```rust
fn main() {
    // Création
    let mut v = Vec::new();
    v.push(1);
    v.push(2);
    v.push(3);

    // Ou avec la macro vec!
    let v2 = vec![1, 2, 3, 4, 5];

    // Accès
    let third = &v2[2];        // Panic si hors limites
    let third = v2.get(2);     // Retourne Option<&T>

    // Itération
    for i in &v2 {
        println!("{}", i);
    }

    // Itération mutable
    for i in &mut v {
        *i *= 2;
    }
}
```

### HashMap&lt;K, V&gt;

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Red"), 50);

    // Accès
    let team = String::from("Blue");
    let score = scores.get(&team);  // Option<&V>

    // Itération
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }

    // Insertion conditionnelle
    scores.entry(String::from("Yellow")).or_insert(50);

    // Mise à jour basée sur l'ancienne valeur
    let count = scores.entry(String::from("Blue")).or_insert(0);
    *count += 10;
}
```

### String

```rust
fn main() {
    // Création
    let mut s = String::new();
    let s1 = "initial".to_string();
    let s2 = String::from("initial");

    // Ajout
    s.push_str("hello");
    s.push('!');

    // Concaténation
    let s3 = s1 + &s2;  // s1 est déplacé
    let s4 = format!("{} {}", s2, s3);

    // Itération
    for c in s.chars() {
        println!("{}", c);
    }

    for b in s.bytes() {
        println!("{}", b);
    }
}
```

## 💪 Exercices

### Exercice 1 : Moyenne d'un Vecteur (Facile)

Calculez la moyenne des nombres dans un vecteur.

```rust
fn average(numbers: &Vec<i32>) -> f64 {
    // TODO
}

fn main() {
    let nums = vec![10, 20, 30, 40, 50];
    println!("Moyenne: {}", average(&nums));  // 30.0
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn average(numbers: &Vec<i32>) -> f64 {
    if numbers.is_empty() {
        return 0.0;
    }

    let sum: i32 = numbers.iter().sum();
    sum as f64 / numbers.len() as f64
}

fn main() {
    let nums = vec![10, 20, 30, 40, 50];
    println!("Moyenne: {}", average(&nums));
}
```
</details>

---

### Exercice 2 : Filtrer les Pairs (Facile)

Retournez un nouveau vecteur contenant uniquement les nombres pairs.

```rust
fn filter_even(numbers: &Vec<i32>) -> Vec<i32> {
    // TODO
}

fn main() {
    let nums = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let evens = filter_even(&nums);
    println!("{:?}", evens);  // [2, 4, 6, 8, 10]
}
```

<details>
<summary>💡 Solution</summary>

```rust
fn filter_even(numbers: &Vec<i32>) -> Vec<i32> {
    numbers.iter()
        .filter(|&&x| x % 2 == 0)
        .copied()
        .collect()
}

// Ou manuellement :
fn filter_even_manual(numbers: &Vec<i32>) -> Vec<i32> {
    let mut result = Vec::new();
    for &num in numbers {
        if num % 2 == 0 {
            result.push(num);
        }
    }
    result
}

fn main() {
    let nums = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let evens = filter_even(&nums);
    println!("{:?}", evens);
}
```
</details>

---

### Exercice 3 : Compteur de Mots (Moyen)

Comptez la fréquence de chaque mot dans une phrase.

```rust
use std::collections::HashMap;

fn word_frequency(text: &str) -> HashMap<String, usize> {
    // TODO
}

fn main() {
    let text = "le chat et le chien jouent avec le chat";
    let freq = word_frequency(text);

    for (word, count) in &freq {
        println!("{}: {}", word, count);
    }
    // le: 3, chat: 2, et: 1, chien: 1, jouent: 1, avec: 1
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::collections::HashMap;

fn word_frequency(text: &str) -> HashMap<String, usize> {
    let mut map = HashMap::new();

    for word in text.split_whitespace() {
        let count = map.entry(word.to_string()).or_insert(0);
        *count += 1;
    }

    map
}

fn main() {
    let text = "le chat et le chien jouent avec le chat";
    let freq = word_frequency(text);

    for (word, count) in &freq {
        println!("{}: {}", word, count);
    }
}
```
</details>

---

### Exercice 4 : Dédupliquer un Vecteur (Moyen)

Supprimez les doublons d'un vecteur en gardant l'ordre d'apparition.

```rust
fn deduplicate(numbers: &Vec<i32>) -> Vec<i32> {
    // TODO
}

fn main() {
    let nums = vec![1, 2, 2, 3, 4, 4, 4, 5, 1, 6];
    let unique = deduplicate(&nums);
    println!("{:?}", unique);  // [1, 2, 3, 4, 5, 6]
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::collections::HashSet;

fn deduplicate(numbers: &Vec<i32>) -> Vec<i32> {
    let mut seen = HashSet::new();
    let mut result = Vec::new();

    for &num in numbers {
        if seen.insert(num) {  // insert retourne true si la valeur était absente
            result.push(num);
        }
    }

    result
}

fn main() {
    let nums = vec![1, 2, 2, 3, 4, 4, 4, 5, 1, 6];
    let unique = deduplicate(&nums);
    println!("{:?}", unique);
}
```
</details>

---

### Exercice 5 : Grouper par Longueur (Difficile)

Groupez les mots par leur longueur dans une HashMap.

```rust
use std::collections::HashMap;

fn group_by_length(words: &[&str]) -> HashMap<usize, Vec<String>> {
    // TODO
}

fn main() {
    let words = ["rust", "go", "python", "c", "java", "javascript"];
    let grouped = group_by_length(&words);

    for (len, words) in &grouped {
        println!("{}: {:?}", len, words);
    }
    // 1: ["c"]
    // 2: ["go"]
    // 4: ["rust", "java"]
    // 6: ["python"]
    // 10: ["javascript"]
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::collections::HashMap;

fn group_by_length(words: &[&str]) -> HashMap<usize, Vec<String>> {
    let mut map = HashMap::new();

    for word in words {
        let len = word.len();
        map.entry(len)
            .or_insert_with(Vec::new)
            .push(word.to_string());
    }

    map
}

fn main() {
    let words = ["rust", "go", "python", "c", "java", "javascript"];
    let grouped = group_by_length(&words);

    for (len, words) in &grouped {
        println!("{}: {:?}", len, words);
    }
}
```
</details>

---

### Exercice 6 : Médiane et Mode (Difficile)

Calculez la médiane et le mode (valeur la plus fréquente) d'un vecteur.

```rust
fn median_and_mode(numbers: &Vec<i32>) -> (f64, i32) {
    // TODO: Retourne (médiane, mode)
}

fn main() {
    let nums = vec![1, 2, 2, 3, 3, 3, 4, 5];
    let (median, mode) = median_and_mode(&nums);
    println!("Médiane: {}, Mode: {}", median, mode);
    // Médiane: 3.0, Mode: 3
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::collections::HashMap;

fn median_and_mode(numbers: &Vec<i32>) -> (f64, i32) {
    if numbers.is_empty() {
        return (0.0, 0);
    }

    // Médiane
    let mut sorted = numbers.clone();
    sorted.sort();
    let mid = sorted.len() / 2;
    let median = if sorted.len() % 2 == 0 {
        (sorted[mid - 1] + sorted[mid]) as f64 / 2.0
    } else {
        sorted[mid] as f64
    };

    // Mode
    let mut frequency = HashMap::new();
    for &num in numbers {
        *frequency.entry(num).or_insert(0) += 1;
    }

    let mode = frequency
        .iter()
        .max_by_key(|(_, &count)| count)
        .map(|(&num, _)| num)
        .unwrap_or(0);

    (median, mode)
}

fn main() {
    let nums = vec![1, 2, 2, 3, 3, 3, 4, 5];
    let (median, mode) = median_and_mode(&nums);
    println!("Médiane: {}, Mode: {}", median, mode);
}
```
</details>

## 🎯 Défi Bonus : Analyseur de Texte

Créez un programme qui analyse un texte et retourne :
- Le nombre total de mots
- Le nombre de mots uniques
- Les 5 mots les plus fréquents
- La longueur moyenne des mots

## ✅ Points de Vérification

Avant de passer à l'étape suivante, assurez-vous de :
- [ ] Savoir créer et manipuler des Vec
- [ ] Comprendre les méthodes d'itérateur courantes
- [ ] Pouvoir utiliser HashMap pour stocker des données
- [ ] Connaître les différences entre String et &str
- [ ] Maîtriser les patterns entry/or_insert
- [ ] Avoir réussi tous les exercices

## 📖 Pour Aller Plus Loin

- `HashSet` pour les ensembles
- `BTreeMap` et `BTreeSet` pour les collections ordonnées
- Les méthodes d'itérateur avancées : `fold`, `scan`, `flat_map`
- Les slices et leurs méthodes

Prêt pour l'étape 6 ? Direction [Gestion d'Erreurs Avancée](./06-erreurs-avancees.md) ! 🚀
