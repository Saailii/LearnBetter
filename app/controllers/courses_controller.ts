import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

const CARD_TYPES = ['question_answer', 'cloze', 'reversible'] as const

export default class CoursesController {
  async show({ auth, inertia, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const course = await db
      .from('courses')
      .leftJoin('subjects', 'subjects.id', 'courses.subject_id')
      .where('courses.id', params.id)
      .where('courses.user_id', user.id)
      .select(
        'courses.id',
        'courses.title',
        'courses.description',
        'courses.status',
        'courses.target_date as targetDate',
        'courses.created_at as createdAt',
        'subjects.name as subject',
        'subjects.color'
      )
      .first()

    if (!course) return response.notFound()

    const chapters = await db
      .from('chapters')
      .where('course_id', course.id)
      .select('id', 'title', 'summary', 'position')
      .orderBy('position')

    const sources = await db
      .from('course_sources')
      .where('course_id', course.id)
      .select('id', 'type', 'title', 'reference')
      .orderBy('id')

    const concepts = await db
      .from('concepts')
      .join('chapters', 'chapters.id', 'concepts.chapter_id')
      .where('chapters.course_id', course.id)
      .select(
        'concepts.id',
        'concepts.chapter_id as chapterId',
        'concepts.title',
        'concepts.explanation',
        'concepts.mastery_state as masteryState',
        'concepts.position'
      )
      .orderBy('concepts.position')

    const conceptIds = concepts.map((concept) => concept.id)
    const tests =
      conceptIds.length === 0
        ? []
        : await db
            .from('self_tests')
            .whereIn('concept_id', conceptIds)
            .select(
              'id',
              'concept_id as conceptId',
              'type',
              'prompt',
              'options_json as optionsJson',
              'expected_answer_json as expectedAnswerJson',
              'explanation',
              'difficulty',
              'position'
            )
            .orderBy('position')

    const cards =
      conceptIds.length === 0
        ? []
        : await db
            .from('flashcards')
            .leftJoin('course_sources', 'course_sources.id', 'flashcards.course_source_id')
            .whereIn('concept_id', conceptIds)
            .select(
              'flashcards.id',
              'flashcards.concept_id as conceptId',
              'flashcards.type',
              'flashcards.front',
              'flashcards.back',
              'flashcards.reversible',
              'flashcards.due_at as dueAt',
              'flashcards.repetitions',
              'course_sources.id as sourceId',
              'course_sources.type as sourceType',
              'course_sources.title as sourceTitle',
              'course_sources.reference as sourceReference'
            )
            .orderBy('flashcards.created_at', 'desc')

    return inertia.render('courses/show', {
      course,
      sources,
      chapters: chapters.map((chapter) => ({
        ...chapter,
        concepts: concepts
          .filter((concept) => concept.chapterId === chapter.id)
          .map((concept) => ({
            ...concept,
            tests: tests.filter((test) => test.conceptId === concept.id),
            cards: cards.filter((card) => card.conceptId === concept.id),
          })),
      })),
    })
  }

  async activate({ auth, params, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const updated = await db
      .from('courses')
      .where('id', params.id)
      .where('user_id', user.id)
      .update({
        status: 'active',
        activated_at: new Date(),
        updated_at: new Date(),
      })

    if (!updated) return response.notFound()

    session.flash(
      'success',
      'Le cours est actif. Ses cartes apparaissent maintenant dans tes révisions.'
    )
    return response.redirect().toPath(`/courses/${params.id}`)
  }

  async storeCard({ auth, request, params, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const conceptId = Number(request.input('conceptId'))
    const type = String(request.input('type', 'question_answer'))
    const front = String(request.input('front', '')).trim()
    const back = String(request.input('back', '')).trim()
    const sourceId = Number(request.input('sourceId'))

    const concept = await db
      .from('concepts')
      .join('chapters', 'chapters.id', 'concepts.chapter_id')
      .join('courses', 'courses.id', 'chapters.course_id')
      .where('concepts.id', conceptId)
      .where('courses.id', params.id)
      .where('courses.user_id', user.id)
      .select('concepts.id')
      .first()

    if (!concept) return response.notFound()

    if (!CARD_TYPES.includes(type as (typeof CARD_TYPES)[number]) || !front || !back) {
      session.flash('error', 'Choisis un type et remplis les deux faces de la carte.')
      return response.redirect().back()
    }

    if (type === 'cloze' && !/\{\{.+?\}\}/.test(front)) {
      session.flash('error', 'Entoure la réponse à masquer avec {{double accolades}}.')
      return response.redirect().back()
    }

    const courseSources = await db.from('course_sources').where('course_id', params.id).select('id')

    const selectedSource = courseSources.find((source) => source.id === sourceId)
    if (courseSources.length > 0 && !selectedSource) {
      session.flash('error', 'Choisis la source utilisée pour créer cette carte.')
      return response.redirect().back()
    }

    await db.table('flashcards').insert({
      concept_id: concept.id,
      course_source_id: selectedSource?.id ?? null,
      type,
      front,
      back,
      reversible: type === 'reversible',
      due_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    })

    session.flash('success', 'Carte ajoutée. Elle est prête à être révisée.')
    return response.redirect().toPath(`/courses/${params.id}`)
  }
}
