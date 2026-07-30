import { importCourse, parseCourseImport } from '#services/course_import_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class CourseImportsController {
  async create({ inertia }: HttpContext) {
    return inertia.render('imports/course', {})
  }

  async store({ auth, request, response, session, logger }: HttpContext) {
    let parsed

    try {
      parsed = parseCourseImport(String(request.input('payload', '')))
    } catch (error) {
      session.flash(
        'error',
        error instanceof Error ? error.message : 'Impossible d’importer ce cours.'
      )
      return response.redirect().back()
    }

    try {
      await importCourse(auth.getUserOrFail().id, parsed)
      session.flash('success', `Le cours « ${parsed.course.title} » a été importé comme brouillon.`)
      return response.redirect().toPath('/dashboard')
    } catch (error) {
      logger.error({ err: error }, 'Course import failed after validation')
      session.flash('error', 'Le cours est valide, mais son enregistrement a échoué. Réessaie.')
      return response.redirect().back()
    }
  }
}
