import { Link } from '@adonisjs/inertia/react'

export default function NotFound() {
  return (
    <section className="error-state panel">
      <span className="error-code">404</span>
      <span className="section-kicker">Hors du chemin</span>
      <h1>Cette page s’est égarée.</h1>
      <p>Reviens à ton programme pour reprendre là où tu en étais.</p>
      <Link href="/" className="button-primary">
        Revenir à l’accueil
      </Link>
    </section>
  )
}
