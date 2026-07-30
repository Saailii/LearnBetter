import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

const TEST_TYPES = new Set([
  'multiple_choice',
  'true_false',
  'matching',
  'free_response',
  'explanation',
  'exercise',
])

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

interface ImportSelfTest {
  type: string
  prompt: string
  options?: JsonValue
  expectedAnswer: JsonValue
  explanation?: string
  difficulty?: number
}

interface ImportConcept {
  key: string
  title: string
  explanation: string
  selfTests: ImportSelfTest[]
  links: Array<{ targetKey: string; label?: string }>
}

interface ImportChapter {
  key: string
  title: string
  summary?: string
  concepts: ImportConcept[]
}

export interface CourseImportPackage {
  format: 'learnbetter.course'
  version: 1
  course: {
    title: string
    description?: string
    targetDate?: string
    subject: { name: string; color?: string }
    sources: Array<{ type: string; title: string; reference?: string }>
    chapters: ImportChapter[]
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredString(value: unknown, path: string) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${path} doit être une chaîne non vide.`)
  }
  return value.trim()
}

function optionalString(value: unknown, path: string) {
  if (value === undefined || value === null || value === '') return undefined
  return requiredString(value, path)
}

function array(value: unknown, path: string) {
  if (!Array.isArray(value)) throw new Error(`${path} doit être un tableau.`)
  return value
}

function nonEmptyArray(value: unknown, path: string, expected: string) {
  const values = array(value, path)
  if (values.length === 0) throw new Error(`${path} doit contenir au moins ${expected}.`)
  return values
}

export function parseCourseImport(raw: string): CourseImportPackage {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Le contenu fourni n’est pas un JSON valide.')
  }

  if (!isRecord(parsed)) throw new Error('La racine du document doit être un objet JSON.')
  if (parsed.format !== 'learnbetter.course') {
    throw new Error('Le champ format doit valoir "learnbetter.course".')
  }
  if (parsed.version !== 1) throw new Error('Seule la version 1 du format est acceptée.')
  if (!isRecord(parsed.course)) throw new Error('Le champ course est obligatoire.')

  const sourceCourse = parsed.course
  if ('flashcards' in sourceCourse) {
    throw new Error('Les cartes mémoire ne doivent pas être générées dans un import.')
  }
  if (!isRecord(sourceCourse.subject)) throw new Error('course.subject est obligatoire.')

  const conceptKeys = new Set<string>()
  const chapterKeys = new Set<string>()
  const chapters = nonEmptyArray(sourceCourse.chapters, 'course.chapters', 'un chapitre').map(
    (chapterValue, chapterIndex) => {
      if (!isRecord(chapterValue)) throw new Error(`course.chapters[${chapterIndex}] est invalide.`)
      const chapterKey = requiredString(chapterValue.key, `course.chapters[${chapterIndex}].key`)
      if (chapterKeys.has(chapterKey)) {
        throw new Error(`La clé de chapitre "${chapterKey}" est dupliquée.`)
      }
      chapterKeys.add(chapterKey)

      const concepts = nonEmptyArray(
        chapterValue.concepts,
        `course.chapters[${chapterIndex}].concepts`,
        'une notion'
      ).map((conceptValue, conceptIndex) => {
        const path = `course.chapters[${chapterIndex}].concepts[${conceptIndex}]`
        if (!isRecord(conceptValue)) throw new Error(`${path} est invalide.`)
        if ('flashcards' in conceptValue) {
          throw new Error(`${path} contient des cartes mémoire générées, ce qui est interdit.`)
        }
        const key = requiredString(conceptValue.key, `${path}.key`)
        if (conceptKeys.has(key)) throw new Error(`La clé de notion "${key}" est dupliquée.`)
        conceptKeys.add(key)

        const selfTests = array(conceptValue.selfTests ?? [], `${path}.selfTests`).map(
          (testValue, testIndex) => {
            const testPath = `${path}.selfTests[${testIndex}]`
            if (!isRecord(testValue)) throw new Error(`${testPath} est invalide.`)
            const type = requiredString(testValue.type, `${testPath}.type`)
            if (!TEST_TYPES.has(type)) throw new Error(`Le type d’autotest "${type}" est inconnu.`)
            if (!('expectedAnswer' in testValue)) {
              throw new Error(`${testPath}.expectedAnswer est obligatoire.`)
            }
            const difficulty = testValue.difficulty ?? 2
            if (
              typeof difficulty !== 'number' ||
              !Number.isInteger(difficulty) ||
              difficulty < 1 ||
              difficulty > 3
            ) {
              throw new Error(`${testPath}.difficulty doit être un entier entre 1 et 3.`)
            }
            return {
              type,
              prompt: requiredString(testValue.prompt, `${testPath}.prompt`),
              options: testValue.options as JsonValue | undefined,
              expectedAnswer: testValue.expectedAnswer as JsonValue,
              explanation: optionalString(testValue.explanation, `${testPath}.explanation`),
              difficulty,
            }
          }
        )

        const links = array(conceptValue.links ?? [], `${path}.links`).map(
          (linkValue, linkIndex) => {
            if (!isRecord(linkValue)) throw new Error(`${path}.links[${linkIndex}] est invalide.`)
            return {
              targetKey: requiredString(
                linkValue.targetKey,
                `${path}.links[${linkIndex}].targetKey`
              ),
              label: optionalString(linkValue.label, `${path}.links[${linkIndex}].label`),
            }
          }
        )

        return {
          key,
          title: requiredString(conceptValue.title, `${path}.title`),
          explanation: requiredString(conceptValue.explanation, `${path}.explanation`),
          selfTests,
          links,
        }
      })

      return {
        key: chapterKey,
        title: requiredString(chapterValue.title, `course.chapters[${chapterIndex}].title`),
        summary: optionalString(chapterValue.summary, `course.chapters[${chapterIndex}].summary`),
        concepts,
      }
    }
  )

  for (const chapter of chapters) {
    for (const concept of chapter.concepts) {
      for (const link of concept.links) {
        if (!conceptKeys.has(link.targetKey)) {
          throw new Error(
            `La relation depuis "${concept.key}" cible "${link.targetKey}", inconnue.`
          )
        }
      }
    }
  }

  const sources = nonEmptyArray(sourceCourse.sources ?? [], 'course.sources', 'une source').map(
    (value, index) => {
      if (!isRecord(value)) throw new Error(`course.sources[${index}] est invalide.`)
      return {
        type: requiredString(value.type, `course.sources[${index}].type`),
        title: requiredString(value.title, `course.sources[${index}].title`),
        reference: optionalString(value.reference, `course.sources[${index}].reference`),
      }
    }
  )

  const targetDate = optionalString(sourceCourse.targetDate, 'course.targetDate')
  if (targetDate) {
    const parsedTargetDate = DateTime.fromISO(targetDate, { zone: 'utc' })
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(targetDate) ||
      !parsedTargetDate.isValid ||
      parsedTargetDate.toISODate() !== targetDate
    ) {
      throw new Error('course.targetDate doit être une date valide au format YYYY-MM-DD.')
    }
  }

  return {
    format: 'learnbetter.course',
    version: 1,
    course: {
      title: requiredString(sourceCourse.title, 'course.title'),
      description: optionalString(sourceCourse.description, 'course.description'),
      targetDate,
      subject: {
        name: requiredString(sourceCourse.subject.name, 'course.subject.name'),
        color: optionalString(sourceCourse.subject.color, 'course.subject.color'),
      },
      sources,
      chapters,
    },
  }
}

export async function importCourse(userId: number, payload: CourseImportPackage) {
  return db.transaction(async (trx) => {
    const now = DateTime.now().toSQL()
    let subject = await trx
      .from('subjects')
      .where('user_id', userId)
      .where('name', payload.course.subject.name)
      .first()

    if (!subject) {
      const ids = await trx.table('subjects').insert({
        user_id: userId,
        name: payload.course.subject.name,
        color: payload.course.subject.color ?? '#6d5dfc',
        created_at: now,
      })
      subject = { id: ids[0] }
    }

    const courseIds = await trx.table('courses').insert({
      user_id: userId,
      subject_id: subject.id,
      title: payload.course.title,
      description: payload.course.description ?? null,
      status: 'draft',
      target_date: payload.course.targetDate ?? null,
      import_version: payload.version,
      created_at: now,
    })
    const courseId = Number(courseIds[0])

    for (const source of payload.course.sources) {
      await trx.table('course_sources').insert({
        course_id: courseId,
        type: source.type,
        title: source.title,
        reference: source.reference ?? null,
        created_at: now,
      })
    }

    const conceptIds = new Map<string, number>()
    const pendingLinks: Array<{ fromKey: string; targetKey: string; label?: string }> = []

    for (const [chapterPosition, chapter] of payload.course.chapters.entries()) {
      const chapterIds = await trx.table('chapters').insert({
        course_id: courseId,
        key: chapter.key,
        title: chapter.title,
        summary: chapter.summary ?? null,
        position: chapterPosition,
        created_at: now,
      })
      const chapterId = Number(chapterIds[0])

      for (const [conceptPosition, concept] of chapter.concepts.entries()) {
        const conceptResult = await trx.table('concepts').insert({
          chapter_id: chapterId,
          key: concept.key,
          title: concept.title,
          explanation: concept.explanation,
          position: conceptPosition,
          mastery_state: 'new',
          created_at: now,
        })
        const conceptId = Number(conceptResult[0])
        conceptIds.set(concept.key, conceptId)

        for (const [testPosition, test] of concept.selfTests.entries()) {
          await trx.table('self_tests').insert({
            concept_id: conceptId,
            type: test.type,
            prompt: test.prompt,
            options_json: test.options === undefined ? null : JSON.stringify(test.options),
            expected_answer_json: JSON.stringify(test.expectedAnswer),
            explanation: test.explanation ?? null,
            difficulty: test.difficulty ?? 2,
            position: testPosition,
            created_at: now,
          })
        }

        for (const link of concept.links) {
          pendingLinks.push({ fromKey: concept.key, ...link })
        }
      }
    }

    for (const link of pendingLinks) {
      await trx.table('concept_links').insert({
        from_concept_id: conceptIds.get(link.fromKey)!,
        to_concept_id: conceptIds.get(link.targetKey)!,
        label: link.label ?? null,
      })
    }

    return courseId
  })
}
