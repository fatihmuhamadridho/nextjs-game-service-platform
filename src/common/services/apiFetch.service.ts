import { BASE_API_URL } from '@configs/base.config';
import { clearAdminCsrfToken, getAdminCsrfToken, setAdminCsrfToken } from '@utils/brandStorage';

export function apiFetch(input: string | URL, init?: RequestInit) {
  const url = input.toString();
  const baseUrl = BASE_API_URL.replace(/\/+$/, '');
  const absoluteUrl = /^https?:\/\//i.test(url) ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;

  const headers = new Headers(init?.headers);
  const requestUrl = new URL(absoluteUrl);
  const requestPath = requestUrl.pathname;
  const isAdminRequest = requestPath.startsWith('/api/admin/');
  const isAdminSessionRequest =
    requestPath === '/api/auth/v1/session' && requestUrl.searchParams.get('accountType') === 'ADMIN';
  const credentials = init?.credentials ?? (isAdminRequest || isAdminSessionRequest ? 'include' : 'omit');
  if (typeof window !== 'undefined' && isAdminRequest && !headers.has('X-CSRF-Token')) {
    const csrfToken = getAdminCsrfToken();
    if (csrfToken) headers.set('X-CSRF-Token', csrfToken);
  }

  return fetch(absoluteUrl, { ...init, headers, credentials }).then(async (response) => {
    if (typeof window !== 'undefined' && requestPath === '/api/admin/auth/v1/logout' && response.ok) {
      clearAdminCsrfToken();
    }
    if (response.status === 204 || !response.headers.get('content-type')?.includes('application/json')) return response;

    try {
      const payload: unknown = await response.clone().json();
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return response;

      const envelope = payload as Record<string, unknown>;
      const data = envelope.data as { csrfToken?: unknown } | undefined;
      if (
        typeof window !== 'undefined' &&
        /\/api\/admin\/auth\/v1\/(?:login|refresh-token)$/.test(requestPath) &&
        typeof data?.csrfToken === 'string'
      ) {
        setAdminCsrfToken(data.csrfToken);
      }
      if (envelope.status || (typeof envelope.code !== 'string' && typeof envelope.message !== 'string')) return response;

      const headers = new Headers(response.headers);
      headers.delete('content-length');
      return new Response(
        JSON.stringify({
          ...envelope,
          status: {
            code: typeof envelope.code === 'string' ? envelope.code : response.ok ? 'SUCCESS' : 'ERROR',
            message: typeof envelope.message === 'string' ? envelope.message : '',
          },
        }),
        { status: response.status, statusText: response.statusText, headers }
      );
    } catch {
      return response;
    }
  });
}

export async function apiRequest<T>(input: string | URL, init?: RequestInit): Promise<T> {
  const response = await apiFetch(input, init);
  const payload = (await response.json().catch(() => null)) as
    | { status?: { message?: string }; message?: string; data?: T }
    | null;
  if (!response.ok) {
    throw new Error(payload?.message ?? payload?.status?.message ?? `Permintaan gagal (${response.status}).`);
  }
  return payload?.data as T;
}
