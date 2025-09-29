# tokio::spawn

Dans l'écosystème Rust, Tokio s'impose comme le runtime asynchrone de référence pour les applications réseau hautes performances. Au cœur de cette puissance se trouve `tokio::spawn`, une fonction apparemment simple qui révolutionne la façon dont nous gérons la concurrence asynchrone. Cet article explore comment `tokio::spawn` permet d'exécuter des tâches légères en arrière-plan sans jamais bloquer le thread principal.

## L'Asynchronisme en Rust : Un Paradigme Révolutionnaire

### Pourquoi l'asynchronisme ?

Les applications modernes, particulièrement celles orientées réseau, doivent gérer des milliers, voire des millions de connexions simultanées. L'approche traditionnelle "un thread par connexion" atteint rapidement ses limites :

- **Coût mémoire** : chaque thread OS consomme plusieurs MB de mémoire
- **Changements de contexte** : coûteux en termes de performance
- **Complexité de synchronisation** : mutexes, channels, etc.

Rust propose une alternative élégante : la programmation asynchrone avec des "tâches légères" (green threads) gérées par un runtime comme Tokio.

### Le modèle async/await de Rust

```rust
use tokio;

#[tokio::main]
async fn main() {
    println!("Début du programme");

    let resultat = operation_longue().await;
    println!("Résultat : {}", resultat);

    println!("Fin du programme");
}

async fn operation_longue() -> i32 {
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
    42
}
```

## tokio::spawn : Le Lanceur de Tâches

### Qu'est-ce que tokio::spawn ?

`tokio::spawn` est la fonction qui permet de lancer une tâche asynchrone en arrière-plan. Contrairement à `thread::spawn` qui crée un véritable thread OS, `tokio::spawn` crée une tâche légère gérée par le runtime Tokio.

```rust
use tokio;

#[tokio::main]
async fn main() {
    println!("Lancement d'une tâche...");

    let handle = tokio::spawn(async {
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        "Tâche terminée !"
    });

    println!("Tâche lancée, continuons...");

    let resultat = handle.await.unwrap();
    println!("{}", resultat);
}
```

### La magie des tâches légères

Une tâche Tokio consomme seulement quelques KB de mémoire, contre plusieurs MB pour un thread OS. Cela permet de créer des centaines de milliers de tâches concurrentes :

```rust
use tokio;

#[tokio::main]
async fn main() {
    let mut handles = vec![];

    // Créer 10 000 tâches concurrentes
    for i in 0..10_000 {
        let handle = tokio::spawn(async move {
            tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
            i * 2
        });
        handles.push(handle);
    }

    // Attendre toutes les tâches
    for handle in handles {
        let resultat = handle.await.unwrap();
        // Traiter le résultat...
    }

    println!("Toutes les tâches terminées !");
}
```

## Patterns Fondamentaux avec tokio::spawn

### 1. Fire and Forget

Lancer une tâche sans attendre son résultat :

```rust
use tokio;

#[tokio::main]
async fn main() {
    // Lancer une tâche de nettoyage en arrière-plan
    tokio::spawn(async {
        loop {
            tokio::time::sleep(tokio::time::Duration::from_secs(60)).await;
            println!("Nettoyage périodique...");
            // Logique de nettoyage
        }
    });

    // Le programme principal continue
    serveur_principal().await;
}

async fn serveur_principal() {
    println!("Serveur démarré");
    // Logique du serveur principal
    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
}
```

### 2. Collecte de Résultats

Lancer plusieurs tâches et collecter leurs résultats :

```rust
use tokio;

async fn traitement_parallele() -> Vec<i32> {
    let mut handles = vec![];

    // Lancer plusieurs tâches de calcul
    for i in 0..5 {
        let handle = tokio::spawn(async move {
            // Simuler un calcul complexe
            tokio::time::sleep(tokio::time::Duration::from_millis(100 * i)).await;
            i * i
        });
        handles.push(handle);
    }

    // Collecter tous les résultats
    let mut resultats = vec![];
    for handle in handles {
        match handle.await {
            Ok(resultat) => resultats.push(resultat),
            Err(e) => println!("Erreur dans une tâche : {:?}", e),
        }
    }

    resultats
}

#[tokio::main]
async fn main() {
    let resultats = traitement_parallele().await;
    println!("Résultats : {:?}", resultats);
}
```

### 3. Timeout et Annulation

Contrôler le temps d'exécution et annuler des tâches :

```rust
use tokio::time::{timeout, Duration};

#[tokio::main]
async fn main() {
    let handle = tokio::spawn(async {
        // Tâche potentiellement longue
        tokio::time::sleep(Duration::from_secs(10)).await;
        "Tâche très longue terminée"
    });

    // Attendre maximum 2 secondes
    match timeout(Duration::from_secs(2), handle).await {
        Ok(Ok(resultat)) => println!("Succès : {}", resultat),
        Ok(Err(e)) => println!("Erreur dans la tâche : {:?}", e),
        Err(_) => println!("Timeout : tâche annulée"),
    }
}
```

## Applications Pratiques : Serveur Web Concurrent

### Serveur HTTP Simple

Voici un exemple concret d'utilisation de `tokio::spawn` pour gérer plusieurs connexions simultanément :

```rust
use tokio::net::{TcpListener, TcpStream};
use tokio::io::{AsyncReadExt, AsyncWriteExt};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind("127.0.0.1:8080").await?;
    println!("Serveur en écoute sur 127.0.0.1:8080");

    loop {
        let (socket, addr) = listener.accept().await?;
        println!("Nouvelle connexion : {}", addr);

        // Traiter chaque connexion dans une tâche séparée
        tokio::spawn(async move {
            if let Err(e) = traiter_connexion(socket).await {
                println!("Erreur lors du traitement : {}", e);
            }
        });
    }
}

async fn traiter_connexion(mut socket: TcpStream) -> Result<(), Box<dyn std::error::Error>> {
    let mut buffer = [0; 1024];

    // Lire la requête
    let n = socket.read(&mut buffer).await?;
    let requete = String::from_utf8_lossy(&buffer[..n]);

    println!("Requête reçue : {}", requete.lines().next().unwrap_or(""));

    // Simuler un traitement
    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;

    // Envoyer une réponse HTTP simple
    let response = "HTTP/1.1 200 OK\r\nContent-Length: 13\r\n\r\nHello, World!";
    socket.write_all(response.as_bytes()).await?;

    Ok(())
}
```

### Serveur de Chat Concurrent

Un exemple plus avancé avec partage d'état entre tâches :

```rust
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::{broadcast, Mutex};
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use std::sync::Arc;

type Clients = Arc<Mutex<Vec<broadcast::Sender<String>>>>;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind("127.0.0.1:8081").await?;
    let clients: Clients = Arc::new(Mutex::new(Vec::new()));

    println!("Serveur de chat en écoute sur 127.0.0.1:8081");

    loop {
        let (socket, addr) = listener.accept().await?;
        let clients = Arc::clone(&clients);

        tokio::spawn(async move {
            println!("Nouveau client : {}", addr);
            if let Err(e) = gerer_client(socket, clients).await {
                println!("Erreur client {} : {}", addr, e);
            }
        });
    }
}

async fn gerer_client(socket: TcpStream, clients: Clients) -> Result<(), Box<dyn std::error::Error>> {
    let (reader, mut writer) = socket.into_split();
    let mut reader = BufReader::new(reader);

    let (tx, mut rx) = broadcast::channel(100);

    // Ajouter le client à la liste
    clients.lock().await.push(tx.clone());

    // Tâche pour recevoir les messages du réseau
    let tx_clone = tx.clone();
    tokio::spawn(async move {
        loop {
            tokio::select! {
                // Recevoir message du broadcast
                msg = rx.recv() => {
                    match msg {
                        Ok(message) => {
                            if writer.write_all(format!("{}\n", message).as_bytes()).await.is_err() {
                                break;
                            }
                        }
                        Err(_) => break,
                    }
                }
            }
        }
    });

    // Lire les messages du client
    let mut line = String::new();
    loop {
        line.clear();
        match reader.read_line(&mut line).await? {
            0 => break, // Connexion fermée
            _ => {
                let message = line.trim().to_string();

                // Diffuser le message à tous les clients
                let clients_guard = clients.lock().await;
                for client_tx in clients_guard.iter() {
                    let _ = client_tx.send(message.clone());
                }
            }
        }
    }

    Ok(())
}
```

## Gestion d'Erreurs et Bonnes Pratiques

### Récupération des Erreurs de Tâches

Les tâches spawned peuvent paniquer ou échouer. Il est crucial de gérer ces cas :

```rust
use tokio;

#[tokio::main]
async fn main() {
    let handle = tokio::spawn(async {
        // Cette tâche va paniquer
        panic!("Quelque chose s'est mal passé !");
    });

    match handle.await {
        Ok(resultat) => println!("Succès : {:?}", resultat),
        Err(e) => {
            if e.is_panic() {
                println!("La tâche a paniqué !");
            } else if e.is_cancelled() {
                println!("La tâche a été annulée");
            }
        }
    }
}
```

### Limitation du Nombre de Tâches

Pour éviter l'épuisement des ressources :

```rust
use tokio::sync::Semaphore;
use std::sync::Arc;

async fn traitement_avec_limite() {
    let semaphore = Arc::new(Semaphore::new(10)); // Max 10 tâches concurrentes
    let mut handles = vec![];

    for i in 0..100 {
        let permit = Arc::clone(&semaphore);
        let handle = tokio::spawn(async move {
            let _guard = permit.acquire().await.unwrap();
            // Travail limité à 10 tâches simultanées
            tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
            i
        });
        handles.push(handle);
    }

    // Attendre toutes les tâches
    for handle in handles {
        let _ = handle.await;
    }
}
```

### Monitoring et Observabilité

Surveiller les tâches en cours :

```rust
use tokio::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;

#[tokio::main]
async fn main() {
    let compteur_taches = Arc::new(AtomicUsize::new(0));

    // Tâche de monitoring
    let compteur_clone = Arc::clone(&compteur_taches);
    tokio::spawn(async move {
        loop {
            tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
            let nb_taches = compteur_clone.load(Ordering::Relaxed);
            println!("Tâches actives : {}", nb_taches);
        }
    });

    // Lancer plusieurs tâches
    for i in 0..20 {
        let compteur = Arc::clone(&compteur_taches);
        tokio::spawn(async move {
            compteur.fetch_add(1, Ordering::Relaxed);

            // Simuler du travail
            tokio::time::sleep(tokio::time::Duration::from_secs(i % 5 + 1)).await;

            compteur.fetch_sub(1, Ordering::Relaxed);
        });
    }

    // Attendre un peu pour voir le monitoring en action
    tokio::time::sleep(tokio::time::Duration::from_secs(30)).await;
}
```

## Performance et Optimisations

### Comparaison avec les Threads OS

| Critère             | Thread OS | Tâche Tokio |
| ------------------- | --------- | ----------- |
| Mémoire             | ~8MB      | ~2KB        |
| Création            | ~100µs    | ~100ns      |
| Changement contexte | ~1-10µs   | ~10-100ns   |
| Nombre max          | ~1000     | >100 000    |

### Mesurer les Performances

```rust
use tokio::time::{Duration, Instant};

async fn benchmark_spawn() {
    let start = Instant::now();
    let mut handles = vec![];

    for _ in 0..10_000 {
        let handle = tokio::spawn(async {
            // Tâche minimale
        });
        handles.push(handle);
    }

    for handle in handles {
        let _ = handle.await;
    }

    let duree = start.elapsed();
    println!("10 000 tâches créées et exécutées en : {:?}", duree);
}

#[tokio::main]
async fn main() {
    benchmark_spawn().await;
}
```

## Cas d'Usage Avancés

### Pipeline de Traitement

Créer un pipeline de traitement de données avec plusieurs étapes :

```rust
use tokio::sync::mpsc;

async fn pipeline_traitement() {
    let (tx1, mut rx1) = mpsc::channel::<i32>(100);
    let (tx2, mut rx2) = mpsc::channel::<i32>(100);
    let (tx3, mut rx3) = mpsc::channel::<String>(100);

    // Étape 1 : Génération de données
    tokio::spawn(async move {
        for i in 0..100 {
            if tx1.send(i).await.is_err() { break; }
            tokio::time::sleep(Duration::from_millis(10)).await;
        }
    });

    // Étape 2 : Traitement des nombres
    tokio::spawn(async move {
        while let Some(nombre) = rx1.recv().await {
            let resultat = nombre * nombre;
            if tx2.send(resultat).await.is_err() { break; }
        }
    });

    // Étape 3 : Formatage
    tokio::spawn(async move {
        while let Some(nombre) = rx2.recv().await {
            let message = format!("Résultat : {}", nombre);
            if tx3.send(message).await.is_err() { break; }
        }
    });

    // Étape 4 : Consommation finale
    while let Some(message) = rx3.recv().await {
        println!("{}", message);
    }
}
```

## Conclusion

`tokio::spawn` représente bien plus qu'une simple fonction : c'est la clé qui ouvre les portes de la programmation asynchrone haute performance en Rust. En permettant de créer des milliers de tâches légères sans surcharge significative, elle révolutionne la façon dont nous concevons les applications concurrentes.

Les avantages sont multiples :

- **Performance exceptionnelle** : des centaines de milliers de tâches concurrentes
- **Simplicité d'utilisation** : syntax familière avec async/await
- **Sécurité garantie** : le système de types de Rust prévient les erreurs classiques
- **Flexibilité** : patterns variés pour tous les besoins

Que ce soit pour développer un serveur web haute performance, un système de traitement de données en temps réel, ou un client réseau complexe, `tokio::spawn` offre les outils nécessaires pour créer des applications robustes et efficaces.

La maîtrise de cette fonction est essentielle pour tout développeur Rust souhaitant exploiter pleinement la puissance de l'asynchronisme. Elle ouvre la voie vers des architectures modernes capables de gérer les défis de performance du monde numérique actuel, tout en conservant la sécurité et l'élégance qui font la réputation de Rust.
