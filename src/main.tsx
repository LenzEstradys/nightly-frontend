import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { validateEnv } from './utils/env'
import { ErrorBoundary } from './components/ErrorBoundary'

// Validar variables de entorno al inicio
try {
  validateEnv();
} catch (error) {
  console.error('Error de configuración:', error);
  document.getElementById('root')!.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #1f2937;
      color: white;
      font-family: system-ui;
      padding: 2rem;
      text-align: center;
    ">
      <div>
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ Error de 
Configuración</h1>
        <p style="color: #9ca3af; max-width: 600px;">
          La aplicación no se puede iniciar debido a configuración 
faltante.
          Por favor contacta al administrador.
        </p>
        <pre style="
          background: #111827;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          text-align: left;
          overflow: auto;
        ">${error}</pre>
      </div>
    </div>
  `;
  throw error;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
