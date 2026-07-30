# LearnBetter

Plateforme personnelle d’apprentissage fondée sur la répétition espacée, les autotests, les cartes mémoire manuelles et les cartes mentales.

## Fonctionnel aujourd’hui

- compte personnel et interface responsive installable comme PWA ;
- import JSON depuis un projet ChatGPT, contrôlé puis conservé en brouillon ;
- bibliothèque `Matière → Cours → Chapitres → Notions` ;
- autotests importés avec leur réponse modèle ;
- cartes personnelles Question/Réponse, texte à trou et réversibles ;
- session de révision avec quatre niveaux d’autoévaluation ;
- calcul automatique du prochain rappel ;
- budget d’apprentissage configurable pour chaque jour ;
- modèle de données prêt pour la synchronisation Google Agenda.

## Prérequis

- Node.js 24 ou supérieur
- npm 11 ou supérieur

## Lancer le projet

```bash
npm install
node ace migration:run
npm run dev
```

L’application est ensuite disponible sur `http://localhost:3333`.

## Commandes utiles

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Le cadrage produit se trouve dans [CONTEXT.md](./CONTEXT.md). Le contrat utilisé pour importer les réponses du projet ChatGPT est documenté dans [docs/import-format-v1.md](./docs/import-format-v1.md).

Les instructions prêtes à copier dans le projet ChatGPT se trouvent dans [docs/instructions-projet-chatgpt.md](./docs/instructions-projet-chatgpt.md).

## Prochaines briques

- exécution interactive et historique détaillé des autotests ;
- génération du calendrier de sessions à partir des dates cibles ;
- connexion OAuth et synchronisation unidirectionnelle vers Google Agenda ;
- carte mentale interactive et fusion guidée de plusieurs imports.
