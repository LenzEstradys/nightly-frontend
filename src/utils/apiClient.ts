import { APIResponse } from '../types';

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 3,
  timeout = 10000
): Promise<APIResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (i === retries - 1) {
        console.error('Error after retries:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      const waitTime = Math.min(1000 * Math.pow(2, i), 5000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  return {
    success: false,
    error: 'Error after multiple attempts',
  };
}

export async function fetchLocales() {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    return {
      success: false,
      error: 'API configuration missing',
      data: [],
    };
  }

  return fetchWithRetry(apiUrl + '/api/locales', { cache: 'no-store' });
}
