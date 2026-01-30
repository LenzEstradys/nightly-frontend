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
    const errorMsg = 'Missing variables: ' + missing.join(', ');
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export function getEnv(key: string, required = true): string {
  const value = import.meta.env[key];
  
  if (required && (!value || value === 'undefined')) {
    throw new Error('Variable not found: ' + key);
  }
  
  return value || '';
}
