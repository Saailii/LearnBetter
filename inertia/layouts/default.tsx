/* eslint-disable @adonisjs/prefer-adonisjs-inertia-form, @adonisjs/prefer-adonisjs-inertia-link */
import { type Data } from '@generated/data'
import { Form, Link, usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { toast, Toaster } from 'sonner'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()
  const user = children.props.user

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (children.props.flash.error) toast.error(children.props.flash.error)
    if (children.props.flash.success) toast.success(children.props.flash.success)
  }, [children.props.flash.error, children.props.flash.success])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand" aria-label="Accueil LearnBetter">
            <span className="brand-mark">L</span>
            <span>LearnBetter</span>
          </Link>

          <nav className="desktop-nav" aria-label="Navigation principale">
            {user ? (
              <>
                <Link href="/dashboard" className={url.startsWith('/dashboard') ? 'active' : ''}>
                  Aujourd’hui
                </Link>
                <Link href="/imports/course" className={url.startsWith('/imports') ? 'active' : ''}>
                  Importer
                </Link>
                <Link href="/review" className={url.startsWith('/review') ? 'active' : ''}>
                  Réviser
                </Link>
                <Link href="/settings" className={url.startsWith('/settings') ? 'active' : ''}>
                  Réglages
                </Link>
                <span className="avatar" title={user.fullName ?? user.email}>
                  {user.initials}
                </span>
                <Form action="/logout" method="post">
                  <button type="submit" className="button-ghost compact">
                    Déconnexion
                  </button>
                </Form>
              </>
            ) : (
              <>
                <Link href="/login">Connexion</Link>
                <Link href="/signup" className="button-primary compact">
                  Commencer
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="page">{children}</main>

      {user && (
        <nav className="mobile-nav" aria-label="Navigation mobile">
          <Link href="/dashboard" className={url.startsWith('/dashboard') ? 'active' : ''}>
            <span aria-hidden="true">◉</span>
            Aujourd’hui
          </Link>
          <Link href="/imports/course" className={url.startsWith('/imports') ? 'active' : ''}>
            <span aria-hidden="true">＋</span>
            Importer
          </Link>
          <Link href="/review" className={url.startsWith('/review') ? 'active' : ''}>
            <span aria-hidden="true">↻</span>
            Réviser
          </Link>
          <Link href="/settings" className={url.startsWith('/settings') ? 'active' : ''}>
            <span aria-hidden="true">⚙</span>
            Réglages
          </Link>
        </nav>
      )}

      <Toaster position="top-center" richColors />
    </div>
  )
}
