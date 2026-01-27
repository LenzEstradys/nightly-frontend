// ============================================
// TIPOS PRINCIPALES DE LA APLICACIÓN
// ============================================

export interface Local {
  id: string;
  nombre: string;
  tipo: 'bar' | 'club' | 'discoteca' | 'pub' | 'restaurante';
  direccion: string;
  latitud: number;
  longitud: number;
  
  // Estado del local
  estado: 'vacio' | 'medio' | 'caliente' | 'fuego';
  capacidad_actual: number;
  capacidad_maxima?: number;
  
  // Información adicional
  musica_actual?: string;
  promocion?: string;
  tiempo_espera: number;
  tiene_musica_en_vivo: boolean;
  es_zona_segura: boolean;
  
  // Horarios
  horario_apertura?: string;
  horario_cierre?: string;
  
  // Precios y tags
  rango_precio?: string;
  tags?: string[];
  fotos?: string[];
  
  // Propietario
  propietario_id?: string;
  
  // Metadata
  activo: boolean;
  verificado?: boolean;
  codigo_invitacion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  updated_at?: string;
  
  // Redes sociales
  telefono?: string;
  instagram?: string;
  facebook?: string;
  descripcion?: string;
}

// Tipo para locales sanitizados (mismo que Local)
export type LocalSanitized = Local;

// Tipo para respuesta de API
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
  mensaje?: string;
  detalles?: string;
}

// Tipo para estado de la aplicación
export type EstadoLocal = 'vacio' | 'medio' | 'caliente' | 'fuego';
export type TipoLocal = 'bar' | 'club' | 'discoteca' | 'pub' | 
'restaurante';
