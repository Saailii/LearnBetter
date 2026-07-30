# Format d'import `learnbetter.course` v1

```json
{
  "format": "learnbetter.course",
  "version": 1,
  "course": {
    "title": "Titre du cours",
    "description": "Objectif et périmètre",
    "targetDate": "2026-12-15",
    "subject": { "name": "Biologie", "color": "#4f8f70" },
    "sources": [
      {
        "type": "pdf",
        "title": "Manuel de référence",
        "reference": "Chapitre 1, pages 1 à 24"
      }
    ],
    "chapters": [
      {
        "key": "cellule",
        "title": "La cellule",
        "summary": "Résumé du chapitre",
        "concepts": [
          {
            "key": "membrane",
            "title": "Membrane plasmique",
            "explanation": "Explication autonome et fidèle aux sources.",
            "selfTests": [
              {
                "type": "free_response",
                "prompt": "Explique le rôle de la membrane plasmique.",
                "expectedAnswer": "Éléments attendus dans la réponse.",
                "explanation": "Pourquoi ces éléments sont importants.",
                "difficulty": 2
              }
            ],
            "links": [{ "targetKey": "transport-passif", "label": "permet" }]
          }
        ]
      }
    ]
  }
}
```

## Contraintes

- `format` vaut exactement `learnbetter.course`.
- `version` vaut `1`.
- Les clés de chapitre sont uniques dans le cours.
- Les clés de notion sont uniques dans tout le cours.
- Une relation cible une clé de notion existante.
- Les types d'autotest acceptés sont `multiple_choice`, `true_false`, `matching`, `free_response`, `explanation` et `exercise`.
- Les options d'un QCM sont placées dans `options`.
- `expectedAnswer` peut être une chaîne, un booléen, un tableau ou un objet JSON.
- Aucune propriété `flashcards` n'est acceptée : les cartes sont créées par l'utilisateur.
- Une date cible est facultative et utilise le format `YYYY-MM-DD`.
