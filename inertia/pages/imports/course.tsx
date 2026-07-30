/* eslint-disable @adonisjs/prefer-adonisjs-inertia-form */
import { Form } from '@inertiajs/react'

export default function CourseImport() {
  return (
    <div className="import-page">
      <section className="import-intro">
        <div className="eyebrow">Nouveau brouillon</div>
        <h1>Importer un cours</h1>
        <p>
          Colle ici le JSON produit par ton projet ChatGPT LearnBetter. Le contenu sera vérifié
          avant d’être enregistré comme brouillon.
        </p>

        <div className="guardrail">
          <span aria-hidden="true">✦</span>
          <div>
            <strong>Les cartes restent les tiennes</strong>
            <p>
              L’import accepte les notions et autotests, mais refuse toute carte mémoire générée
              automatiquement.
            </p>
          </div>
        </div>
      </section>

      <section className="panel import-panel">
        <Form action="/imports/course" method="post">
          {({ processing }) => (
            <>
              <div>
                <label htmlFor="payload">Contenu JSON</label>
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
                  {processing ? 'Vérification…' : 'Vérifier et créer le brouillon'}
                </button>
              </div>
            </>
          )}
        </Form>
      </section>
    </div>
  )
}
