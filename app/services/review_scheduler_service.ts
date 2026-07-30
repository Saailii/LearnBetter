export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy'

type ReviewState = {
  intervalDays: number
  repetitions: number
  lapses: number
}

export type ReviewSchedule = ReviewState & {
  dueAt: Date
}

const DAY_IN_MS = 24 * 60 * 60 * 1000

export function scheduleReview(
  state: ReviewState,
  grade: ReviewGrade,
  reviewedAt = new Date()
): ReviewSchedule {
  let intervalDays: number
  let repetitions = state.repetitions
  let lapses = state.lapses

  if (grade === 'again') {
    intervalDays = 1
    repetitions = 0
    lapses += 1
  } else if (grade === 'hard') {
    intervalDays = Math.max(1, Math.round(Math.max(state.intervalDays, 1) * 1.2))
    repetitions += 1
  } else if (grade === 'easy') {
    intervalDays =
      repetitions === 0 ? 4 : Math.max(4, Math.round(Math.max(state.intervalDays, 1) * 2.5))
    repetitions += 1
  } else {
    intervalDays =
      repetitions === 0
        ? 1
        : repetitions === 1
          ? 3
          : Math.max(3, Math.round(Math.max(state.intervalDays, 1) * 2))
    repetitions += 1
  }

  return {
    intervalDays,
    repetitions,
    lapses,
    dueAt: new Date(reviewedAt.getTime() + intervalDays * DAY_IN_MS),
  }
}
