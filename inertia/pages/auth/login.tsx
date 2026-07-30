import { Form } from '@adonisjs/inertia/react'

export default function Login() {
  return (
    <div className="form-container">
      <div>
        <h1>Bon retour</h1>
        <p>Connecte-toi pour retrouver ton programme.</p>
      </div>

      <div>
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
                <button type="submit" className="button">
                  Se connecter
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
