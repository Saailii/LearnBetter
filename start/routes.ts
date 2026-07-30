/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router
      .post('signup', [controllers.NewAccount, 'store'])
      .use(middleware.rateLimit({ scope: 'signup', limit: 5, windowMs: 60 * 60 * 1000 }))

    router.get('login', [controllers.Session, 'create'])
    router
      .post('login', [controllers.Session, 'store'])
      .use(middleware.rateLimit({ scope: 'login', limit: 10, windowMs: 15 * 60 * 1000 }))
  })
  .use(middleware.guest())

router
  .group(() => {
    router.get('dashboard', [controllers.Dashboard, 'show']).as('dashboard')
    router.get('imports/course', [controllers.CourseImports, 'create']).as('course_imports.create')
    router.post('imports/course', [controllers.CourseImports, 'store']).as('course_imports.store')
    router.get('courses/:id', [controllers.Courses, 'show']).as('courses.show')
    router.post('courses/:id/activate', [controllers.Courses, 'activate']).as('courses.activate')
    router.post('courses/:id/cards', [controllers.Courses, 'storeCard']).as('courses.cards.store')
    router.get('review', [controllers.Reviews, 'show']).as('reviews.show')
    router.post('review', [controllers.Reviews, 'store']).as('reviews.store')
    router.get('settings', [controllers.Settings, 'show']).as('settings.show')
    router
      .post('settings/availability', [controllers.Settings, 'updateAvailability'])
      .as('settings.availability')
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
