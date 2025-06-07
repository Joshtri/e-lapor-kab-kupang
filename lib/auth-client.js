export function getUserIdFromCookie() {
  if (typeof window === 'undefined') return null;

  const match = document.cookie.match(/auth_token=([^;]+)/);
  if (!match) return null;

  try {
    const payloadBase64 = match[1].split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.id ?? null;
  } catch (err) {
    return null;
  }
}
