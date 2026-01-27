/**
 * Validar que todas las variables de entorno requeridas existan
 */
export function validateEnv(): void {
  const required = [
    'VITE_API_URL',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];

  const missing = required.filter(key => {
    const value = import.meta.env[key];
    return !value || value === 'undefined' || value === '';
  });

  if (missing.length > 0) {
    const errorMsg = `❌ Faltan variables de entorno requeridas: 
${missing.join(', ')}`;
    console.error(errorMsg);
    console.error('📝 Verifica tu archivo .env o configuración en 
Vercel');
    throw new Error(errorMsg);
  }

  console.log('✅ Variables de entorno validadas correctamente');
}

/**
 * Obtener variable de entorno con validación
 */
export function getEnv(key: string, required = true): string {
  const value = import.meta.env[key];
  
  if (required && (!value || value === 'undefined')) {
    throw new Error(`Variable de entorno requerida no encontrada: 
${key}`);
  }
  
  return value || '';
}
