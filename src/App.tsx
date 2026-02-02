import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Users, Home, X, MapPin, Clock, Music, Zap, Shield } from 'lucide-react';
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
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  gestureHandling: 'greedy'
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
  const [mostrarLeyenda, setMostrarLeyenda] = useState(false);
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
        setLocales(resultado.data as Local[]);
      } else {
        console.error('Error obteniendo locales:', resultado.error);
        showToast('Error al cargar locales. Reintentando...', 'error');
      }
    } catch (error) {
      console.error('Error obteniendo locales:', error);
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
    setLocalSeleccionado(local);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Header - Responsive */}
      <div className="bg-black/90 backdrop-blur-md border-b border-purple-500/30 p-3 md:p-4 z-10 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="text-2xl md:text-3xl">🌃</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-heading tracking-tight">
                Nightly
              </h1>
              <p className="text-[10px] md:text-xs text-gray-400 flex items-center gap-1 md:gap-2 font-medium">
                <span className="hidden sm:inline">La Paz •</span>
                <span>{new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="hidden md:flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Auto</span>
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-1 md:gap-2">
            <button 
              onClick={() => setModoEscuadron(!modoEscuadron)}
              className={`px-2 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 transition-all text-xs md:text-sm ${
                modoEscuadron 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Users size={16} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline font-medium">Squad</span>
            </button>
            <button 
              onClick={() => setMostrarLeyenda(!mostrarLeyenda)}
              className="px-2 md:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-1 md:gap-2 transition-all text-xs md:text-sm md:hidden"
            >
              <MapPin size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {!isLoaded ? (
          <Loading message="Cargando mapa..." />
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
                    scaledSize: new google.maps.Size(50, 65),
                    anchor: new google.maps.Point(25, 65)
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

            {/* Legend - Desktop & Mobile Toggle */}
            <div className={`absolute bottom-4 left-4 bg-black/90 backdrop-blur-md rounded-xl p-3 md:p-4 border border-purple-500/30 z-40 transition-all ${
              mostrarLeyenda ? 'block' : 'hidden md:block'
            } max-w-[280px]`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs md:text-sm font-bold text-gray-300">NIVELES</h3>
                <button 
                  onClick={() => setMostrarLeyenda(false)}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex-shrink-0"></div>
                  <span className="text-[10px] md:text-xs">A Reventar (80%+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0"></div>
                  <span className="text-[10px] md:text-xs">Ambiente Bueno (50-80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-violet-500 to-purple-400 flex-shrink-0"></div>
                  <span className="text-[10px] md:text-xs">Tranquilo (20-50%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-gray-600 to-gray-500 flex-shrink-0"></div>
                  <span className="text-[10px] md:text-xs">Vacío (&lt;20%)</span>
                </div>
              </div>
            </div>

            {/* Update Indicator - Repositioned for mobile */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/90 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-green-500/30 flex items-center gap-1.5 md:gap-2 z-40">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] md:text-xs font-medium hidden sm:inline">Auto 10s</span>
            </div>

            {cargando && <Loading message="Cargando locales..." />}
          </>
        )}
      </div>

      {/* MODAL - Premium Design */}
      {localSeleccionado !== null && (
        <>
          {/* Backdrop - MÁS CLARO para ver el mapa */}
          <div 
            className="fixed inset-0 z-[9998]"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
            onClick={() => setLocalSeleccionado(null)}
          />
          
          {/* Modal Container */}
          <div 
            className="fixed inset-0 z-[9999]"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: window.innerWidth >= 768 ? 'center' : 'flex-end',
              justifyContent: 'center',
              padding: window.innerWidth >= 768 ? '16px' : '0',
            }}
          >
            <div 
              className="w-full overflow-y-auto shadow-dramatic animate-fade-in-modal"
              style={{
                pointerEvents: 'auto',
                position: 'relative',
                maxWidth: window.innerWidth >= 768 ? '512px' : '100%',
                maxHeight: window.innerWidth >= 768 ? '85vh' : '80vh',
                borderWidth: window.innerWidth >= 768 ? '1px' : '2px 0 0 0',
                borderRadius: window.innerWidth >= 768 ? '24px' : '32px 32px 0 0',
                background: 'linear-gradient(165deg, #1e293b 0%, #0f172a 100%)',
                borderColor: 'rgba(251, 191, 36, 0.3)',
                boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 10px 30px -5px rgba(251, 191, 36, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Modal Header */}
            <div className="sticky top-0 backdrop-blur-xl border-b p-5 md:p-6 flex items-start justify-between z-10"
              style={{
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)',
                borderColor: 'rgba(251, 191, 36, 0.15)',
              }}
            >
              <div className="flex-1 pr-8">
                <h2 className="text-2xl md:text-3xl font-black mb-2 font-heading tracking-tight leading-tight"
                  style={{
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {localSeleccionado.nombre}
                </h2>
                <p className="text-sm md:text-base font-semibold tracking-wide"
                  style={{
                    color: '#fbbf24',
                  }}
                >
                  {obtenerTextoTipo(localSeleccionado.tipo)}
                </p>
              </div>
              <button
                onClick={() => setLocalSeleccionado(null)}
                className="p-2.5 rounded-full transition-all duration-200 flex-shrink-0 group hover:scale-110"
                style={{
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                }}
              >
                <X size={22} style={{ color: '#fbbf24' }} strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 md:p-6 space-y-4">
              {/* Capacidad */}
              <div className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(251, 191, 36, 0.03) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                }}
              >
                <div className="text-6xl md:text-7xl font-black mb-3 tracking-tighter font-heading"
                  style={{
                    color: '#fbbf24',
                    textShadow: '0 4px 20px rgba(251, 191, 36, 0.3)',
                  }}
                >
                  {localSeleccionado.capacidad_actual}%
                </div>
                <div className="text-lg md:text-xl font-bold tracking-wide text-white">
                  {obtenerTextoEstado(localSeleccionado.estado)}
                </div>
              </div>

              {/* Detalles */}
              <div className="space-y-3">
                {localSeleccionado.musica_actual && (
                  <div className="flex items-start gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Music size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#fbbf24' }}>Música</div>
                      <div className="text-sm md:text-base font-bold" style={{ color: '#ffffff' }}>
                        {localSeleccionado.musica_actual}
                      </div>
                    </div>
                  </div>
                )}
                
                {localSeleccionado.tiene_musica_en_vivo && (
                  <div className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(251, 191, 36, 0.15)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    <Music size={20} style={{ color: '#fbbf24' }} />
                    <span className="text-sm md:text-base font-bold" style={{ color: '#fbbf24' }}>
                      Música en vivo AHORA
                    </span>
                  </div>
                )}
                
                {localSeleccionado.promocion && (
                  <div className="flex items-start gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    <Zap size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#86efac' }}>Promoción</div>
                      <div className="text-sm md:text-base font-bold" style={{ color: '#ffffff' }}>
                        {localSeleccionado.promocion}
                      </div>
                    </div>
                  </div>
                )}
                
                {localSeleccionado.tiempo_espera > 0 && (
                  <div className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(249, 115, 22, 0.15)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                    }}
                  >
                    <Clock size={20} style={{ color: '#fb923c' }} />
                    <span className="text-sm md:text-base font-bold" style={{ color: '#fb923c' }}>
                      Espera: ~{localSeleccionado.tiempo_espera} min
                    </span>
                  </div>
                )}
                
                {localSeleccionado.es_zona_segura && (
                  <div className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <Shield size={20} style={{ color: '#60a5fa' }} />
                    <span className="text-sm md:text-base font-bold" style={{ color: '#93c5fd' }}>
                      Zona Segura Verificada
                    </span>
                  </div>
                )}
              </div>

              {/* Botón Llévame */}
              <button
                onClick={() => {
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${localSeleccionado.latitud},${localSeleccionado.longitud}`, '_blank');
                }}
                className="w-full py-4 md:py-5 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-heading tracking-wide mt-5"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1e293b',
                  boxShadow: '0 10px 30px -10px rgba(251, 191, 36, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
                }}
              >
                <Home size={22} strokeWidth={2.5} />
                Llévame aquí
              </button>
            </div>
          </div>
        </div>
        </>
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
