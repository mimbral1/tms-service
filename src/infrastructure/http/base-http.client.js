export async function requestJson(url, options = {}) {
  if (!url || String(url).startsWith('undefined')) {
    throw new Error('HTTP request URL is not configured');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      body?.error?.message ||
        body?.message ||
        `HTTP request failed with status ${response.status}`,
    );

    error.statusCode = response.status;
    error.body = body;

    throw error;
  }

  return body;
}
