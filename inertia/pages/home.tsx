/* eslint-disable @adonisjs/prefer-adonisjs-inertia-link */
import { Link } from '@inertiajs/react'
import type { InertiaProps } from '../types.js'

export default function Home({ user }: InertiaProps) {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span aria-hidden="true" />
            Ton savoir, enfin bien rythmé
          </div>
          <h1>
            Apprends mieux.
            <br />
            <em>Oublie moins.</em>
          </h1>
          <p>
            LearnBetter transforme tes cours en un rituel d’apprentissage clair, construit autour de
            ta mémoire et du temps que tu as vraiment.
          </p>
          <div className="hero-actions">
            <Link href={user ? '/dashboard' : '/signup'} className="button-primary button-large">
              {user ? 'Ouvrir mon programme' : 'Commencer gratuitement'}
              <span aria-hidden="true">→</span>
            </Link>
            {!user && (
              <Link href="/login" className="button-ghost button-large">
                J’ai déjà un compte
              </Link>
            )}
          </div>
          <div className="hero-proof" aria-label="Avantages">
            <span>Sans coût d’IA</span>
            <span>Adapté à ton rythme</span>
            <span>Installable sur mobile</span>
          </div>
        </div>

        <div className="hero-product" aria-label="Aperçu de LearnBetter">
          <div className="product-window">
            <div className="product-window-top">
              <span className="mini-brand">
                <i />
                <i />
              </span>
              <span>Ma journée</span>
              <span className="product-avatar">IZ</span>
            </div>
            <div className="product-greeting">
              <span>Mardi 30 juillet</span>
              <h2>Un petit pas aujourd’hui.</h2>
              <p>Ton programme tient en 24 minutes.</p>
            </div>
            <div className="product-session">
              <div>
                <span className="session-label">Prochaine session</span>
                <h3>Révision ciblée</h3>
                <p>12 cartes · Biologie cellulaire</p>
              </div>
              <div className="progress-orbit">
                <span>24</span>
                <small>min</small>
              </div>
            </div>
            <div className="product-topics">
              <div>
                <i className="topic-dot topic-indigo" />
                <span>Membrane plasmique</span>
                <strong>6 cartes</strong>
              </div>
              <div>
                <i className="topic-dot topic-mint" />
                <span>Transport cellulaire</span>
                <strong>4 cartes</strong>
              </div>
              <div>
                <i className="topic-dot topic-amber" />
                <span>Signalisation</span>
                <strong>2 cartes</strong>
              </div>
            </div>
          </div>
          <div className="floating-note floating-note-top">
            <span>+ 7 jours</span>
            prochain rappel
          </div>
          <div className="floating-note floating-note-bottom">
            <span>82%</span>
            rappel maîtrisé
          </div>
        </div>
      </section>

      <section className="landing-section-heading">
        <div>
          <span className="section-kicker">Une méthode qui tient dans la durée</span>
          <h2>
            Moins de charge mentale.
            <br />
            Plus de progrès visibles.
          </h2>
        </div>
        <p>
          Tu gardes la main sur le contenu. LearnBetter s’occupe du rythme, des priorités et du
          prochain pas.
        </p>
      </section>

      <section className="method-grid" aria-label="Méthode LearnBetter">
        <article>
          <span className="method-number">01</span>
          <div className="method-visual method-visual-structure" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <h3>Structure ton savoir</h3>
          <p>
            Importe un cours préparé, relis chaque notion et active-le seulement quand il te
            ressemble.
          </p>
        </article>
        <article>
          <span className="method-number">02</span>
          <div className="method-visual method-visual-recall" aria-hidden="true">
            <span>La mitochondrie…</span>
            <strong>Voir la réponse</strong>
          </div>
          <h3>Rappelle activement</h3>
          <p>
            Teste ce que tu sais vraiment et crée les cartes qui comptent, avec tes propres mots.
          </p>
        </article>
        <article>
          <span className="method-number">03</span>
          <div className="method-visual method-visual-rhythm" aria-hidden="true">
            <span>L</span>
            <span>M</span>
            <span>M</span>
            <span>J</span>
            <span>V</span>
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <h3>Reviens au bon moment</h3>
          <p>
            Les révisions se replacent selon tes résultats et le temps disponible dans ta semaine.
          </p>
        </article>
      </section>

      <section className="landing-cta">
        <div>
          <span className="section-kicker">Prêt pour ta prochaine notion ?</span>
          <h2>Fais de la place à ce qui reste.</h2>
        </div>
        <Link href={user ? '/dashboard' : '/signup'} className="button-primary button-large">
          {user ? 'Continuer à apprendre' : 'Créer mon espace'}
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  )
}
