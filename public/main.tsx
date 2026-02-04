import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration.scope);
        
        // Verificar actualizaciones cada hora
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
        
        // Manejar actualizaciones del SW
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Hay una nueva versión disponible
                console.log('🆕 Nueva versión disponible');
                // Aquí podrías mostrar un toast al usuario
                if (confirm('Nueva versión disponible. ¿Recargar?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('❌ Error al registrar Service Worker:', error);
      });
  });
}

// Prompt de instalación PWA
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  console.log('💡 PWA instalable');
  
  // Mostrar botón de instalación personalizado (opcional)
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ Usuario aceptó instalar PWA');
        } else {
          console.log('❌ Usuario rechazó instalar PWA');
        }
        deferredPrompt = null;
      });
    });
  }
});

// Detectar cuando se instala
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA instalada exitosamente');
  deferredPrompt = null;
  
  // Opcional: enviar evento a analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'pwa_installed', {
      event_category: 'engagement',
      event_label: 'PWA Installation',
    });
  }
});

// Detectar si está corriendo como PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('🚀 Ejecutando como PWA');
  document.documentElement.classList.add('pwa-mode');
}
