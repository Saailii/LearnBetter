import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

const DEFAULT_MINUTES = [20, 30, 30, 30, 30, 30, 20]

export default class SettingsController {
  async show({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const saved = await db
      .from('daily_availabilities')
      .where('user_id', user.id)
      .select('day_of_week as dayOfWeek', 'minutes')

    const availability = DEFAULT_MINUTES.map((minutes, dayOfWeek) => ({
      dayOfWeek,
      minutes: saved.find((entry) => entry.dayOfWeek === dayOfWeek)?.minutes ?? minutes,
    }))

    const calendar = await db
      .from('google_calendar_connections')
      .where('user_id', user.id)
      .select('status', 'calendar_id as calendarId', 'last_synced_at as lastSyncedAt')
      .first()

    return inertia.render('settings/show', {
      availability,
      calendar: calendar ?? { status: 'disconnected' },
    })
  }

  async updateAvailability({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const values = DEFAULT_MINUTES.map((fallback, dayOfWeek) => {
      const value = Number(request.input(`day_${dayOfWeek}`, fallback))
      return {
        dayOfWeek,
        minutes: Number.isFinite(value) ? Math.min(240, Math.max(0, Math.round(value))) : fallback,
      }
    })

    await db.transaction(async (trx) => {
      for (const value of values) {
        await trx
          .insertQuery()
          .table('daily_availabilities')
          .insert({
            user_id: user.id,
            day_of_week: value.dayOfWeek,
            minutes: value.minutes,
          })
          .onConflict(['user_id', 'day_of_week'])
          .merge({ minutes: value.minutes })
      }
    })

    session.flash('success', 'Ton temps disponible a été mis à jour.')
    return response.redirect().toPath('/settings')
  }
}
