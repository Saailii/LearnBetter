import { presentReviewCard } from '#services/card_presentation_service'
import { test } from '@japa/runner'

test.group('Card presentation', () => {
  test('alternates both directions for a reversible card', ({ assert }) => {
    const first = presentReviewCard({
      type: 'reversible',
      front: 'France',
      back: 'Paris',
      repetitions: 0,
    })
    const second = presentReviewCard({
      type: 'reversible',
      front: 'France',
      back: 'Paris',
      repetitions: 1,
    })

    assert.deepEqual(first, { question: 'France', answer: 'Paris' })
    assert.deepEqual(second, { question: 'Paris', answer: 'France' })
  })

  test('masks cloze answers while keeping the complete answer', ({ assert }) => {
    const card = presentReviewCard({
      type: 'cloze',
      front: 'La capitale de la Suisse est {{Berne}}.',
      back: 'Elle est une ville fédérale.',
      repetitions: 0,
    })

    assert.equal(card.question, 'La capitale de la Suisse est […].')
    assert.equal(card.answer, 'La capitale de la Suisse est Berne.\nElle est une ville fédérale.')
  })
})
