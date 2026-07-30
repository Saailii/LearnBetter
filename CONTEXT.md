# LearnBetter

LearnBetter est une plateforme personnelle d'apprentissage accessible sur ordinateur et téléphone. Elle transforme des cours structurés en un programme quotidien fondé sur la récupération active, la répétition espacée, la diversification des exercices et les connexions entre notions.

## Parcours principal

Le tableau de bord « Aujourd'hui » décide quoi étudier selon les échéances, les révisions dues et le budget de temps défini pour chaque jour de la semaine. Une journée manquée n'est pas empilée sur la suivante : le retard est priorisé puis redistribué progressivement.

## Acquisition des cours

L'utilisateur fournit ses PDF, livres, vidéos ou transcriptions à un projet ChatGPT personnel déjà instruit pour produire le format `learnbetter.course` version 1. Le résultat JSON est importé dans LearnBetter comme brouillon.

L'import contient une matière, un cours, des chapitres, des notions atomiques, les sources, des explications, des autotests et les relations nécessaires à la carte mentale. Il ne contient jamais de cartes mémoire générées par IA.

Les imports peuvent créer un cours ou enrichir progressivement un cours existant. Toute fusion est prévisualisée, détecte les doublons et conserve la traçabilité des sources.

## Cartes mémoire

Les cartes sont créées manuellement depuis une notion : question/réponse, texte à trous ou carte réversible. Chaque carte conserve son lien avec la notion et la source.

## Autotests

La correction est hybride :

- QCM, associations et vrai/faux : correction automatique ;
- réponses libres, explications et exercices : réponse modèle masquée puis autoévaluation « À revoir / Difficile / Correct / Facile ».

Les tentatives peuvent être exportées en JSON, analysées manuellement dans ChatGPT, puis réimportées avec un feedback structuré.

## Planification

Une date cible facultative peut être associée à chaque cours. LearnBetter répartit la charge jusqu'à cette date sans interrompre les répétitions nécessaires ensuite.

Le calendrier intégré fournit les vues Aujourd'hui, Semaine et Mois. Une synchronisation à sens unique pousse immédiatement les sessions vers un calendrier Google secondaire « LearnBetter ». LearnBetter reste la source de vérité.

## Contraintes

- Usage personnel et mono-utilisateur pour la première version.
- Aucun coût d'API IA.
- AdonisJS côté serveur.
- Interface responsive installable comme PWA.
- SQLite en première version, avec sauvegarde exportable.
- Authentification par session.
- Français comme langue initiale.

## Principes de conception

- Les contenus générés par IA sont toujours des brouillons.
- Le calendrier organise des blocs d'étude, pas chaque carte individuellement.
- Les performances réelles pilotent la planification.
- Les modifications importantes sont récupérables par archivage ou historique.
- L'application reste complètement utilisable sans ChatGPT après l'import.
