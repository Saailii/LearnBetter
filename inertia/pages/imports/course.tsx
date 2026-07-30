/* eslint-disable @adonisjs/prefer-adonisjs-inertia-form */
import { Form } from '@inertiajs/react'

export default function CourseImport() {
  return (
    <div className="import-page">
      <section className="import-intro">
        <div className="eyebrow">Ajouter à ta bibliothèque</div>
        <h1>Importer un cours</h1>
        <p>
          Colle le contenu préparé par ton projet ChatGPT LearnBetter. Nous le vérifions avant de
          créer un brouillon que tu gardes entièrement sous contrôle.
        </p>

        <div className="guardrail">
          <span className="guardrail-icon" aria-hidden="true">
            ✓
          </span>
          <div>
            <strong>Les cartes restent les tiennes</strong>
            <p>
              L’import accepte les notions et autotests, mais refuse toute carte mémoire générée
              automatiquement.
            </p>
          </div>
        </div>

        <ol className="import-steps">
          <li className="active">
            <span>1</span>
            <div>
              <strong>Coller</strong>
              <small>le fichier structuré</small>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>Vérifier</strong>
              <small>notions et sources</small>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>Activer</strong>
              <small>quand tout est juste</small>
            </div>
          </li>
        </ol>
      </section>

      <section className="panel import-panel">
        <div className="import-panel-heading">
          <div>
            <span className="section-kicker">Étape 1 sur 3</span>
            <h2>Contenu du cours</h2>
          </div>
          <span className="format-pill">JSON · v1</span>
        </div>
        <Form action="/imports/course" method="post">
          {({ processing }) => (
            <>
              <div>
                <label htmlFor="payload">Colle le contenu JSON ici</label>
                <textarea
                  id="payload"
                  name="payload"
                  rows={20}
                  spellCheck={false}
                  placeholder={
                    '{\n  "format": "learnbetter.course",\n  "version": 1,\n  "course": { ... }\n}'
                  }
                  required
                />
                <p className="field-help">
                  Format attendu : <code>learnbetter.course</code>, version 1.
                </p>
              </div>

              <div className="form-actions">
                <button type="submit" className="button-primary" disabled={processing}>
                  {processing ? 'Vérification…' : 'Vérifier le contenu'}
                  {!processing && <span aria-hidden="true">→</span>}
                </button>
              </div>
            </>
          )}
        </Form>
      </section>
    </div>
  )
}
