/* eslint-disable @adonisjs/prefer-adonisjs-inertia-form */
import { Form } from '@inertiajs/react'
import type { InertiaProps } from '../../types.js'

type SettingsData = {
  availability: { dayOfWeek: number; minutes: number }[]
  calendar: {
    status: string
    calendarId?: string | null
    lastSyncedAt?: string | null
  }
}

const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export default function SettingsShow({ availability, calendar }: InertiaProps<SettingsData>) {
  return (
    <div className="settings-page">
      <section className="dashboard-heading">
        <div>
          <div className="eyebrow">Préférences</div>
          <h1>Ton rythme d’apprentissage</h1>
          <p>LearnBetter utilise ce temps pour composer un programme réaliste chaque jour.</p>
        </div>
      </section>

      <div className="settings-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Planification</span>
              <h2>Temps disponible</h2>
            </div>
          </div>
          <Form action="/settings/availability" method="post" className="availability-form">
            {availability.map((entry) => (
              <label key={entry.dayOfWeek}>
                <span>{dayNames[entry.dayOfWeek]}</span>
                <span className="minute-input">
                  <input
                    type="number"
                    name={`day_${entry.dayOfWeek}`}
                    min="0"
                    max="240"
                    step="5"
                    defaultValue={entry.minutes}
                  />
                  min
                </span>
              </label>
            ))}
            <button type="submit" className="button-primary">
              Enregistrer mon rythme
            </button>
          </Form>
        </section>

        <section className="panel calendar-panel">
          <div className="calendar-icon">31</div>
          <span className="section-kicker">Google Agenda</span>
          <h2>Synchronisation à venir</h2>
          <p>
            Le modèle est prêt pour une synchronisation LearnBetter → Google Agenda. La connexion
            OAuth sera activée dès que les identifiants Google du projet seront configurés.
          </p>
          <span className={`status status-${calendar.status}`}>
            {calendar.status === 'connected' ? 'Connecté' : 'Non connecté'}
          </span>
        </section>
      </div>
    </div>
  )
}
