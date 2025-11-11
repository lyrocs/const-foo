# Étape 9 : Concurrence

## 📖 Introduction

Rust rend la programmation concurrente sûre ! Grâce au système de types et d'ownership, le compilateur vous empêche de créer des race conditions. Cette étape explore les threads, le partage de données avec `Arc` et `Mutex`, et les channels pour la communication entre threads.

## 🎯 Objectifs d'Apprentissage

- Créer et gérer des threads
- Partager des données avec `Arc<T>` (Atomic Reference Counting)
- Synchroniser l'accès avec `Mutex<T>` et `RwLock<T>`
- Communiquer entre threads avec les channels
- Comprendre les garanties de sécurité de Rust
- Éviter les deadlocks et race conditions

## 📚 Concepts Clés

### Créer des Threads

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("Thread: {}", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("Main: {}", i);
        thread::sleep(Duration::from_millis(1));
    }

    handle.join().unwrap();  // Attendre la fin du thread
}
```

### Arc&lt;T&gt; - Partage entre Threads

`Arc` (Atomic Reference Counted) permet de partager la propriété entre plusieurs threads :

```rust
use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![1, 2, 3, 4, 5]);

    let mut handles = vec![];

    for i in 0..3 {
        let data = Arc::clone(&data);  // Clone le compteur, pas les données

        let handle = thread::spawn(move || {
            println!("Thread {}: {:?}", i, data);
        });

        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
}
```

### Mutex&lt;T&gt; - Exclusion Mutuelle

`Mutex` permet de modifier des données partagées de manière sûre :

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);

        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });

        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Résultat: {}", *counter.lock().unwrap());  // 10
}
```

### Channels - Communication entre Threads

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("Hello");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("Reçu: {}", received);
}
```

### RwLock&lt;T&gt; - Lecture/Écriture

Permet plusieurs lecteurs OU un seul écrivain :

```rust
use std::sync::{Arc, RwLock};
use std::thread;

fn main() {
    let data = Arc::new(RwLock::new(5));

    // Lecteurs
    let data1 = Arc::clone(&data);
    let reader1 = thread::spawn(move || {
        let num = data1.read().unwrap();
        println!("Lecteur 1: {}", *num);
    });

    // Écrivain
    let data2 = Arc::clone(&data);
    let writer = thread::spawn(move || {
        let mut num = data2.write().unwrap();
        *num += 1;
    });

    reader1.join().unwrap();
    writer.join().unwrap();
}
```

## 💪 Exercices

### Exercice 1 : Compteur Concurrent (Facile)

Créez un compteur partagé entre plusieurs threads.

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = // TODO: Arc<Mutex<i32>>
    let mut handles = vec![];

    for _ in 0..5 {
        // TODO: Créez 5 threads qui incrémentent le compteur 100 fois chacun
    }

    // TODO: Attendez tous les threads

    println!("Compteur: {}", *counter.lock().unwrap());
    // Devrait afficher 500
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..5 {
        let counter = Arc::clone(&counter);

        let handle = thread::spawn(move || {
            for _ in 0..100 {
                let mut num = counter.lock().unwrap();
                *num += 1;
            }
        });

        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Compteur: {}", *counter.lock().unwrap());
}
```
</details>

---

### Exercice 2 : Producer-Consumer (Moyen)

Implémentez le pattern producer-consumer avec des channels.

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    // Producer
    thread::spawn(move || {
        for i in 1..=5 {
            // TODO: Envoyer des messages
            thread::sleep(Duration::from_millis(100));
        }
    });

    // Consumer
    for received in rx {
        println!("Reçu: {}", received);
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    // Producer
    thread::spawn(move || {
        let messages = vec![
            "Premier",
            "Deuxième",
            "Troisième",
            "Quatrième",
            "Cinquième",
        ];

        for msg in messages {
            println!("Envoi: {}", msg);
            tx.send(msg).unwrap();
            thread::sleep(Duration::from_millis(100));
        }
    });

    // Consumer
    for received in rx {
        println!("Reçu: {}", received);
    }
}
```
</details>

---

### Exercice 3 : Calcul Parallèle (Moyen)

Calculez la somme d'un grand vecteur en parallèle.

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn parallel_sum(numbers: Vec<i32>, num_threads: usize) -> i32 {
    // TODO: Divisez le travail entre plusieurs threads
}

fn main() {
    let numbers: Vec<i32> = (1..=1000).collect();
    let sum = parallel_sum(numbers, 4);
    println!("Somme: {}", sum);  // 500500
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn parallel_sum(numbers: Vec<i32>, num_threads: usize) -> i32 {
    let total = Arc::new(Mutex::new(0));
    let numbers = Arc::new(numbers);
    let chunk_size = numbers.len() / num_threads;

    let mut handles = vec![];

    for i in 0..num_threads {
        let total = Arc::clone(&total);
        let numbers = Arc::clone(&numbers);

        let handle = thread::spawn(move || {
            let start = i * chunk_size;
            let end = if i == num_threads - 1 {
                numbers.len()
            } else {
                (i + 1) * chunk_size
            };

            let local_sum: i32 = numbers[start..end].iter().sum();

            let mut total = total.lock().unwrap();
            *total += local_sum;
        });

        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    let result = *total.lock().unwrap();
    result
}

fn main() {
    let numbers: Vec<i32> = (1..=1000).collect();
    let sum = parallel_sum(numbers, 4);
    println!("Somme: {}", sum);
}
```
</details>

---

### Exercice 4 : Cache Concurrent (Difficile)

Créez un cache thread-safe avec RwLock.

```rust
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use std::thread;

struct Cache {
    // TODO: HashMap avec RwLock
}

impl Cache {
    fn new() -> Self {
        // TODO
    }

    fn get(&self, key: &str) -> Option<String> {
        // TODO
    }

    fn set(&self, key: String, value: String) {
        // TODO
    }
}

fn main() {
    let cache = Arc::new(Cache::new());
    let mut handles = vec![];

    // Écrivains
    for i in 0..3 {
        let cache = Arc::clone(&cache);
        let handle = thread::spawn(move || {
            cache.set(format!("key{}", i), format!("value{}", i));
        });
        handles.push(handle);
    }

    // Lecteurs
    for i in 0..3 {
        let cache = Arc::clone(&cache);
        let handle = thread::spawn(move || {
            if let Some(value) = cache.get(&format!("key{}", i)) {
                println!("Lu: {}", value);
            }
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::collections::HashMap;
use std::sync::RwLock;
use std::thread;

struct Cache {
    data: RwLock<HashMap<String, String>>,
}

impl Cache {
    fn new() -> Self {
        Cache {
            data: RwLock::new(HashMap::new()),
        }
    }

    fn get(&self, key: &str) -> Option<String> {
        let data = self.data.read().unwrap();
        data.get(key).cloned()
    }

    fn set(&self, key: String, value: String) {
        let mut data = self.data.write().unwrap();
        data.insert(key, value);
    }
}

fn main() {
    use std::sync::Arc;

    let cache = Arc::new(Cache::new());
    let mut handles = vec![];

    // Écrivains
    for i in 0..3 {
        let cache = Arc::clone(&cache);
        let handle = thread::spawn(move || {
            cache.set(format!("key{}", i), format!("value{}", i));
            println!("Écrit: key{}", i);
        });
        handles.push(handle);
    }

    // Petite pause pour laisser les écritures se faire
    std::thread::sleep(std::time::Duration::from_millis(100));

    // Lecteurs
    for i in 0..3 {
        let cache = Arc::clone(&cache);
        let handle = thread::spawn(move || {
            if let Some(value) = cache.get(&format!("key{}", i)) {
                println!("Lu: {}", value);
            }
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
}
```
</details>

---

### Exercice 5 : Worker Pool (Difficile)

Créez un pool de workers qui traitent des tâches en parallèle.

```rust
use std::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::thread;

struct WorkerPool {
    // TODO
}

impl WorkerPool {
    fn new(size: usize) -> Self {
        // TODO: Créez 'size' workers
    }

    fn execute<F>(&self, job: F)
    where
        F: FnOnce() + Send + 'static,
    {
        // TODO: Envoyez le job à un worker
    }
}

fn main() {
    let pool = WorkerPool::new(4);

    for i in 0..8 {
        pool.execute(move || {
            println!("Job {} exécuté par {:?}", i, thread::current().id());
            thread::sleep(std::time::Duration::from_millis(100));
        });
    }

    thread::sleep(std::time::Duration::from_secs(1));
}
```

<details>
<summary>💡 Solution</summary>

```rust
use std::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct WorkerPool {
    workers: Vec<Worker>,
    sender: mpsc::Sender<Job>,
}

struct Worker {
    id: usize,
    thread: thread::JoinHandle<()>,
}

impl WorkerPool {
    fn new(size: usize) -> Self {
        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));

        let mut workers = Vec::with_capacity(size);

        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&receiver)));
        }

        WorkerPool { workers, sender }
    }

    fn execute<F>(&self, job: F)
    where
        F: FnOnce() + Send + 'static,
    {
        let job = Box::new(job);
        self.sender.send(job).unwrap();
    }
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            let job = receiver.lock().unwrap().recv();

            match job {
                Ok(job) => {
                    println!("Worker {} a reçu un job", id);
                    job();
                }
                Err(_) => {
                    println!("Worker {} s'arrête", id);
                    break;
                }
            }
        });

        Worker { id, thread }
    }
}

fn main() {
    let pool = WorkerPool::new(4);

    for i in 0..8 {
        pool.execute(move || {
            println!("Job {} exécuté", i);
            thread::sleep(std::time::Duration::from_millis(100));
        });
    }

    thread::sleep(std::time::Duration::from_secs(1));
}
```
</details>

## 🎯 Défi Bonus : Crawler Web Concurrent

Créez un web crawler qui :
- Explore plusieurs URLs en parallèle
- Utilise un pool de workers
- Stocke les résultats dans une structure partagée
- Gère les erreurs de manière élégante
- Limite le nombre de requêtes simultanées

## ✅ Points de Vérification

Avant de passer à l'étape suivante, assurez-vous de :
- [ ] Savoir créer et joindre des threads
- [ ] Comprendre Arc et son utilité
- [ ] Pouvoir utiliser Mutex pour synchroniser
- [ ] Connaître la différence entre Mutex et RwLock
- [ ] Maîtriser les channels pour la communication
- [ ] Avoir réussi tous les exercices

## 📖 Pour Aller Plus Loin

- Les atomic types (`AtomicBool`, `AtomicUsize`, etc.)
- `async`/`await` et Tokio pour la concurrence asynchrone
- Les barrières et conditions variables
- Le pattern actor avec des channels

Prêt pour l'étape finale ? Direction [Projet Final](./10-projet-final.md) ! 🚀
