/* eslint-disable @adonisjs/prefer-adonisjs-inertia-form, @adonisjs/prefer-adonisjs-inertia-link */
import { Form, Link } from '@inertiajs/react'
import type { InertiaProps } from '../../types.js'

type Card = {
  id: number
  type: string
  front: string
  back: string
  repetitions: number
  sourceTitle: string | null
  sourceReference: string | null
}

type CourseSource = {
  id: number
  type: string
  title: string
  reference: string | null
}

type Concept = {
  id: number
  title: string
  explanation: string
  masteryState: string
  tests: { id: number; type: string; prompt: string; difficulty: number }[]
  cards: Card[]
}

type Chapter = {
  id: number
  title: string
  summary: string | null
  concepts: Concept[]
}

type CourseData = {
  course: {
    id: number
    title: string
    description: string | null
    status: string
    targetDate: string | null
    subject: string | null
    color: string | null
  }
  sources: CourseSource[]
  chapters: Chapter[]
}

const cardTypeLabels: Record<string, string> = {
  question_answer: 'Question / réponse',
  cloze: 'Texte à trou',
  reversible: 'Réversible',
}

export default function CourseShow({ course, sources, chapters }: InertiaProps<CourseData>) {
  const conceptCount = chapters.reduce((total, chapter) => total + chapter.concepts.length, 0)
  const cardCount = chapters.reduce(
    (total, chapter) =>
      total + chapter.concepts.reduce((sum, concept) => sum + concept.cards.length, 0),
    0
  )
  const testCount = chapters.reduce(
    (total, chapter) =>
      total + chapter.concepts.reduce((sum, concept) => sum + concept.tests.length, 0),
    0
  )

  return (
    <div className="course-page">
      <Link href="/dashboard" className="back-link">
        ← Retour à Aujourd’hui
      </Link>

      <section className="course-hero panel">
        <div className="course-hero-main">
          <span className="section-kicker">{course.subject ?? 'Sans matière'}</span>
          <h1>{course.title}</h1>
          <p>{course.description ?? 'Aucune description pour ce cours.'}</p>
          <div className="course-metrics">
            <span>{conceptCount} notions</span>
            <span>{testCount} autotests</span>
            <span>
              {cardCount} carte{cardCount > 1 ? 's' : ''} personnelle
              {cardCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="course-actions">
          <span className={`status status-${course.status}`}>
            {course.status === 'draft' ? 'Brouillon à vérifier' : 'Cours actif'}
          </span>
          {course.status === 'draft' ? (
            <Form action={`/courses/${course.id}/activate`} method="post">
              <button type="submit" className="button-primary">
                Activer ce cours
              </button>
            </Form>
          ) : (
            <Link href="/review" className="button-primary">
              Lancer une révision
            </Link>
          )}
        </div>
      </section>

      <div className="chapter-stack">
        {chapters.map((chapter, chapterIndex) => (
          <section className="panel chapter-card" key={chapter.id}>
            <div className="chapter-heading">
              <div className="chapter-number">{chapterIndex + 1}</div>
              <div>
                <span className="section-kicker">Chapitre</span>
                <h2>{chapter.title}</h2>
                {chapter.summary && <p>{chapter.summary}</p>}
              </div>
            </div>

            <div className="concept-stack">
              {chapter.concepts.map((concept) => (
                <details className="concept-card" key={concept.id} open={chapters.length === 1}>
                  <summary>
                    <div>
                      <strong>{concept.title}</strong>
                      <span>
                        {concept.tests.length} autotest{concept.tests.length > 1 ? 's' : ''} ·{' '}
                        {concept.cards.length} carte{concept.cards.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="details-caret">⌄</span>
                  </summary>

                  <div className="concept-content">
                    <div className="concept-explanation">
                      <h3>À comprendre</h3>
                      <p>{concept.explanation}</p>
                    </div>

                    {concept.tests.length > 0 && (
                      <div>
                        <h3>Autotests importés</h3>
                        <ol className="test-list">
                          {concept.tests.map((test) => (
                            <li key={test.id}>{test.prompt}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {concept.cards.length > 0 && (
                      <div>
                        <h3>Tes cartes</h3>
                        <div className="mini-card-list">
                          {concept.cards.map((card) => (
                            <div className="mini-card" key={card.id}>
                              <span>{cardTypeLabels[card.type] ?? card.type}</span>
                              <strong>{card.front}</strong>
                              <small>
                                Source :{' '}
                                {card.sourceTitle
                                  ? `${card.sourceTitle}${card.sourceReference ? ` — ${card.sourceReference}` : ''}`
                                  : 'non renseignée (carte antérieure)'}
                              </small>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Form
                      action={`/courses/${course.id}/cards`}
                      method="post"
                      className="card-form"
                    >
                      <input type="hidden" name="conceptId" value={concept.id} />
                      <div className="form-heading">
                        <h3>Créer une carte toi-même</h3>
                        <p>Une idée précise par carte donne de meilleures révisions.</p>
                      </div>
                      <label>
                        Type
                        <select name="type" defaultValue="question_answer">
                          <option value="question_answer">Question / réponse</option>
                          <option value="cloze">Texte à trou</option>
                          <option value="reversible">Réversible</option>
                        </select>
                      </label>
                      <p className="form-help">
                        Pour un texte à trou, entoure chaque réponse avec{' '}
                        <code>{'{{double accolades}}'}</code>. Une carte réversible alterne les deux
                        sens à chaque rappel.
                      </p>
                      {sources.length > 0 ? (
                        <label>
                          Source utilisée
                          <select name="sourceId" required defaultValue="">
                            <option value="" disabled>
                              Choisir une source
                            </option>
                            {sources.map((source) => (
                              <option key={source.id} value={source.id}>
                                {source.title}
                                {source.reference ? ` — ${source.reference}` : ''}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : (
                        <p className="form-help">
                          Ce cours ancien ne contient aucune source enregistrée.
                        </p>
                      )}
                      <label>
                        Recto
                        <textarea
                          name="front"
                          rows={2}
                          required
                          placeholder="Ex. Quel est le rôle de la membrane plasmique ?"
                        />
                      </label>
                      <label>
                        Verso
                        <textarea
                          name="back"
                          rows={3}
                          required
                          placeholder="Ta réponse, avec tes propres mots"
                        />
                      </label>
                      <button type="submit" className="button-secondary">
                        Ajouter la carte
                      </button>
                    </Form>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
