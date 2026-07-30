/* eslint-disable @adonisjs/prefer-adonisjs-inertia-link */
import { Link } from '@inertiajs/react'
import type { InertiaProps } from '../types.js'

type Course = {
  id: number
  title: string
  description: string | null
  status: string
  targetDate: string | null
  subject: string | null
  color: string | null
}

type DashboardData = {
  courses: Course[]
  stats: {
    concepts: number
    tests: number
    due: number
    streak: number
  }
  todayMinutes: number
}

export default function Dashboard({
  courses,
  stats,
  todayMinutes,
  user,
}: InertiaProps<DashboardData>) {
  const firstName = user?.fullName?.split(' ')[0] ?? 'toi'

  return (
    <div className="dashboard">
      <section className="dashboard-heading">
        <div>
          <div className="eyebrow">Ton espace du jour</div>
          <h1>Bonjour {firstName}.</h1>
          <p>Voici le chemin le plus simple pour continuer à avancer aujourd’hui.</p>
        </div>
        <Link href="/imports/course" className="button-secondary">
          <span aria-hidden="true">+</span>
          Nouveau cours
        </Link>
      </section>

      <section className="stats-grid" aria-label="Vue d’ensemble">
        <article>
          <span className="stat-icon stat-icon-indigo" aria-hidden="true">
            N
          </span>
          <div>
            <span>Notions</span>
            <strong>{stats.concepts}</strong>
            <small>dans tes cours</small>
          </div>
        </article>
        <article>
          <span className="stat-icon stat-icon-mint" aria-hidden="true">
            A
          </span>
          <div>
            <span>Autotests</span>
            <strong>{stats.tests}</strong>
            <small>prêts à pratiquer</small>
          </div>
        </article>
        <article>
          <span className="stat-icon stat-icon-amber" aria-hidden="true">
            R
          </span>
          <div>
            <span>À réviser</span>
            <strong>{stats.due}</strong>
            <small>pour aujourd’hui</small>
          </div>
        </article>
        <article>
          <span className="stat-icon stat-icon-rose" aria-hidden="true">
            S
          </span>
          <div>
            <span>Cette semaine</span>
            <strong>{stats.streak}</strong>
            <small>révisions faites</small>
          </div>
        </article>
      </section>

      <div className="dashboard-columns">
        <section className="panel today-panel" data-has-courses={courses.length > 0}>
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Prochaine étape</span>
              <h2>Ta session du jour</h2>
            </div>
            <span className="time-pill">
              <strong>{todayMinutes}</strong> min
            </span>
          </div>

          {courses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">
                +
              </div>
              <h3>Ton programme est encore vide</h3>
              <p>Ajoute un premier cours structuré. LearnBetter préparera ensuite le bon rythme.</p>
              <Link href="/imports/course" className="button-secondary">
                Importer mon premier cours
              </Link>
            </div>
          ) : (
            <div className="session-preview">
              {stats.due > 0 ? (
                <>
                  <div className="session-step">
                    <span className="session-step-mark" aria-hidden="true">
                      ↻
                    </span>
                    <div>
                      <strong>Révision espacée</strong>
                      <small>{stats.due} cartes dues maintenant</small>
                    </div>
                  </div>
                  <div className="session-footer">
                    <p>Un rappel actif, sans relire le cours.</p>
                    <Link href="/review" className="button-primary">
                      Commencer
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="all-caught-up">
                  <span aria-hidden="true">✓</span>
                  <div>
                    <strong>Tout est à jour</strong>
                    <p>Profite de l’élan pour vérifier un brouillon ou créer une nouvelle carte.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Bibliothèque</span>
              <h2>Tes cours</h2>
            </div>
            {courses.length > 0 && <span className="panel-count">{courses.length}</span>}
          </div>

          <div className="course-list">
            {courses.length === 0 ? (
              <p className="muted">Aucun cours pour le moment.</p>
            ) : (
              courses.map((course) => (
                <Link href={`/courses/${course.id}`} className="course-row" key={course.id}>
                  <span
                    className="course-color"
                    style={{ backgroundColor: course.color ?? '#6d5dfc' }}
                  />
                  <div>
                    <strong>{course.title}</strong>
                    <small>{course.subject ?? 'Sans matière'}</small>
                  </div>
                  <span className={`status status-${course.status}`}>
                    {course.status === 'draft' ? 'Brouillon' : 'Actif'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
