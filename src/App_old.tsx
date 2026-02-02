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
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Nightly
              </h1>
              <p className="text-[10px] md:text-xs text-gray-400 flex items-center gap-1 md:gap-2">
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

      {/* MODAL - Mobile Optimized */}
      {localSeleccionado !== null && (
        <div 
          className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4"
style={{
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(8px)',
  zIndex: 99999
}}
        >
          <div 
            className="bg-gray-900 rounded-t-3xl md:rounded-2xl w-full md:max-w-lg md:w-full max-h-[85vh] md:max-h-[90vh] overflow-y-auto border-t-2 md:border-2 border-purple-500 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 p-4 md:p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                  {localSeleccionado.nombre}
                </h2>
                <p className="text-sm md:text-base text-gray-400">
                  {obtenerTextoTipo(localSeleccionado.tipo)}
                </p>
              </div>
              <button
                onClick={() => setLocalSeleccionado(null)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-5">
              {/* Capacidad */}
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 md:p-6 border border-purple-500/30">
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                  {localSeleccionado.capacidad_actual}%
                </div>
                <div className="text-base md:text-lg text-white font-medium">
                  {obtenerTextoEstado(localSeleccionado.estado)}
                </div>
              </div>

              {/* Detalles */}
              <div className="space-y-3">
                {localSeleccionado.musica_actual && (
                  <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <Music size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">Música</div>
                      <div className="text-sm md:text-base text-white">{localSeleccionado.musica_actual}</div>
                    </div>
                  </div>
                )}
                
                {localSeleccionado.tiene_musica_en_vivo && (
                  <div className="flex items-center gap-2 p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
                    <Music size={18} className="text-purple-400" />
                    <span className="text-sm md:text-base font-medium text-purple-300">Música en vivo AHORA</span>
                  </div>
                )}
                
                {localSeleccionado.promocion && (
                  <div className="flex items-start gap-3 p-3 bg-green-600/20 rounded-lg border border-green-500/30">
                    <Zap size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">Promoción</div>
                      <div className="text-sm md:text-base text-green-300">{localSeleccionado.promocion}</div>
                    </div>
                  </div>
                )}
                
                {localSeleccionado.tiempo_espera > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-orange-600/20 rounded-lg border border-orange-500/30">
                    <Clock size={18} className="text-orange-400" />
                    <span className="text-sm md:text-base text-orange-300">Espera: ~{localSeleccionado.tiempo_espera} min</span>
                  </div>
                )}
                
                {localSeleccionado.es_zona_segura && (
                  <div className="flex items-center gap-2 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                    <Shield size={18} className="text-blue-400" />
                    <span className="text-sm md:text-base text-blue-300">Zona Segura Verificada</span>
                  </div>
                )}
              </div>

              {/* Botón Llévame */}
              <button
                onClick={() => {
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${localSeleccionado.latitud},${localSeleccionado.longitud}`, '_blank');
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Home size={20} />
                Llévame aquí
              </button>
            </div>
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
