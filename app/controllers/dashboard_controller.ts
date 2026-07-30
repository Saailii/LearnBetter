import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import { appTimezone } from '#config/app'
import { DateTime } from 'luxon'

export default class DashboardController {
  async show({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const now = DateTime.now().setZone(appTimezone)
    const nowAsDate = now.toJSDate()
    const courses = await db
      .from('courses')
      .leftJoin('subjects', 'subjects.id', 'courses.subject_id')
      .where('courses.user_id', user.id)
      .select(
        'courses.id',
        'courses.title',
        'courses.description',
        'courses.status',
        'courses.target_date as targetDate',
        'subjects.name as subject',
        'subjects.color'
      )
      .orderBy('courses.updated_at', 'desc')
      .orderBy('courses.created_at', 'desc')
      .limit(6)

    const [{ total: conceptCount }] = await db
      .from('concepts')
      .join('chapters', 'chapters.id', 'concepts.chapter_id')
      .join('courses', 'courses.id', 'chapters.course_id')
      .where('courses.user_id', user.id)
      .count('* as total')

    const [{ total: testCount }] = await db
      .from('self_tests')
      .join('concepts', 'concepts.id', 'self_tests.concept_id')
      .join('chapters', 'chapters.id', 'concepts.chapter_id')
      .join('courses', 'courses.id', 'chapters.course_id')
      .where('courses.user_id', user.id)
      .count('* as total')

    const [{ total: dueCount }] = await db
      .from('flashcards')
      .join('concepts', 'concepts.id', 'flashcards.concept_id')
      .join('chapters', 'chapters.id', 'concepts.chapter_id')
      .join('courses', 'courses.id', 'chapters.course_id')
      .where('courses.user_id', user.id)
      .where('courses.status', 'active')
      .where((query) =>
        query.whereNull('flashcards.due_at').orWhere('flashcards.due_at', '<=', nowAsDate)
      )
      .count('* as total')

    const availability = await db
      .from('daily_availabilities')
      .where('user_id', user.id)
      .where('day_of_week', now.weekday % 7)
      .select('minutes')
      .first()

    const [{ total: reviewCount }] = await db
      .from('review_attempts')
      .where('user_id', user.id)
      .where('reviewed_at', '>=', now.minus({ days: 7 }).toJSDate())
      .count('* as total')

    return inertia.render('dashboard', {
      courses,
      stats: {
        concepts: Number(conceptCount),
        tests: Number(testCount),
        due: Number(dueCount),
        streak: Number(reviewCount),
      },
      todayMinutes: availability?.minutes ?? 30,
    })
  }
}
