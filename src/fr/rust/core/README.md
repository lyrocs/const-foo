---
title: Core
date: 2025-09-25
icon: atom
index: true
comment: false
breadcrumb: false
pageInfo: false
editLink: false
lastUpdated: false
prev: false
next: false
category:
  - Rust
---

## `Arc<Mutex<T>>` : Le Duo Gagnant de la Concurrence en Rust

Cet article explique pourquoi l'association d'un Arc (compteur de références atomique) et d'un Mutex est le modèle standard en Rust pour partager des données modifiables entre plusieurs threads de manière totalement sûre, en prévenant les data races à la compilation.

- [Voir l'article](./arc-mutex.md)

## tokio::spawn : Lancez des Tâches Asynchrones Sans Crainte

Un guide pratique sur la fonction tokio::spawn, expliquant comment elle permet d'exécuter du code asynchrone en arrière-plan (tâches "légères") sans bloquer le thread principal, et comment elle est au cœur des applications réseau performantes en Rust.

- [Voir l'article](./spawn.md)

## Result et Option : Arrêtez de Penser en Termes de null

Cet article explore les types enum `Result<T, E>` et `Option<T>`, qui sont au centre de la gestion d'erreurs et de l'absence de valeur en Rust. Il montre comment leur utilisation rend le code plus robuste et explicite en éliminant les erreurs liées aux pointeurs nuls.

- [Voir l'article](./option.md)

## Les "Traits" : Comment Rust Réalise le Polymorphisme

Une plongée dans le système de traits, l'équivalent des interfaces dans d'autres langages. L'article explique comment les traits permettent de définir des comportements partagés pour différentes structures de données, rendant le code abstrait, flexible et réutilisable.

- [Voir l'article](./traits.md)

## Les Durées de Vie ('Lifetimes') : Comprendre le Super-pouvoir du Compilateur

Cet article démystifie l'un des concepts les plus uniques (et redoutés) de Rust. Il explique, avec des exemples simples, comment les annotations de durée de vie permettent au compilateur de garantir la validité des références et d'empêcher les dangling pointers sans avoir besoin d'un garbage collector.

- [Voir l'article](./lifetimes.md)

## no_std : Rust sans la Bibliothèque Standard

Découvrez comment utiliser Rust dans des environnements sans système d'exploitation : microcontrôleurs, noyaux d'OS, systèmes embarqués. Cet article explique comment programmer avec uniquement `core` et `alloc`, gérer les paniques, et créer des applications ultra-légères pour le bare-metal.

- [Voir l'article](./no-std.md)
