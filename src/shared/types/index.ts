/**
 * @nightly/shared/config
 * Configuración y constantes compartidas
 */

// ============================================
// CONFIGURACIÓN DE LA APP
// ============================================

export const APP_CONFIG = {
  nombre: 'Nightly',
  descripcion: 'Descubre la vida nocturna en tiempo real',
  version: '1.0.0',
  autor: 'Nightly Team',
  url_produccion: 'https://nightlybo.com',
  url_admin: 'https://admin.nightlybo.com',
} as const;

// ============================================
// COORDENADAS DE LA PAZ
// ============================================

export const LA_PAZ_CENTER = {
  lat: -16.5000,
  lng: -68.1193,
} as const;

export const LA_PAZ_BOUNDS = {
  norte: -16.0,
  sur: -17.0,
  este: -67.0,
  oeste: -69.0,
} as const;
export const BOLIVIA_BOUNDS = {
  norte: -9.5,   // Pando
  sur: -23.0,    // Tarija
  este: -57.0,   // Santa Cruz
  oeste: -70.0,  // Oruro
} as const;

// ============================================
// LÍMITES Y VALIDACIONES
// ============================================

export const LIMITES = {
  capacidad: {
    min: 0,
    max: 100,
  },
  tiempo_espera: {
    min: 0,
    max: 120, // 2 horas
  },
  nombre_local: {
    min: 3,
    max: 100,
  },
  direccion: {
    min: 10,
    max: 200,
  },
  descripcion: {
    min: 20,
    max: 500,
  },
  codigo_invitacion: {
    longitud: 8,
  },
} as const;

// ============================================
// UMBRALES DE CAPACIDAD
// ============================================

export const UMBRALES_CAPACIDAD = {
  vacio: 0,
  medio: 20,
  caliente: 50,
  fuego: 80,
} as const;

// ============================================
// INTERVALOS DE ACTUALIZACIÓN
// ============================================

export const INTERVALOS = {
  polling_locales: 10000, // 10 segundos
  polling_stats: 30000, // 30 segundos
  session_check: 60000, // 1 minuto
  analytics_flush: 300000, // 5 minutos
} as const;

// ============================================
// RATE LIMITS
// ============================================

export const RATE_LIMITS = {
  usuario_normal: {
    ventana_ms: 60000, // 1 minuto
    max_requests: 60,
  },
  propietario: {
    ventana_ms: 60000,
    max_requests: 120,
  },
  admin: {
    ventana_ms: 60000,
    max_requests: 300,
  },
} as const;

// ============================================
// MENSAJES DE ERROR
// ============================================

export const MENSAJES_ERROR = {
  // Generales
  error_generico: 'Algo salió mal. Por favor intenta de nuevo.',
  sin_conexion: 'No hay conexión a internet.',
  sesion_expirada: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
  
  // Autenticación
  credenciales_invalidas: 'Email o contraseña incorrectos.',
  email_en_uso: 'Este email ya está registrado.',
  codigo_invalido: 'Código de invitación inválido.',
  codigo_usado: 'Este código ya fue utilizado.',
  
  // Validaciones
  email_invalido: 'Por favor ingresa un email válido.',
  password_corta: 'La contraseña debe tener al menos 8 caracteres.',
  campos_requeridos: 'Por favor completa todos los campos requeridos.',
  coordenadas_invalidas: 'Las coordenadas deben estar dentro de La Paz.',
  capacidad_invalida: 'La capacidad debe estar entre 0 y 100%.',
  
  // Permisos
  sin_permisos: 'No tienes permisos para realizar esta acción.',
  solo_admin: 'Esta acción solo está disponible para administradores.',
  solo_propietario: 'Esta acción solo está disponible para propietarios.',
  
  // Recursos
  local_no_encontrado: 'Local no encontrado.',
  usuario_no_encontrado: 'Usuario no encontrado.',
  registro_no_encontrado: 'Registro no encontrado.',
  
  // Rate limiting
  demasiadas_peticiones: 'Demasiadas peticiones. Intenta de nuevo en 1 minuto.',
} as const;

// ============================================
// MENSAJES DE ÉXITO
// ============================================

export const MENSAJES_EXITO = {
  local_creado: '¡Local creado exitosamente!',
  local_actualizado: '¡Local actualizado correctamente!',
  local_eliminado: 'Local eliminado correctamente.',
  
  perfil_actualizado: 'Perfil actualizado correctamente.',
  
  codigo_generado: 'Código de invitación generado.',
  codigo_copiado: 'Código copiado al portapapeles.',
  
  sesion_iniciada: '¡Bienvenido a Nightly!',
  sesion_cerrada: 'Sesión cerrada correctamente.',
  registro_exitoso: '¡Registro exitoso! Bienvenido a Nightly.',
} as const;

// ============================================
// COLORES DEL TEMA
// ============================================

export const COLORES = {
  primary: '#fbbf24', // Amarillo dorado
  secondary: '#a855f7', // Púrpura
  accent: '#ec4899', // Rosa
  
  bg_dark: '#0f172a', // Fondo oscuro
  bg_card: '#1e293b', // Fondo de cards
  
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  text_primary: '#ffffff',
  text_secondary: '#94a3b8',
  text_muted: '#64748b',
} as const;

// ============================================
// ICONOS POR TIPO
// ============================================

export const ICONOS_TIPO = {
  bar: '🍺',
  club: '🎵',
  discoteca: '💃',
  pub: '🍻',
  restaurante: '🍴',
} as const;

// ============================================
// EMOJIS DE ESTADO
// ============================================

export const EMOJIS_ESTADO = {
  fuego: '🔥',
  caliente: '🎉',
  medio: '🍹',
  vacio: '😴',
} as const;

// ============================================
// REGEX DE VALIDACIÓN
// ============================================

export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  telefono_bolivia: /^(\+591)?[67]\d{7}$/,
  solo_numeros: /^\d+$/,
  solo_letras: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  alfanumerico: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/,
} as const;

// ============================================
// DÍAS DE LA SEMANA
// ============================================

export const DIAS_SEMANA = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const;

export const DIAS_SEMANA_CORTO = [
  'Lun',
  'Mar',
  'Mié',
  'Jue',
  'Vie',
  'Sáb',
  'Dom',
] as const;

// ============================================
// MESES
// ============================================

export const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const;

// ============================================
// ZONAS HORARIAS
// ============================================

export const ZONA_HORARIA_BOLIVIA = 'America/La_Paz';
export const UTC_OFFSET_BOLIVIA = -4;

// ============================================
// URLS DE REDES SOCIALES
// ============================================

export const REDES_SOCIALES = {
  facebook: 'https://facebook.com/nightlybo',
  instagram: 'https://instagram.com/nightlybo',
  twitter: 'https://twitter.com/nightlybo',
  tiktok: 'https://tiktok.com/@nightlybo',
} as const;

// ============================================
// CONFIGURACIÓN DE MAPA
// ============================================

export const MAPA_CONFIG = {
  zoom_default: 14,
  zoom_min: 12,
  zoom_max: 18,
  marker_scale: 50,
  marker_anchor: 25,
} as const;

// ============================================
// CONFIGURACIÓN DE PAGINACIÓN
// ============================================

export const PAGINACION = {
  items_por_pagina_default: 20,
  items_por_pagina_max: 100,
  items_por_pagina_opciones: [10, 20, 50, 100],
} as const;

// ============================================
// TIPOS DE NOTIFICACIÓN
// ============================================

export const TIPOS_NOTIFICACION = {
  local_cerca: 'local_cerca',
  promo_activa: 'promo_activa',
  musica_en_vivo: 'musica_en_vivo',
  local_abierto: 'local_abierto',
  capacidad_baja: 'capacidad_baja',
} as const;

// ============================================
// FEATURE FLAGS (para A/B testing futuro)
// ============================================

export const FEATURE_FLAGS = {
  mostrar_favoritos: false,
  mostrar_reviews: false,
  mostrar_chat: false,
  mostrar_reservas: false,
  modo_squad: false,
  notificaciones_push: false,
} as const;

// ============================================
// ANALYTICS EVENTS
// ============================================

export const ANALYTICS_EVENTS = {
  ver_local: 'ver_local',
  abrir_navegacion: 'abrir_navegacion',
  compartir_local: 'compartir_local',
  favorito_agregado: 'favorito_agregado',
  filtro_aplicado: 'filtro_aplicado',
  busqueda_realizada: 'busqueda_realizada',
  
  // Admin
  local_actualizado: 'local_actualizado',
  codigo_generado: 'codigo_generado',
  propietario_registrado: 'propietario_registrado',
} as const;
