interface RateLimitBucket {
  count: number
  resetAt: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export class RequestRateLimiter {
  #buckets = new Map<string, RateLimitBucket>()

  consume(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
    const current = this.#buckets.get(key)
    const bucket =
      !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current

    if (bucket.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      }
    }

    bucket.count += 1
    this.#buckets.set(key, bucket)

    if (this.#buckets.size > 10_000) {
      for (const [bucketKey, value] of this.#buckets) {
        if (value.resetAt <= now) this.#buckets.delete(bucketKey)
      }
    }

    return {
      allowed: true,
      remaining: Math.max(0, limit - bucket.count),
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    }
  }
}

export default new RequestRateLimiter()
