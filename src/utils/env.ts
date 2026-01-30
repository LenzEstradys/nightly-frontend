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
    const errorMsg = `Missing required environment variables: ${missing.join(', ')}`;
    console.error(errorMsg);
    console.error('Check your .env file or Vercel configuration');
    throw new Error(errorMsg);
  }

  console.log('Environment variables validated successfully');
}

export function getEnv(key: string, required = true): string {
  const value = import.meta.env[key];
  
  if (required && (!value || value === 'undefined')) {
    throw new Error(`Required environment variable not found: ${key}`);
  }
  
  return value || '';
}
