const BASE_URL = import.meta.env.VITE_API_URL;

export default async function client(endpoint, { body, method, params, headers: customHeaders, ...customConfig } = {}) {
  let url = `${BASE_URL}/api/${endpoint}`;

  if (params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.append(k, v);
    });
    const str = qs.toString();
    if (str) url += `?${str}`;
  }

  const resolvedMethod = method || (body ? 'POST' : 'GET');

  const config = {
    method: resolvedMethod,
    credentials: 'include',
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...customHeaders,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...customConfig,
  };

  const res = await fetch(url, config);

  // Handle 204 No Content
  if (res.status === 204) return { success: true };

  const data = await res.json();
  if (res.ok) return data;

  const err = new Error(data.message || 'Request failed');
  err.status = res.status;
  err.errors = data.errors;
  throw err;
}
