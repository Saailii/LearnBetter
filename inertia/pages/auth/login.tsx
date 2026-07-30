import { Form, Link } from '@adonisjs/inertia/react'

export default function Login() {
  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <span className="eyebrow">Continuer le chemin</span>
        <blockquote>« La mémoire se construit moins en relisant qu’en retrouvant. »</blockquote>
        <p>Ton programme reprend exactement là où tu l’as laissé.</p>
      </aside>

      <div className="form-container">
        <div className="form-heading-block">
          <span className="section-kicker">Connexion</span>
          <h1>Bon retour.</h1>
          <p>Retrouve ton programme et ta prochaine notion.</p>
        </div>
        <Form route="session.store">
          {({ errors }) => (
            <>
              <div>
                <label htmlFor="email">Adresse e-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="username"
                  data-invalid={errors.email ? 'true' : undefined}
                />
                {errors.email && <div>{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                />
                {errors.password ? <span>{errors.password}</span> : ''}
              </div>

              <div>
                <button type="submit" className="button-primary">
                  Ouvrir mon espace
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </>
          )}
        </Form>
        <p className="auth-switch">
          Nouveau ici ? <Link href="/signup">Créer un espace</Link>
        </p>
      </div>
    </div>
  )
}
