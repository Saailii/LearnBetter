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
          <div className="eyebrow">Aujourd’hui</div>
          <h1>Bonjour {firstName}, on apprend quoi ?</h1>
          <p>Ton programme s’adapte à tes révisions dues et à ton temps disponible.</p>
        </div>
        <Link href="/imports/course" className="button-primary">
          Importer un cours
        </Link>
      </section>

      <section className="stats-grid" aria-label="Vue d’ensemble">
        <article>
          <span>Notions</span>
          <strong>{stats.concepts}</strong>
          <small>dans tes cours</small>
        </article>
        <article>
          <span>Autotests</span>
          <strong>{stats.tests}</strong>
          <small>prêts à pratiquer</small>
        </article>
        <article>
          <span>À réviser</span>
          <strong>{stats.due}</strong>
          <small>pour aujourd’hui</small>
        </article>
        <article>
          <span>Activité</span>
          <strong>{stats.streak}</strong>
          <small>révisions cette semaine</small>
        </article>
      </section>

      <div className="dashboard-columns">
        <section className="panel today-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Programme</span>
              <h2>Ta session du jour</h2>
            </div>
            <span className="time-pill">{todayMinutes} min</span>
          </div>

          {courses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">↗</div>
              <h3>Ton programme est encore vide</h3>
              <p>Importe un premier cours structuré pour préparer tes futures sessions.</p>
              <Link href="/imports/course" className="button-secondary">
                Importer mon premier cours
              </Link>
            </div>
          ) : (
            <div className="session-preview">
              {stats.due > 0 ? (
                <>
                  <div className="session-step">
                    <span>1</span>
                    <div>
                      <strong>Révision espacée</strong>
                      <small>{stats.due} cartes dues maintenant</small>
                    </div>
                  </div>
                  <Link href="/review" className="button-primary">
                    Commencer ma session
                  </Link>
                </>
              ) : (
                <p>
                  Tu es à jour. Vérifie tes brouillons ou crée de nouvelles cartes personnelles.
                </p>
              )}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Bibliothèque</span>
              <h2>Cours récents</h2>
            </div>
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
