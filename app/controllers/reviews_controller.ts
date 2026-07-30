import { scheduleReview, type ReviewGrade } from '#services/review_scheduler_service'
import { presentReviewCard } from '#services/card_presentation_service'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

const GRADES: ReviewGrade[] = ['again', 'hard', 'good', 'easy']

export default class ReviewsController {
  async show({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const now = new Date()

    const [{ total }] = await db
      .from('flashcards')
      .join('concepts', 'concepts.id', 'flashcards.concept_id')
      .join('chapters', 'chapters.id', 'concepts.chapter_id')
      .join('courses', 'courses.id', 'chapters.course_id')
      .where('courses.user_id', user.id)
      .where('courses.status', 'active')
      .where((query) =>
        query.whereNull('flashcards.due_at').orWhere('flashcards.due_at', '<=', now)
      )
      .count('* as total')

    const dueCard = await db
      .from('flashcards')
      .join('concepts', 'concepts.id', 'flashcards.concept_id')
      .join('chapters', 'chapters.id', 'concepts.chapter_id')
      .join('courses', 'courses.id', 'chapters.course_id')
      .leftJoin('subjects', 'subjects.id', 'courses.subject_id')
      .leftJoin('course_sources', 'course_sources.id', 'flashcards.course_source_id')
      .where('courses.user_id', user.id)
      .where('courses.status', 'active')
      .where((query) =>
        query.whereNull('flashcards.due_at').orWhere('flashcards.due_at', '<=', now)
      )
      .select(
        'flashcards.id',
        'flashcards.type',
        'flashcards.front',
        'flashcards.back',
        'flashcards.reversible',
        'flashcards.interval_days as intervalDays',
        'flashcards.repetitions',
        'flashcards.lapses',
        'concepts.title as concept',
        'courses.title as course',
        'subjects.name as subject',
        'subjects.color',
        'course_sources.title as sourceTitle',
        'course_sources.reference as sourceReference'
      )
      .orderBy('flashcards.due_at', 'asc')
      .first()

    return inertia.render('reviews/show', {
      card: dueCard ? { ...dueCard, ...presentReviewCard(dueCard) } : null,
      remaining: Number(total),
    })
  }

  async store({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const cardId = Number(request.input('cardId'))
    const grade = String(request.input('grade')) as ReviewGrade

    if (!GRADES.includes(grade)) {
      session.flash('error', 'Cette évaluation est inconnue.')
      return response.redirect().back()
    }

    const card = await db
      .from('flashcards')
      .join('concepts', 'concepts.id', 'flashcards.concept_id')
      .join('chapters', 'chapters.id', 'concepts.chapter_id')
      .join('courses', 'courses.id', 'chapters.course_id')
      .where('flashcards.id', cardId)
      .where('courses.user_id', user.id)
      .where('courses.status', 'active')
      .select(
        'flashcards.id',
        'flashcards.interval_days as intervalDays',
        'flashcards.repetitions',
        'flashcards.lapses'
      )
      .first()

    if (!card) return response.notFound()

    const reviewedAt = new Date()
    const schedule = scheduleReview(card, grade, reviewedAt)

    const recorded = await db.transaction(async (trx) => {
      const updated = await trx
        .from('flashcards')
        .where('id', card.id)
        .where((query) => query.whereNull('due_at').orWhere('due_at', '<=', reviewedAt))
        .update({
          due_at: schedule.dueAt,
          last_reviewed_at: reviewedAt,
          interval_days: schedule.intervalDays,
          repetitions: schedule.repetitions,
          lapses: schedule.lapses,
          updated_at: reviewedAt,
        })

      if (!updated) return false

      await trx.table('review_attempts').insert({
        user_id: user.id,
        flashcard_id: card.id,
        grade,
        reviewed_at: reviewedAt,
      })

      return true
    })

    if (!recorded) {
      session.flash('error', 'Cette carte a déjà été évaluée. La file a été actualisée.')
    }

    return response.redirect().toPath('/review')
  }
}
