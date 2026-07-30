/* eslint-disable @adonisjs/prefer-adonisjs-inertia-form, @adonisjs/prefer-adonisjs-inertia-link */
import { Form, Link } from '@inertiajs/react'
import { useState } from 'react'
import type { InertiaProps } from '../../types.js'

type ReviewData = {
  card: {
    id: number
    type: string
    question: string
    answer: string
    concept: string
    course: string
    subject: string | null
    color: string | null
    sourceTitle: string | null
    sourceReference: string | null
  } | null
  remaining: number
}

export default function ReviewShow({ card, remaining }: InertiaProps<ReviewData>) {
  const [revealedCardId, setRevealedCardId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!card) {
    return (
      <div className="review-page">
        <section className="panel review-complete">
          <span className="completion-mark">✓</span>
          <span className="section-kicker">Session terminée</span>
          <h1>Tu es à jour.</h1>
          <p>Les prochaines cartes reviendront au bon moment selon tes réponses.</p>
          <Link href="/dashboard" className="button-primary">
            Revenir à Aujourd’hui
          </Link>
        </section>
      </div>
    )
  }

  const revealed = revealedCardId === card.id

  return (
    <div className="review-page">
      <header className="review-heading">
        <Link href="/dashboard" className="back-link">
          × Quitter
        </Link>
        <div>
          <strong>{remaining}</strong>
          <span> carte{remaining > 1 ? 's' : ''} à revoir</span>
        </div>
      </header>

      <section className="review-card panel" style={{ borderTopColor: card.color ?? '#6d5dfc' }}>
        <div className="review-context">
          <span>{card.subject ?? 'Sans matière'}</span>
          <span>·</span>
          <span>{card.course}</span>
          <span>·</span>
          <span>{card.concept}</span>
          {card.sourceTitle && (
            <>
              <span>·</span>
              <span>
                Source : {card.sourceTitle}
                {card.sourceReference ? ` — ${card.sourceReference}` : ''}
              </span>
            </>
          )}
        </div>
        <div className="review-question">
          <span className="section-kicker">Question</span>
          <h1>{card.question}</h1>
        </div>

        {!revealed ? (
          <button
            type="button"
            className="button-primary reveal-button"
            onClick={() => setRevealedCardId(card.id)}
          >
            Afficher la réponse
          </button>
        ) : (
          <div className="answer-zone">
            <div className="review-answer">
              <span className="section-kicker">Réponse</span>
              <p style={{ whiteSpace: 'pre-line' }}>{card.answer}</p>
            </div>
            <p className="rating-prompt">Comment était ton rappel ?</p>
            <Form
              action="/review"
              method="post"
              className="rating-grid"
              onStart={() => setSubmitting(true)}
              onFinish={() => setSubmitting(false)}
            >
              <input type="hidden" name="cardId" value={card.id} />
              <button
                type="submit"
                name="grade"
                value="again"
                className="rating-again"
                disabled={submitting}
              >
                <strong>À revoir</strong>
                <small>demain</small>
              </button>
              <button
                type="submit"
                name="grade"
                value="hard"
                className="rating-hard"
                disabled={submitting}
              >
                <strong>Difficile</strong>
                <small>bientôt</small>
              </button>
              <button
                type="submit"
                name="grade"
                value="good"
                className="rating-good"
                disabled={submitting}
              >
                <strong>Correct</strong>
                <small>intervalle normal</small>
              </button>
              <button
                type="submit"
                name="grade"
                value="easy"
                className="rating-easy"
                disabled={submitting}
              >
                <strong>Facile</strong>
                <small>plus tard</small>
              </button>
            </Form>
          </div>
        )}
      </section>
    </div>
  )
}
