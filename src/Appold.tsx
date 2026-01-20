import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Music, Users, Home, Shield, Zap, X } from 'lucide-react';

interface Local {
  id: string;
  nombre: string;
  tipo: string;
  latitud: number;
  longitud: number;
  estado: 'fuego' | 'caliente' | 'medio' | 'vacio';
  capacidad_actual: number;
  musica_actual?: string;
  promocion?: string;
  tiempo_espera: number;
  tiene_musica_en_vivo: boolean;
  es_zona_segura: boolean;
}

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
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    obtenerLocales();
    const interval = setInterval(() => {
      obtenerLocales();
    }, 10000); // 10 segundos
    return () => clearInterval(interval);
  }, []);

  const obtenerLocales = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/locales`);
      const resultado = await response.json();
      if (resultado.success) {
        setLocales(resultado.data);
      }
    } catch (error) {
      console.error('Error obteniendo locales:', error);
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

  const obtenerColorEstado = (estado: string): string => {
    switch(estado) {
      case 'fuego': return 'from-red-500 to-orange-500';
      case 'caliente': return 'from-purple-500 to-pink-500';
      case 'medio': return 'from-violet-500 to-purple-400';
      case 'vacio': return 'from-gray-600 to-gray-500';
      default: return 'from-gray-600 to-gray-500';
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

      {/* Map */}
      <div className="flex-1 relative">
        {!isLoaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🌃</div>
              <p className="text-lg font-bold">Cargando mapa...</p>
            </div>
          </div>
        ) : (
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
                onClick={() => setLocalSeleccionado(local)}
                animation={
                  local.estado === 'fuego' 
                    ? google.maps.Animation.BOUNCE 
                    : undefined
                }
              />
            ))}
          </GoogleMap>
        )}

        {/* Popup Flotante - Posición fija en la esquina */}
        {localSeleccionado && (
          <div className="fixed top-24 right-4 z-50 w-96 animate-slide-in-right">
            <div className="bg-gray-900 border-2 border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header con gradiente */}
              <div className={`bg-gradient-to-r ${obtenerColorEstado(localSeleccionado.estado)} p-6 relative`}>
                <button
                  onClick={() => setLocalSeleccionado(null)}
                  className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 rounded-full p-2 transition-all"
                >
                  <X size={20} />
                </button>
                
                <h3 className="text-2xl font-bold mb-2 pr-10">{localSeleccionado.nombre}</h3>
                <p className="text-sm opacity-90">{obtenerTextoTipo(localSeleccionado.tipo)}</p>
              </div>

              {/* Contenido */}
              <div className="p-6 space-y-4">
                {/* Badge de estado y capacidad */}
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${obtenerColorEstado(localSeleccionado.estado)}`}>
                    {obtenerTextoEstado(localSeleccionado.estado)}
                  </span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-400">
                      {localSeleccionado.capacidad_actual}%
                    </div>
                    <div className="text-xs text-gray-400">Aforo</div>
                  </div>
                </div>

                {/* Detalles */}
                <div className="space-y-3">
                  {localSeleccionado.musica_actual && (
                    <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <Music size={20} className="text-purple-400 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-400">Sonando ahora</div>
                        <div className="font-medium">{localSeleccionado.musica_actual}</div>
                      </div>
                    </div>
                  )}

                  {localSeleccionado.tiene_musica_en_vivo && (
                    <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-3 flex items-center gap-2">
                      <span className="text-2xl">🎤</span>
                      <span className="font-semibold">Música en vivo AHORA</span>
                    </div>
                  )}

                  {localSeleccionado.promocion && (
                    <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-3 flex items-center gap-3">
                      <Zap size={20} className="text-yellow-300 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-400">Promoción activa</div>
                        <div className="font-bold">{localSeleccionado.promocion}</div>
                      </div>
                    </div>
                  )}

                  {localSeleccionado.tiempo_espera > 0 && (
                    <div className="flex items-center gap-2 text-orange-400 bg-orange-900/20 rounded-lg p-3 border border-orange-500/30">
                      <span className="text-xl">⏱️</span>
                      <span>Tiempo de espera: ~{localSeleccionado.tiempo_espera} min</span>
                    </div>
                  )}

                  {localSeleccionado.es_zona_segura && (
                    <div className="flex items-center gap-2 text-blue-400 bg-blue-900/20 rounded-lg p-3 border border-blue-500/30">
                      <Shield size={18} />
                      <span className="font-medium">Zona Segura Verificada</span>
                    </div>
                  )}
                </div>

                {/* Botón de acción */}
                <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                  🚗 Ir Ahora
                </button>
              </div>
            </div>
          </div>
        )}

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

        {cargando && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-50">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-bounce">🌃</div>
              <p className="text-lg font-bold">Cargando mapa...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
