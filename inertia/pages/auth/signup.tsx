import { Form, Link } from '@adonisjs/inertia/react'

export default function Signup() {
  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <span className="eyebrow">Un rythme à toi</span>
        <blockquote>Apprends avec intention, reviens au bon moment.</blockquote>
        <ul>
          <li>Un programme adapté à ton temps</li>
          <li>Des révisions guidées par ta mémoire</li>
          <li>Tes contenus, toujours sous ton contrôle</li>
        </ul>
      </aside>

      <div className="form-container">
        <div className="form-heading-block">
          <span className="section-kicker">Première étape</span>
          <h1>Créer ton espace.</h1>
          <p>Quelques informations suffisent pour commencer.</p>
        </div>
        <Form route="new_account.store">
          {({ errors }) => (
            <>
              <div>
                <label htmlFor="fullName">Nom complet</label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  data-invalid={errors.fullName ? 'true' : undefined}
                />
                {errors.fullName && <div>{errors.fullName}</div>}
              </div>

              <div>
                <label htmlFor="email">Adresse e-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
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
                  autoComplete="new-password"
                  data-invalid={errors.password ? 'true' : undefined}
                />
                {errors.password && <div>{errors.password}</div>}
              </div>

              <div>
                <label htmlFor="passwordConfirmation">Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  data-invalid={errors.passwordConfirmation ? 'true' : undefined}
                />
                {errors.passwordConfirmation && <div>{errors.passwordConfirmation}</div>}
              </div>

              <div>
                <button type="submit" className="button-primary">
                  Créer mon espace
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </>
          )}
        </Form>
        <p className="auth-switch">
          Déjà un compte ? <Link href="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
