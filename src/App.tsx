import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Users, Home } from 'lucide-react';
import { sanitizeLocal, sanitizeLocales } from './utils/sanitize';
import { Local } from './types';
import { fetchLocales } from './utils/apiClient';
import { Toast, useToast } from './components/Toast';
import { Loading } from './components/Loading';

const mapContainerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: -16.5000,
  lng: -68.1193
};

const mapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] }
  ],
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true
};

const crearIconoPersonalizado = (tipo: string, estado: string): string => {
  const colores: Record<string, string> = {
    'fuego': '#ef4444',
    'caliente': '#a855f7',
    'medio': '#8b5cf6',
    'vacio': '#6b7280'
  };

  const iconos: Record<string, string> = {
    'bar': '🍺',
    'club': '🎵',
    'discoteca': '💃',
    'pub': '🍻',
    'restaurante': '🍴'
  };

  const color = colores[estado] || '#6b7280';
  const emoji = iconos[tipo] || '📍';

  const svg = `
    <svg width="60" height="80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="75" rx="15" ry="3" fill="black" opacity="0.3"/>
      ${estado === 'fuego' || estado === 'caliente' ? `
        <circle cx="30" cy="30" r="25" fill="${color}" opacity="0.3">
          <animate attributeName="r" from="20" to="30" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      ` : ''}
      <path d="M30 10 C20 10 12 18 12 28 C12 38 30 55 30 55 C30 55 48 38 48 28 C48 18 40 10 30 10 Z" 
            fill="${color}" 
            stroke="white" 
            stroke-width="2"/>
      <circle cx="30" cy="28" r="12" fill="white" opacity="0.9"/>
      <text x="30" y="33" font-size="16" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>
  `;

  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};

function App() {
  const [locales, setLocales] = useState<Local[]>([]);
  const [localSeleccionado, setLocalSeleccionado] = useState<Local | null>(null);
  const [cargando, setCargando] = useState(true);
  const [modoEscuadron, setModoEscuadron] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    obtenerLocales();
    const interval = setInterval(() => {
      obtenerLocales();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const obtenerLocales = async () => {
    try {
      const resultado = await fetchLocales();
      
      if (resultado.success && resultado.data) {
        const localesSanitizados = sanitizeLocales(resultado.data);
        setLocales(localesSanitizados);
      } else {
        console.error('❌ Error obteniendo locales:', resultado.error);
        showToast('Error al cargar locales. Reintentando...', 'error');
      }
    } catch (error) {
      console.error('❌ Error obteniendo locales:', error);
      showToast('No se pudo conectar con el servidor', 'error');
    } finally {
      setCargando(false);
    }
  };

  const obtenerTextoEstado = (estado: string): string => {
    switch(estado) {
      case 'fuego': return '🔥 A REVENTAR';
      case 'caliente': return '🎉 AMBIENTE BUENO';
      case 'medio': return '🍹 TRANQUILO';
      case 'vacio': return '😴 VACÍO';
      default: return 'CERRADO';
    }
  };

  const obtenerTextoTipo = (tipo: string): string => {
    const tipos: Record<string, string> = {
      'bar': '🍺 Bar',
      'club': '🎵 Club',
      'discoteca': '💃 Discoteca',
      'pub': '🍻 Pub',
      'restaurante': '🍴 Restaurante'
    };
    return tipos[tipo] || tipo;
  };

  const handleMarkerClick = (local: Local) => {
    console.log('🎯 Marker clicked:', local.nombre);
    const localSanitizado = sanitizeLocal(local);
    setLocalSeleccionado(localSanitizado);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-md border-b border-purple-500/30 p-4 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🌃</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Nightly
              </h1>
              <p className="text-xs text-gray-400 flex items-center gap-2">
                La Paz • {new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Actualización automática</span>
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setModoEscuadron(!modoEscuadron)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                modoEscuadron 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Users size={18} />
              <span className="text-sm font-medium">Squad</span>
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-all">
              <Home size={18} />
              <span className="text-sm font-medium">Llévame</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {!isLoaded ? (
          <Loading message="Cargando mapa de Google..." />
        ) : (
          <>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={14}
              options={mapOptions}
            >
              {locales.map((local) => (
                <Marker
                  key={local.id}
                  position={{ lat: local.latitud, lng: local.longitud }}
                  icon={{
                    url: crearIconoPersonalizado(local.tipo, local.estado),
                    scaledSize: new google.maps.Size(60, 80),
                    anchor: new google.maps.Point(30, 80)
                  }}
                  onClick={() => handleMarkerClick(local)}
                  animation={
                    local.estado === 'fuego' 
                      ? google.maps.Animation.BOUNCE 
                      : undefined
                  }
                />
              ))}
            </GoogleMap>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-purple-500/30 z-40">
              <h3 className="text-xs font-bold mb-2 text-gray-400">NIVELES DE AMBIENTE</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500"></div>
                  <span className="text-xs">A Reventar (80%+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <span className="text-xs">Ambiente Bueno (50-80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-violet-500 to-purple-400"></div>
                  <span className="text-xs">Tranquilo (20-50%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-600 to-gray-500"></div>
                  <span className="text-xs">Vacío (&lt;20%)</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-700">
                <h3 className="text-xs font-bold mb-2 text-gray-400">TIPOS DE LOCAL</h3>
                <div className="space-y-1 text-xs">
                  <div>🍺 Bar  🍻 Pub</div>
                  <div>🎵 Club  💃 Discoteca</div>
                  <div>🍴 Restaurante</div>
                </div>
              </div>
            </div>

            {/* Indicador de actualización */}
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md rounded-lg px-3 py-2 border border-green-500/30 flex items-center gap-2 z-40">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium">Actualización cada 10s</span>
            </div>

            {cargando && <Loading message="Cargando locales..." />}
          </>
        )}
      </div>

      {/* MODAL */}
      {localSeleccionado !== null && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999
          }}
          onClick={() => setLocalSeleccionado(null)}
        >
          <div 
            style={{
              backgroundColor: '#1F2937',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              border: '2px solid #a855f7'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'white' }}>
              {localSeleccionado.nombre}
            </h2>
            
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
              {obtenerTextoTipo(localSeleccionado.tipo)}
            </p>
            
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#a855f7', marginBottom: '16px' }}>
              {localSeleccionado.capacidad_actual}% de aforo
            </div>
            
            <div style={{ color: 'white', marginBottom: '16px' }}>
              {obtenerTextoEstado(localSeleccionado.estado)}
            </div>
            
            {localSeleccionado.musica_actual && (
              <div style={{ color: 'white', marginBottom: '8px' }}>
                🎵 {localSeleccionado.musica_actual}
              </div>
            )}
            
            {localSeleccionado.tiene_musica_en_vivo && (
              <div style={{ color: '#a855f7', marginBottom: '8px', fontWeight: 'bold' }}>
                🎤 Música en vivo AHORA
              </div>
            )}
            
            {localSeleccionado.promocion && (
              <div 
                style={{ color: '#10b981', marginBottom: '8px' }}
                dangerouslySetInnerHTML={{ __html: `⚡ ${localSeleccionado.promocion}` }}
              />
            )}
            
            {localSeleccionado.tiempo_espera > 0 && (
              <div style={{ color: '#f59e0b', marginBottom: '8px' }}>
                ⏱️ Tiempo de espera: ~{localSeleccionado.tiempo_espera} min
              </div>
            )}
            
            {localSeleccionado.es_zona_segura && (
              <div style={{ color: '#3b82f6', marginBottom: '8px' }}>
                🛡️ Zona Segura Verificada
              </div>
            )}
            
            <button
              onClick={() => setLocalSeleccionado(null)}
              style={{
                width: '100%',
                backgroundColor: '#a855f7',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                marginTop: '16px'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default App;
