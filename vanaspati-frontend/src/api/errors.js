export function getApiErrorMessage(error, fallback = 'Request failed.') {
  if (!error) return fallback;

  const fromInterceptor = error.userMessage;
  if (fromInterceptor && typeof fromInterceptor === 'string') {
    return fromInterceptor;
  }

  const fromApi = error?.response?.data?.message;
  if (fromApi && typeof fromApi === 'string') {
    return fromApi;
  }

  if (error.message && typeof error.message === 'string') {
    return error.message;
  }

  return fallback;
}
