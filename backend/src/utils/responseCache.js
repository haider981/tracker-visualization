/**
 * In-memory GET response cache with in-flight request coalescing.
 * When several users load the same dashboard filters at once, only one
 * database round-trip runs per endpoint; others wait for the same result.
 */

function stableQueryString(query) {
  const entries = Object.entries(query || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .filter(([k]) => k !== '_' && k !== 'nocache')
    .sort(([a], [b]) => a.localeCompare(b));

  const params = new URLSearchParams();
  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  }
  return params.toString();
}

function createResponseCache({ ttlMs = 45_000 } = {}) {
  /** @type {Map<string, { data: unknown, expiresAt: number }>} */
  const cache = new Map();
  /** @type {Map<string, Promise<unknown>>} */
  const inflight = new Map();

  function shouldSkip(req) {
    if (req.method !== 'GET') return true;
    if (req.query?._) return true;
    if (req.query?.nocache) return true;
    if (req.get('X-Skip-Cache') === '1') return true;
    return false;
  }

  function cacheKey(req) {
    const qs = stableQueryString(req.query);
    return `${req.baseUrl}${req.path}${qs ? `?${qs}` : ''}`;
  }

  function pruneExpired() {
    const now = Date.now();
    for (const [key, entry] of cache) {
      if (entry.expiresAt <= now) cache.delete(key);
    }
  }

  return function responseCacheMiddleware(req, res, next) {
    if (shouldSkip(req)) return next();

    pruneExpired();

    const key = cacheKey(req);
    const hit = cache.get(key);
    if (hit && hit.expiresAt > Date.now()) {
      res.set('X-Cache', 'HIT');
      res.set(
        'Cache-Control',
        `private, max-age=${Math.max(1, Math.floor((hit.expiresAt - Date.now()) / 1000))}`
      );
      return res.json(hit.data);
    }

    const pending = inflight.get(key);
    if (pending) {
      return pending
        .then((data) => {
          res.set('X-Cache', 'DEDUP');
          res.set('Cache-Control', `private, max-age=${Math.floor(ttlMs / 1000)}`);
          res.json(data);
        })
        .catch((err) => {
          if (!res.headersSent) {
            res.status(500).json({ error: err?.message || 'Cache coalesce failed' });
          }
        });
    }

    let resolveInflight;
    let rejectInflight;
    const inflightPromise = new Promise((resolve, reject) => {
      resolveInflight = resolve;
      rejectInflight = reject;
    });
    inflight.set(key, inflightPromise);

    const originalJson = res.json.bind(res);
    const originalStatus = res.status.bind(res);
    let statusCode = 200;

    res.status = function status(code) {
      statusCode = code;
      return originalStatus(code);
    };

    res.json = function json(body) {
      inflight.delete(key);

      if (statusCode >= 400) {
        rejectInflight(new Error(typeof body?.error === 'string' ? body.error : `HTTP ${statusCode}`));
        return originalJson(body);
      }

      cache.set(key, { data: body, expiresAt: Date.now() + ttlMs });
      resolveInflight(body);
      res.set('X-Cache', 'MISS');
      res.set('Cache-Control', `private, max-age=${Math.floor(ttlMs / 1000)}`);
      return originalJson(body);
    };

    res.on('close', () => {
      if (!res.writableEnded && inflight.has(key)) {
        inflight.delete(key);
        rejectInflight(new Error('Client disconnected'));
      }
    });

    next();
  };
}

module.exports = { createResponseCache, stableQueryString };
