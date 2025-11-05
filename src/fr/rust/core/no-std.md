# no_std : Rust sans la Bibliothèque Standard

Quand vous développez en Rust, vous utilisez par défaut la bibliothèque standard (`std`), qui fournit des fonctionnalités essentielles : collections, gestion de fichiers, threads, réseau, etc. Mais que se passe-t-il si vous programmez pour un microcontrôleur qui n'a que quelques kilooctets de mémoire, ou un système d'exploitation que vous créez de zéro ?

Dans ces environnements contraints, la bibliothèque standard n'est pas disponible (ou trop lourde). C'est là qu'intervient **`#![no_std]`** : un mode où Rust ne dépend que du strict minimum.

## Qu'est-ce que `no_std` ?

`no_std` est un attribut que vous placez au début de votre fichier ou crate pour dire au compilateur : "Je ne veux pas de la bibliothèque standard."

```rust
#![no_std]

fn main() {
    // Erreur : println! fait partie de std
    // println!("Hello, world!");
}
```

En mode `no_std`, vous perdez l'accès à :

- **Entrées/Sorties** : `println!`, `File`, `stdin`, etc.
- **Collections allouées** : `Vec`, `String`, `HashMap` (sauf si vous utilisez `alloc`).
- **Threading et réseau** : `std::thread`, `std::net`, etc.
- **Toute fonctionnalité dépendant du système d'exploitation**.

## Pourquoi utiliser `no_std` ?

### 1. **Programmation embarquée**

Sur un microcontrôleur comme un ARM Cortex-M, il n'y a pas de système d'exploitation. Pas de heap géré automatiquement, pas de threads. Vous programmez "à nu" sur le matériel.

```rust
#![no_std]
#![no_main]

use panic_halt as _; // Gestion minimale de la panique

#[no_mangle]
pub extern "C" fn _start() -> ! {
    // Point d'entrée pour un système embarqué
    loop {
        // Votre logique de contrôle matériel
    }
}
```

### 2. **Systèmes d'exploitation (OS kernels)**

Quand vous écrivez un noyau de système d'exploitation, vous ne pouvez pas dépendre de `std`... car c'est vous qui implémentez les fonctionnalités de base !

### 3. **Optimisation extrême**

Pour des binaires ultra-légers, `no_std` permet de garder une empreinte mémoire minimale.

### 4. **WebAssembly (WASM)**

Dans certains cas, vous voulez produire du WASM le plus léger possible, sans inclure toute la bibliothèque standard.

## Ce qui reste disponible : `core`

En mode `no_std`, vous avez toujours accès à la bibliothèque **`core`**. C'est le cœur de Rust, sans dépendance au système d'exploitation :

- Les types primitifs : `i32`, `u64`, `bool`, `char`, etc.
- Les traits fondamentaux : `Copy`, `Clone`, `Iterator`, `Debug`, etc.
- Les types `Option<T>` et `Result<T, E>`
- Les macros de base (mais pas `println!`)
- Les références, slices, et tout ce qui ne nécessite pas d'allocation

**Exemple :**

```rust
#![no_std]

// On peut toujours utiliser Option et Result
fn divide(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

fn compute() -> Result<i32, &'static str> {
    let result = divide(10, 2);
    match result {
        Some(val) => Ok(val),
        None => Err("Division par zéro"),
    }
}
```

## Ajouter `alloc` : Allocation mémoire sans OS

Si vous avez accès à un heap (tas) mais pas à un OS complet, vous pouvez utiliser la crate **`alloc`**. Elle fournit :

- `Vec<T>`
- `String`
- `Box<T>`
- `Arc<T>` et `Rc<T>`

Pour utiliser `alloc`, vous devez fournir un **allocateur global** :

```rust
#![no_std]

extern crate alloc;

use alloc::vec::Vec;
use alloc::string::String;

// Vous devez fournir un allocateur (ici, un allocateur custom ou embedded-alloc)
#[global_allocator]
static ALLOCATOR: MyAllocator = MyAllocator;

fn main() {
    let mut v = Vec::new();
    v.push(42);
    v.push(84);

    let s = String::from("Hello from no_std with alloc!");
}

// Allocateur minimal (exemple simplifié)
struct MyAllocator;

unsafe impl core::alloc::GlobalAlloc for MyAllocator {
    unsafe fn alloc(&self, layout: core::alloc::Layout) -> *mut u8 {
        // Votre implémentation d'allocation
        core::ptr::null_mut()
    }

    unsafe fn dealloc(&self, ptr: *mut u8, layout: core::alloc::Layout) {
        // Votre implémentation de libération
    }
}
```

Sur les microcontrôleurs, des crates comme **`embedded-alloc`** ou **`linked_list_allocator`** fournissent des allocateurs prêts à l'emploi.

## Gérer les paniques en `no_std`

En mode `no_std`, il n'y a pas de gestionnaire de panique par défaut. Vous devez en fournir un :

```rust
#![no_std]

use core::panic::PanicInfo;

#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    // En mode embarqué, on peut boucler indéfiniment ou redémarrer
    loop {}
}
```

Des crates comme `panic-halt` ou `panic-abort` fournissent des gestionnaires simples :

```rust
#![no_std]

use panic_halt as _; // Stoppe le programme en cas de panique
```

## Quand `no_std` n'est PAS nécessaire

Si vous développez :

- Une application CLI ou serveur classique
- Un outil de bureau
- Une API web avec Actix ou Axum

...alors vous n'avez **pas besoin** de `no_std`. La bibliothèque standard est là pour vous simplifier la vie.

## Exemple complet : Programme embarqué minimal

Voici un exemple typique pour un microcontrôleur ARM :

```rust
#![no_std]
#![no_main]

use panic_halt as _;
use cortex_m_rt::entry; // Crate pour le runtime ARM Cortex-M

#[entry]
fn main() -> ! {
    // Initialiser le matériel
    let peripherals = unsafe {
        // Accès aux périphériques matériels
        cortex_m::Peripherals::steal()
    };

    loop {
        // Votre code de contrôle (allumer une LED, lire un capteur, etc.)
    }
}
```

## Les étapes pour démarrer en `no_std`

1. **Déclarez `#![no_std]`** au début de votre crate
2. **Ajoutez `#![no_main]`** si vous n'utilisez pas la fonction `main` standard
3. **Fournissez un panic handler** avec `#[panic_handler]` ou une crate comme `panic-halt`
4. **Utilisez `core`** pour les fonctionnalités de base
5. **(Optionnel)** Ajoutez `alloc` si vous avez besoin de `Vec`, `String`, etc.
6. **(Embarqué)** Utilisez des crates comme `embedded-hal` pour l'abstraction matérielle

## Conclusion

`no_std` est un super-pouvoir de Rust qui permet d'utiliser le langage dans des environnements où aucun autre langage de haut niveau n'irait : microcontrôleurs, noyaux d'OS, bootloaders, etc.

En mode `no_std`, vous perdez le confort de la bibliothèque standard, mais vous gagnez :

- Un contrôle total sur le matériel
- Une empreinte mémoire minimale
- La portabilité sur des plateformes exotiques

Rust reste **sûr**, **rapide** et **expressif** même sans `std`. C'est cette flexibilité qui fait de Rust un choix de prédilection pour la programmation systèmes et embarquée moderne.
