import requestRateLimiter from '#services/request_rate_limiter_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

interface RateLimitOptions {
  limit: number
  windowMs: number
  scope: string
}

export default class RateLimitMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: RateLimitOptions) {
    const result = requestRateLimiter.consume(
      `${options.scope}:${ctx.request.ip()}`,
      options.limit,
      options.windowMs
    )

    ctx.response.header('X-RateLimit-Remaining', String(result.remaining))

    if (!result.allowed) {
      ctx.response.header('Retry-After', String(result.retryAfterSeconds))
      ctx.session.flash(
        'error',
        `Trop de tentatives. Réessaie dans ${result.retryAfterSeconds} secondes.`
      )
      return ctx.response.redirect().back()
    }

    return next()
  }
}
