import { Link } from '@adonisjs/inertia/react'

export default function ServerError() {
  return (
    <section className="error-state panel">
      <span className="error-code">500</span>
      <span className="section-kicker">Petite pause</span>
      <h1>Quelque chose a bloqué.</h1>
      <p>Ton travail est conservé. Réessaie dans un instant ou retourne à ton programme.</p>
      <Link href="/dashboard" className="button-primary">
        Retour au programme
      </Link>
    </section>
  )
}
