/* eslint-disable @adonisjs/prefer-adonisjs-inertia-form, @adonisjs/prefer-adonisjs-inertia-link */
import { Form, Link } from '@inertiajs/react'
import type { InertiaProps } from '../../types.js'

type Card = {
  id: number
  type: string
  front: string
  back: string
  repetitions: number
  sourceType: string | null
  sourceTitle: string | null
  sourceReference: string | null
}

type CourseSource = {
  id: number
  type: string
  title: string
  reference: string | null
}

type SelfTest = {
  id: number
  type: string
  prompt: string
  optionsJson: string | null
  expectedAnswerJson: string
  explanation: string | null
  difficulty: number
}

type Concept = {
  id: number
  title: string
  explanation: string
  masteryState: string
  tests: SelfTest[]
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

const testTypeLabels: Record<string, string> = {
  multiple_choice: 'Choix multiple',
  true_false: 'Vrai ou faux',
  matching: 'Association',
  free_response: 'Réponse libre',
  explanation: 'Explication',
  exercise: 'Exercice',
}

const sourceTypeLabels: Record<string, string> = {
  pdf: 'PDF',
  book: 'Livre',
  video: 'Vidéo',
  transcript: 'Transcription',
  article: 'Article',
  website: 'Site web',
  notes: 'Notes',
}

function parseStoredJson(value: string | null): unknown {
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function formatStudyValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'Vrai' : 'Faux'
  if (Array.isArray(value)) return value.map(formatStudyValue).join(' · ')
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, entry]) => `${key} : ${formatStudyValue(entry)}`)
      .join('\n')
  }
  return String(value)
}

function getDifficultyLabel(difficulty: number) {
  if (difficulty === 1) return 'Accessible'
  if (difficulty === 3) return 'Avancé'
  return 'Intermédiaire'
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
            <span>{chapters.length} chapitres</span>
            <span>{conceptCount} notions</span>
            <span>{testCount} questions</span>
            <span>
              {cardCount} carte{cardCount > 1 ? 's' : ''} personnelle
              {cardCount > 1 ? 's' : ''}
            </span>
            <span>
              {sources.length} source{sources.length > 1 ? 's' : ''}
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
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </section>

      <div className="course-reading-layout">
        <aside className="course-outline">
          <div className="course-outline-heading">
            <span className="section-kicker">Dans ce cours</span>
            <strong>Sommaire</strong>
          </div>
          <nav aria-label="Sommaire du cours">
            <a href="#course-sources" className="outline-source-link">
              <span aria-hidden="true">R</span>
              <span>
                <strong>Références</strong>
                <small>
                  {sources.length} source{sources.length > 1 ? 's' : ''}
                </small>
              </span>
            </a>
            {chapters.map((chapter, chapterIndex) => (
              <a href={`#chapter-${chapter.id}`} key={chapter.id}>
                <span>{String(chapterIndex + 1).padStart(2, '0')}</span>
                <span>
                  <strong>{chapter.title}</strong>
                  <small>
                    {chapter.concepts.length} notion{chapter.concepts.length > 1 ? 's' : ''}
                  </small>
                </span>
              </a>
            ))}
          </nav>
          <p className="outline-help">
            Ouvre une notion pour voir son cours, ses questions et ses cartes.
          </p>
        </aside>

        <main className="course-reading-content">
          <section className="course-sources-section panel" id="course-sources">
            <div className="content-section-heading">
              <div>
                <span className="section-kicker">Bibliographie du cours</span>
                <h2>Références utilisées</h2>
                <p>
                  Ces ressources ont servi à structurer le cours. La source précise d’une carte
                  personnelle est rappelée directement sous sa question et sa réponse.
                </p>
              </div>
              <span className="source-count">{sources.length}</span>
            </div>

            {sources.length > 0 ? (
              <div className="source-library">
                {sources.map((source, sourceIndex) => (
                  <article className="source-library-item" key={source.id}>
                    <span className="source-index">{String(sourceIndex + 1).padStart(2, '0')}</span>
                    <div>
                      <span className="source-type">
                        {sourceTypeLabels[source.type] ?? source.type}
                      </span>
                      <h3>{source.title}</h3>
                      <p>
                        {source.reference ?? 'Référence générale, sans page ou minutage précisé.'}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="source-empty">
                <strong>Aucune référence enregistrée</strong>
                <p>Ce cours a été créé avant l’ajout du suivi des sources.</p>
              </div>
            )}
          </section>

          <div className="chapter-feed">
            {chapters.map((chapter, chapterIndex) => (
              <section className="chapter-section" id={`chapter-${chapter.id}`} key={chapter.id}>
                <header className="chapter-section-heading">
                  <div className="chapter-number">{String(chapterIndex + 1).padStart(2, '0')}</div>
                  <div>
                    <span className="section-kicker">
                      Chapitre {chapterIndex + 1} sur {chapters.length}
                    </span>
                    <h2>{chapter.title}</h2>
                    {chapter.summary && <p>{chapter.summary}</p>}
                  </div>
                </header>

                <div className="concept-stack">
                  {chapter.concepts.map((concept, conceptIndex) => (
                    <details
                      className="concept-card"
                      key={concept.id}
                      open={chapterIndex === 0 && conceptIndex === 0}
                    >
                      <summary>
                        <span className="concept-order">
                          {chapterIndex + 1}.{conceptIndex + 1}
                        </span>
                        <div className="concept-summary-copy">
                          <span className="concept-label">Notion</span>
                          <strong>{concept.title}</strong>
                          <span className="concept-summary-meta">
                            <span>
                              {concept.tests.length} question
                              {concept.tests.length > 1 ? 's' : ''}
                            </span>
                            <span>
                              {concept.cards.length} carte
                              {concept.cards.length > 1 ? 's' : ''}
                            </span>
                          </span>
                        </div>
                        <span className="details-action">
                          <span className="details-action-label">Ouvrir</span>
                          <span className="details-caret" aria-hidden="true">
                            ↓
                          </span>
                        </span>
                      </summary>

                      <div className="concept-content">
                        <section className="learning-block">
                          <div className="block-label">
                            <span>01</span>
                            <div>
                              <strong>Comprendre</strong>
                              <small>Le cœur de la notion</small>
                            </div>
                          </div>
                          <div className="concept-explanation">
                            <p>{concept.explanation}</p>
                          </div>
                        </section>

                        <section className="learning-block">
                          <div className="block-label">
                            <span>02</span>
                            <div>
                              <strong>Se tester</strong>
                              <small>Questions fournies avec le cours</small>
                            </div>
                          </div>

                          {concept.tests.length > 0 ? (
                            <div className="study-test-list">
                              {concept.tests.map((test, testIndex) => {
                                const options = formatStudyValue(parseStoredJson(test.optionsJson))
                                const expectedAnswer = formatStudyValue(
                                  parseStoredJson(test.expectedAnswerJson)
                                )

                                return (
                                  <details className="study-test" key={test.id}>
                                    <summary>
                                      <div className="test-number">{testIndex + 1}</div>
                                      <div className="test-prompt">
                                        <span>
                                          {testTypeLabels[test.type] ?? test.type} ·{' '}
                                          {getDifficultyLabel(test.difficulty)}
                                        </span>
                                        <strong>{test.prompt}</strong>
                                      </div>
                                      <span className="test-reveal">
                                        Voir la réponse <i aria-hidden="true">↓</i>
                                      </span>
                                    </summary>
                                    <div className="test-details">
                                      {options && (
                                        <div className="test-options">
                                          <span>Choix proposés</span>
                                          <p>{options}</p>
                                        </div>
                                      )}
                                      <div className="expected-answer">
                                        <span className="answer-mark" aria-hidden="true">
                                          R
                                        </span>
                                        <div>
                                          <span>Réponse attendue</span>
                                          <p>{expectedAnswer}</p>
                                        </div>
                                      </div>
                                      {test.explanation && (
                                        <div className="answer-explanation">
                                          <span>Pourquoi ?</span>
                                          <p>{test.explanation}</p>
                                        </div>
                                      )}
                                      <div className="source-scope-notice">
                                        <span aria-hidden="true">i</span>
                                        <p>
                                          Cette question vient du contenu importé. Elle s’appuie sur
                                          les{' '}
                                          <a href="#course-sources">
                                            références générales du cours
                                          </a>
                                          , sans source individuelle enregistrée.
                                        </p>
                                      </div>
                                    </div>
                                  </details>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="content-empty-state">
                              <strong>Aucune question pour cette notion</strong>
                              <p>Tu peux tout de même créer une carte personnelle ci-dessous.</p>
                            </div>
                          )}
                        </section>

                        <section className="learning-block">
                          <div className="block-label">
                            <span>03</span>
                            <div>
                              <strong>Mémoriser</strong>
                              <small>Tes cartes personnelles et leurs sources</small>
                            </div>
                          </div>

                          {concept.cards.length > 0 && (
                            <div className="personal-card-list">
                              {concept.cards.map((card, cardIndex) => (
                                <article className="personal-card" key={card.id}>
                                  <header>
                                    <span>Carte {cardIndex + 1}</span>
                                    <span>{cardTypeLabels[card.type] ?? card.type}</span>
                                  </header>
                                  <div className="card-face card-question">
                                    <span>Question</span>
                                    <p>{card.front}</p>
                                  </div>
                                  <div className="card-face card-answer">
                                    <span>Réponse</span>
                                    <p>{card.back}</p>
                                  </div>
                                  <footer
                                    className={
                                      card.sourceTitle
                                        ? 'card-source-reference'
                                        : 'card-source-reference source-missing'
                                    }
                                  >
                                    <span aria-hidden="true">R</span>
                                    <div>
                                      <small>
                                        Source de cette carte
                                        {card.sourceType
                                          ? ` · ${sourceTypeLabels[card.sourceType] ?? card.sourceType}`
                                          : ''}
                                      </small>
                                      <strong>{card.sourceTitle ?? 'Source non renseignée'}</strong>
                                      <p>
                                        {card.sourceReference ??
                                          'Cette carte a été créée avant le suivi des sources.'}
                                      </p>
                                    </div>
                                  </footer>
                                </article>
                              ))}
                            </div>
                          )}

                          <details className="create-card-disclosure">
                            <summary>
                              <span className="create-card-icon" aria-hidden="true">
                                +
                              </span>
                              <span>
                                <strong>Créer une carte personnelle</strong>
                                <small>La question, la réponse et la source resteront liées.</small>
                              </span>
                              <span className="details-caret" aria-hidden="true">
                                ↓
                              </span>
                            </summary>

                            <Form
                              action={`/courses/${course.id}/cards`}
                              method="post"
                              className="card-form"
                            >
                              <input type="hidden" name="conceptId" value={concept.id} />
                              <div className="form-heading">
                                <span className="section-kicker">Nouvelle carte</span>
                                <h3>Une seule idée, avec sa provenance.</h3>
                                <p>
                                  Écris la question et la réponse avec tes mots, puis indique la
                                  ressource utilisée.
                                </p>
                              </div>

                              <label className="card-type-field">
                                Type de carte
                                <select name="type" defaultValue="question_answer">
                                  <option value="question_answer">Question / réponse</option>
                                  <option value="cloze">Texte à trou</option>
                                  <option value="reversible">Réversible</option>
                                </select>
                              </label>

                              {sources.length > 0 ? (
                                <label className="card-source-field">
                                  Source utilisée
                                  <select name="sourceId" required defaultValue="">
                                    <option value="" disabled>
                                      Choisir la ressource exacte
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

                              <label className="card-front-field">
                                Question
                                <textarea
                                  name="front"
                                  rows={2}
                                  required
                                  placeholder="Ex. Quel est le rôle de la membrane plasmique ?"
                                />
                              </label>
                              <label className="card-back-field">
                                Réponse
                                <textarea
                                  name="back"
                                  rows={3}
                                  required
                                  placeholder="Ta réponse, avec tes propres mots"
                                />
                              </label>

                              <p className="form-help">
                                Pour un texte à trou, entoure chaque réponse avec{' '}
                                <code>{'{{double accolades}}'}</code>. Une carte réversible alterne
                                les deux sens à chaque rappel.
                              </p>
                              <button type="submit" className="button-primary">
                                Ajouter la carte
                                <span aria-hidden="true">→</span>
                              </button>
                            </Form>
                          </details>
                        </section>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
