import { RequestRateLimiter } from '#services/request_rate_limiter_service'
import { test } from '@japa/runner'

test.group('Request rate limiter', () => {
  test('blocks requests after the configured limit', ({ assert }) => {
    const limiter = new RequestRateLimiter()

    assert.isTrue(limiter.consume('login:127.0.0.1', 2, 60_000, 1_000).allowed)
    assert.isTrue(limiter.consume('login:127.0.0.1', 2, 60_000, 2_000).allowed)

    const blocked = limiter.consume('login:127.0.0.1', 2, 60_000, 3_000)
    assert.isFalse(blocked.allowed)
    assert.equal(blocked.retryAfterSeconds, 58)
  })

  test('opens a fresh bucket after the window expires', ({ assert }) => {
    const limiter = new RequestRateLimiter()

    limiter.consume('signup:127.0.0.1', 1, 10_000, 1_000)
    assert.isFalse(limiter.consume('signup:127.0.0.1', 1, 10_000, 2_000).allowed)
    assert.isTrue(limiter.consume('signup:127.0.0.1', 1, 10_000, 11_000).allowed)
  })
})
