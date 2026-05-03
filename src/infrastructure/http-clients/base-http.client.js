export async function requestJson(url, options = {}) {
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

export class BaseHttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  request(path, options = {}) {
    return requestJson(`${this.baseUrl}${path}`, options);
  }
}
