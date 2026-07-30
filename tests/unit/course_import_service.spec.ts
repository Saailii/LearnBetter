import { parseCourseImport } from '#services/course_import_service'
import { test } from '@japa/runner'

const validPackage = {
  format: 'learnbetter.course',
  version: 1,
  course: {
    title: 'Biologie cellulaire',
    description: 'Comprendre les bases de la cellule.',
    targetDate: '2026-12-15',
    subject: { name: 'Biologie', color: '#4f8f70' },
    sources: [{ type: 'pdf', title: 'Manuel', reference: 'pages 1 à 20' }],
    chapters: [
      {
        key: 'cellule',
        title: 'La cellule',
        concepts: [
          {
            key: 'membrane',
            title: 'Membrane plasmique',
            explanation: 'Elle sépare les milieux intra et extracellulaires.',
            selfTests: [
              {
                type: 'free_response',
                prompt: 'Quel est le rôle de la membrane ?',
                expectedAnswer: 'Séparer et réguler les échanges.',
              },
            ],
            links: [] as Array<{ targetKey: string; label?: string }>,
          },
        ],
      },
    ],
  },
}

test.group('Course import parser', () => {
  test('accepts a valid LearnBetter course package', ({ assert }) => {
    const result = parseCourseImport(JSON.stringify(validPackage))

    assert.equal(result.course.title, 'Biologie cellulaire')
    assert.equal(result.course.chapters[0].concepts[0].selfTests.length, 1)
  })

  test('rejects AI-generated flashcards', ({ assert }) => {
    const payload = structuredClone(validPackage)
    Object.assign(payload.course.chapters[0].concepts[0], {
      flashcards: [{ front: 'Question', back: 'Réponse' }],
    })

    assert.throws(
      () => parseCourseImport(JSON.stringify(payload)),
      /cartes mémoire générées, ce qui est interdit/
    )
  })

  test('rejects links to unknown concepts', ({ assert }) => {
    const payload = structuredClone(validPackage)
    payload.course.chapters[0].concepts[0].links.push({
      targetKey: 'inconnue',
      label: 'dépend de',
    })

    assert.throws(() => parseCourseImport(JSON.stringify(payload)), /cible "inconnue", inconnue/)
  })

  test('rejects an invalid calendar date', ({ assert }) => {
    const payload = structuredClone(validPackage)
    payload.course.targetDate = '2026-99-99'

    assert.throws(() => parseCourseImport(JSON.stringify(payload)), /date valide/)
  })

  test('rejects a difficulty outside the documented 1 to 3 range', ({ assert }) => {
    const payload = structuredClone(validPackage)
    Object.assign(payload.course.chapters[0].concepts[0].selfTests[0], { difficulty: 5 })

    assert.throws(() => parseCourseImport(JSON.stringify(payload)), /entre 1 et 3/)
  })

  test('rejects duplicate chapter keys', ({ assert }) => {
    const payload = structuredClone(validPackage)
    const duplicateChapter = structuredClone(payload.course.chapters[0])
    duplicateChapter.concepts[0].key = 'membrane-copy'
    payload.course.chapters.push(duplicateChapter)

    assert.throws(() => parseCourseImport(JSON.stringify(payload)), /clé de chapitre .* dupliquée/)
  })

  test('rejects an empty course structure', ({ assert }) => {
    const payload = structuredClone(validPackage)
    payload.course.chapters = []

    assert.throws(() => parseCourseImport(JSON.stringify(payload)), /au moins un chapitre/)
  })

  test('rejects an import without a source', ({ assert }) => {
    const payload = structuredClone(validPackage)
    payload.course.sources = []

    assert.throws(() => parseCourseImport(JSON.stringify(payload)), /au moins une source/)
  })
})
