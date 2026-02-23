// ============================================
// IMPORTAR TIPOS BASE DESDE SHARED
// ============================================
export type {
  Local as LocalBase,
  TipoLocal,
  EstadoLocal,
  RolUsuario,
  Perfil,
  ApiResponse,
  Coordenadas,
  CodigoInvitacion,
  SuperAdmin,
  Auditoria,
  LocalCreateDTO,
  LocalUpdateDTO,
} from '@nightly/shared';

// ============================================
// EXTENDER TIPOS PARA FRONTEND
// ============================================

// Local con campos adicionales del frontend
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
  musica_actual?: string | null;
  promocion?: string | null;
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
  codigo_invitacion?: string | null;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  updated_at?: string;
  created_at?: string;
  
  // Redes sociales
  telefono?: string;
  instagram?: string;
  facebook?: string;
  descripcion?: string;
}

// Tipo para locales sanitizados (mismo que Local)
export type LocalSanitized = Local;

// Alias para compatibilidad con shared
export type { ApiResponse as APIResponse } from '@nightly/shared';