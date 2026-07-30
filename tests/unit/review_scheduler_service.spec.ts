import { scheduleReview } from '#services/review_scheduler_service'
import { test } from '@japa/runner'

const reviewedAt = new Date('2026-07-30T08:00:00.000Z')

test.group('Review scheduler', () => {
  test('reprogramme une carte oubliée dès le lendemain', ({ assert }) => {
    const result = scheduleReview(
      { intervalDays: 12, repetitions: 4, lapses: 1 },
      'again',
      reviewedAt
    )

    assert.equal(result.intervalDays, 1)
    assert.equal(result.repetitions, 0)
    assert.equal(result.lapses, 2)
    assert.equal(result.dueAt.toISOString(), '2026-07-31T08:00:00.000Z')
  })

  test('espace progressivement les rappels corrects', ({ assert }) => {
    const first = scheduleReview({ intervalDays: 0, repetitions: 0, lapses: 0 }, 'good', reviewedAt)
    const second = scheduleReview(first, 'good', reviewedAt)
    const third = scheduleReview(second, 'good', reviewedAt)

    assert.equal(first.intervalDays, 1)
    assert.equal(second.intervalDays, 3)
    assert.equal(third.intervalDays, 6)
  })

  test('accorde un intervalle plus long à une réponse facile', ({ assert }) => {
    const result = scheduleReview(
      { intervalDays: 3, repetitions: 2, lapses: 0 },
      'easy',
      reviewedAt
    )

    assert.equal(result.intervalDays, 8)
    assert.equal(result.repetitions, 3)
  })
})
