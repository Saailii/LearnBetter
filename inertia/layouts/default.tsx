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
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="brand-name">LearnBetter</span>
          </Link>

          <nav className="desktop-nav" aria-label="Navigation principale">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={url.startsWith('/dashboard') ? 'active' : ''}
                  aria-current={url.startsWith('/dashboard') ? 'page' : undefined}
                >
                  Aujourd’hui
                </Link>
                <Link
                  href="/imports/course"
                  className={url.startsWith('/imports') ? 'active' : ''}
                  aria-current={url.startsWith('/imports') ? 'page' : undefined}
                >
                  Importer
                </Link>
                <Link
                  href="/review"
                  className={url.startsWith('/review') ? 'active' : ''}
                  aria-current={url.startsWith('/review') ? 'page' : undefined}
                >
                  Réviser
                </Link>
                <Link
                  href="/settings"
                  className={url.startsWith('/settings') ? 'active' : ''}
                  aria-current={url.startsWith('/settings') ? 'page' : undefined}
                >
                  Réglages
                </Link>
                <div className="account-menu">
                  <span className="avatar" title={user.fullName ?? user.email}>
                    {user.initials}
                  </span>
                  <Form action="/logout" method="post">
                    <button type="submit" className="button-ghost compact">
                      Déconnexion
                    </button>
                  </Form>
                </div>
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
          <Link
            href="/dashboard"
            className={url.startsWith('/dashboard') ? 'active' : ''}
            aria-current={url.startsWith('/dashboard') ? 'page' : undefined}
          >
            <span aria-hidden="true" className="mobile-nav-icon">
              ●
            </span>
            Aujourd’hui
          </Link>
          <Link
            href="/imports/course"
            className={url.startsWith('/imports') ? 'active' : ''}
            aria-current={url.startsWith('/imports') ? 'page' : undefined}
          >
            <span aria-hidden="true" className="mobile-nav-icon">
              +
            </span>
            Importer
          </Link>
          <Link
            href="/review"
            className={url.startsWith('/review') ? 'active' : ''}
            aria-current={url.startsWith('/review') ? 'page' : undefined}
          >
            <span aria-hidden="true" className="mobile-nav-icon">
              ↻
            </span>
            Réviser
          </Link>
          <Link
            href="/settings"
            className={url.startsWith('/settings') ? 'active' : ''}
            aria-current={url.startsWith('/settings') ? 'page' : undefined}
          >
            <span aria-hidden="true" className="mobile-nav-icon">
              ◌
            </span>
            Réglages
          </Link>
        </nav>
      )}

      <Toaster position="top-center" richColors />
    </div>
  )
}
