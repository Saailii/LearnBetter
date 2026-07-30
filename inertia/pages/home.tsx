/* eslint-disable @adonisjs/prefer-adonisjs-inertia-link */
import { Link } from '@inertiajs/react'
import type { InertiaProps } from '../types.js'

export default function Home({ user }: InertiaProps) {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="eyebrow">Apprendre moins au hasard</div>
        <h1>La bonne notion, au bon moment.</h1>
        <p>
          LearnBetter transforme tes cours en un programme quotidien basé sur la répétition espacée,
          les autotests et les connexions entre les idées.
        </p>
        <div className="hero-actions">
          <Link href={user ? '/dashboard' : '/signup'} className="button-primary">
            {user ? 'Ouvrir mon programme' : 'Créer mon espace'}
          </Link>
          {!user && (
            <Link href="/login" className="button-secondary">
              J’ai déjà un compte
            </Link>
          )}
        </div>
      </section>

      <section className="method-grid" aria-label="Méthode LearnBetter">
        <article>
          <span>01</span>
          <h2>Structure ton savoir</h2>
          <p>Importe les cours préparés dans ChatGPT, puis valide chaque brouillon.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Récupère activement</h2>
          <p>Réponds à des autotests variés et crée toi-même les cartes importantes.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Reviens au bon moment</h2>
          <p>Ton calendrier adapte les révisions à tes résultats et à ton temps disponible.</p>
        </article>
      </section>
    </div>
  )
}
