import { APIResponse } from '../types';

/**
 * Fetch con retry automático y timeout
 */
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
        throw new Error(`HTTP ${response.status}: 
${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Si es el último intento, lanzar error
      if (i === retries - 1) {
        console.error(`❌ Error después de ${retries} intentos:`, error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Error 
desconocido',
        };
      }

      // Esperar antes de reintentar (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, i), 5000);
      console.warn(`⚠️ Intento ${i + 1} falló, reintentando en 
${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  return {
    success: false,
    error: 'Error después de múltiples intentos',
  };
}

/**
 * Obtener locales con retry automático
 */
export async function fetchLocales() {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    console.error('❌ VITE_API_URL no está configurada');
    return {
      success: false,
      error: 'Configuración de API faltante',
      data: [],
    };
  }

  return fetchWithRetry(`${apiUrl}/api/locales`);
}
