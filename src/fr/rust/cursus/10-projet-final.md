# Étape 10 : Projet Final

## 📖 Introduction

Félicitations pour avoir parcouru toutes les étapes du cursus ! Il est maintenant temps de mettre en pratique tout ce que vous avez appris dans un projet complet et réaliste. Cette étape propose plusieurs projets intégrant tous les concepts vus précédemment.

## 🎯 Objectifs d'Apprentissage

- Intégrer tous les concepts appris (ownership, traits, lifetimes, concurrence, etc.)
- Structurer un projet Rust complet
- Gérer les erreurs de manière professionnelle
- Écrire du code idiomatique et maintenable
- Tester et documenter votre code

## 🚀 Choix de Projets

Choisissez l'un des projets suivants selon vos intérêts :

### Projet 1 : Gestionnaire de Tâches CLI

**Complexité** : Moyenne

**Fonctionnalités** :
- Ajouter, supprimer, modifier des tâches
- Marquer des tâches comme complétées
- Filtrer par statut, priorité, tag
- Sauvegarder/charger depuis un fichier JSON
- Recherche textuelle dans les tâches

**Concepts utilisés** :
- Structures et enums (Task, Status, Priority)
- Collections (Vec, HashMap)
- Gestion d'erreurs personnalisées
- Sérialisation JSON
- I/O fichiers

---

### Projet 2 : Serveur de Chat Concurrent

**Complexité** : Avancée

**Fonctionnalités** :
- Serveur TCP acceptant plusieurs clients
- Broadcast des messages à tous les clients
- Rooms/channels de discussion
- Commandes spéciales (/nick, /join, /leave)
- Gestion des déconnexions

**Concepts utilisés** :
- Threads et Arc/Mutex
- Channels pour la communication
- TCP sockets
- HashMap pour gérer les clients
- Gestion d'erreurs réseau

---

### Projet 3 : Analyseur de Logs

**Complexité** : Moyenne

**Fonctionnalités** :
- Parser des fichiers de logs
- Statistiques (erreurs, warnings, par heure)
- Filtrage par niveau, pattern, date
- Export des résultats (JSON, CSV)
- Traitement parallèle de gros fichiers

**Concepts utilisés** :
- Parsing et regex
- Collections et agrégation de données
- I/O parallèle
- Traits pour différents formats
- Lifetimes pour les références de strings

---

## 💪 Projet Guidé : Gestionnaire de Tâches

Voici un guide détaillé pour le projet 1. Vous pouvez l'utiliser comme exemple ou créer votre propre version.

### Structure du Projet

```
task_manager/
├── Cargo.toml
└── src/
    ├── main.rs
    ├── task.rs       // Définition de Task
    ├── storage.rs    // Sauvegarde/chargement
    ├── cli.rs        // Interface ligne de commande
    └── error.rs      // Gestion d'erreurs
```

### Étape 1 : Définir les Types de Base

```rust
// src/task.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Status {
    Todo,
    InProgress,
    Done,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
pub enum Priority {
    Low,
    Medium,
    High,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: usize,
    pub title: String,
    pub description: String,
    pub status: Status,
    pub priority: Priority,
    pub tags: Vec<String>,
}

impl Task {
    pub fn new(id: usize, title: String, description: String) -> Self {
        Task {
            id,
            title,
            description,
            status: Status::Todo,
            priority: Priority::Medium,
            tags: Vec::new(),
        }
    }

    pub fn is_completed(&self) -> bool {
        self.status == Status::Done
    }
}
```

### Étape 2 : Gestion d'Erreurs

```rust
// src/error.rs
use std::fmt;
use std::io;

#[derive(Debug)]
pub enum TaskError {
    IoError(io::Error),
    JsonError(serde_json::Error),
    TaskNotFound(usize),
    InvalidInput(String),
}

impl fmt::Display for TaskError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            TaskError::IoError(e) => write!(f, "Erreur I/O: {}", e),
            TaskError::JsonError(e) => write!(f, "Erreur JSON: {}", e),
            TaskError::TaskNotFound(id) => write!(f, "Tâche {} non trouvée", id),
            TaskError::InvalidInput(msg) => write!(f, "Entrée invalide: {}", msg),
        }
    }
}

impl std::error::Error for TaskError {}

impl From<io::Error> for TaskError {
    fn from(error: io::Error) -> Self {
        TaskError::IoError(error)
    }
}

impl From<serde_json::Error> for TaskError {
    fn from(error: serde_json::Error) -> Self {
        TaskError::JsonError(error)
    }
}

pub type Result<T> = std::result::Result<T, TaskError>;
```

### Étape 3 : Gestionnaire de Tâches

```rust
// src/task.rs (suite)
use crate::error::{Result, TaskError};
use std::collections::HashMap;

pub struct TaskManager {
    tasks: HashMap<usize, Task>,
    next_id: usize,
}

impl TaskManager {
    pub fn new() -> Self {
        TaskManager {
            tasks: HashMap::new(),
            next_id: 1,
        }
    }

    pub fn add_task(&mut self, title: String, description: String) -> usize {
        let id = self.next_id;
        let task = Task::new(id, title, description);
        self.tasks.insert(id, task);
        self.next_id += 1;
        id
    }

    pub fn get_task(&self, id: usize) -> Result<&Task> {
        self.tasks
            .get(&id)
            .ok_or(TaskError::TaskNotFound(id))
    }

    pub fn update_status(&mut self, id: usize, status: Status) -> Result<()> {
        self.tasks
            .get_mut(&id)
            .ok_or(TaskError::TaskNotFound(id))?
            .status = status;
        Ok(())
    }

    pub fn delete_task(&mut self, id: usize) -> Result<()> {
        self.tasks
            .remove(&id)
            .ok_or(TaskError::TaskNotFound(id))?;
        Ok(())
    }

    pub fn list_tasks(&self) -> Vec<&Task> {
        let mut tasks: Vec<_> = self.tasks.values().collect();
        tasks.sort_by_key(|t| t.id);
        tasks
    }

    pub fn filter_by_status(&self, status: Status) -> Vec<&Task> {
        self.tasks
            .values()
            .filter(|t| t.status == status)
            .collect()
    }
}
```

### Étape 4 : Persistance

```rust
// src/storage.rs
use crate::error::Result;
use crate::task::{Task, TaskManager};
use std::fs;
use std::path::Path;

pub fn save_tasks(manager: &TaskManager, path: &Path) -> Result<()> {
    let tasks: Vec<_> = manager.list_tasks();
    let json = serde_json::to_string_pretty(&tasks)?;
    fs::write(path, json)?;
    Ok(())
}

pub fn load_tasks(path: &Path) -> Result<TaskManager> {
    if !path.exists() {
        return Ok(TaskManager::new());
    }

    let json = fs::read_to_string(path)?;
    let tasks: Vec<Task> = serde_json::from_str(&json)?;

    let mut manager = TaskManager::new();
    for task in tasks {
        manager.tasks.insert(task.id, task);
        if task.id >= manager.next_id {
            manager.next_id = task.id + 1;
        }
    }

    Ok(manager)
}
```

### Étape 5 : Interface CLI

```rust
// src/cli.rs
use crate::error::Result;
use crate::task::{Priority, Status, TaskManager};
use std::io::{self, Write};

pub fn run(manager: &mut TaskManager) -> Result<()> {
    loop {
        print_menu();

        let mut input = String::new();
        io::stdin().read_line(&mut input)?;

        match input.trim() {
            "1" => add_task(manager)?,
            "2" => list_tasks(manager),
            "3" => update_task(manager)?,
            "4" => delete_task(manager)?,
            "5" => break,
            _ => println!("Commande invalide"),
        }
    }

    Ok(())
}

fn print_menu() {
    println!("\n=== Gestionnaire de Tâches ===");
    println!("1. Ajouter une tâche");
    println!("2. Lister les tâches");
    println!("3. Mettre à jour une tâche");
    println!("4. Supprimer une tâche");
    println!("5. Quitter");
    print!("> ");
    io::stdout().flush().unwrap();
}

fn add_task(manager: &mut TaskManager) -> Result<()> {
    println!("Titre:");
    let title = read_line()?;

    println!("Description:");
    let description = read_line()?;

    let id = manager.add_task(title, description);
    println!("Tâche {} créée avec succès!", id);

    Ok(())
}

fn list_tasks(manager: &TaskManager) {
    let tasks = manager.list_tasks();

    if tasks.is_empty() {
        println!("Aucune tâche");
        return;
    }

    for task in tasks {
        println!(
            "[{}] {} - {:?} ({:?})",
            task.id, task.title, task.status, task.priority
        );
    }
}

fn read_line() -> Result<String> {
    let mut input = String::new();
    io::stdin().read_line(&mut input)?;
    Ok(input.trim().to_string())
}

// ... autres fonctions
```

### Étape 6 : Main

```rust
// src/main.rs
mod cli;
mod error;
mod storage;
mod task;

use std::path::Path;

fn main() {
    let path = Path::new("tasks.json");

    let mut manager = storage::load_tasks(path)
        .unwrap_or_else(|e| {
            eprintln!("Erreur de chargement: {}", e);
            task::TaskManager::new()
        });

    if let Err(e) = cli::run(&mut manager) {
        eprintln!("Erreur: {}", e);
    }

    if let Err(e) = storage::save_tasks(&manager, path) {
        eprintln!("Erreur de sauvegarde: {}", e);
    }
}
```

## ✅ Checklist de Qualité

Avant de considérer votre projet terminé :

### Code
- [ ] Le code compile sans warnings
- [ ] Les erreurs sont gérées proprement
- [ ] Pas de `unwrap()` dans le code de production
- [ ] Les noms de variables/fonctions sont clairs
- [ ] Le code suit les conventions Rust (rustfmt)

### Tests
- [ ] Tests unitaires pour les fonctions clés
- [ ] Tests d'intégration pour les scénarios complets
- [ ] Tests pour les cas d'erreur

### Documentation
- [ ] Commentaires de documentation (`///`) pour les fonctions publiques
- [ ] README avec instructions d'utilisation
- [ ] Exemples de code fonctionnels

### Architecture
- [ ] Séparation des responsabilités
- [ ] Modules bien organisés
- [ ] Pas de code dupliqué
- [ ] Utilisation appropriée des traits

## 🎯 Extensions Possibles

Améliorez votre projet avec ces fonctionnalités :

1. **Recherche textuelle** : Rechercher dans les titres/descriptions
2. **Dates d'échéance** : Ajouter des deadlines et des rappels
3. **Import/Export** : Support de plusieurs formats (CSV, Markdown)
4. **Couleurs** : Interface colorée avec `colored` ou `termion`
5. **Sous-tâches** : Tâches avec hiérarchie
6. **Statistiques** : Graphes de progression
7. **Sync cloud** : Synchronisation avec un serveur distant
8. **CLI avancé** : Utiliser `clap` pour les arguments
9. **TUI** : Interface terminal interactive avec `tui-rs`
10. **Web API** : Exposer une API REST avec `actix-web`

## 🏆 Conclusion

Vous avez maintenant toutes les compétences pour créer des applications Rust robustes et performantes ! Voici quelques suggestions pour continuer :

### Prochaines Étapes

1. **Contribuer à l'open source** : Trouvez un projet Rust sur GitHub
2. **Apprendre async/await** : Pour la programmation asynchrone
3. **Explorer les crates** : Découvrez l'écosystème (tokio, serde, regex, etc.)
4. **Rust avancé** : Macros, unsafe, optimisations
5. **Domaines spécialisés** : Web (actix, rocket), systèmes, embarqué, WASM

### Ressources

- [The Rust Book](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings](https://github.com/rust-lang/rustlings) - Exercices interactifs
- [This Week in Rust](https://this-week-in-rust.org/) - Actualités
- [r/rust](https://reddit.com/r/rust) - Communauté

Félicitations pour avoir terminé ce cursus ! 🦀🎉

N'oubliez pas : l'apprentissage de Rust est un voyage, pas une destination. Continuez à pratiquer, à lire du code, et à construire des projets. La courbe d'apprentissage est raide au début, mais les bénéfices sont immenses.

**Happy Coding!** 🚀
