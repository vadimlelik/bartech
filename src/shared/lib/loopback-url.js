/**
 * Внутренний адрес API из middleware.
 * За nginx request.url становится https://0.0.0.0:PORT
 * (X-Forwarded-Proto + HOSTNAME). Процесс слушает только http://127.0.0.1:PORT.
 */
export function loopbackApiUrl(requestUrl, pathname, port = process.env.PORT) {
  const parsed = new URL(requestUrl);
  const resolvedPort = port || parsed.port || '3000';
  return new URL(pathname, `http://127.0.0.1:${resolvedPort}`);
}
