// ============================================
// TIPOS PARA FRONTEND — sin dependencia @nightly/shared
// ============================================

export type TipoLocal = 'bar' | 'club' | 'discoteca' | 'pub' | 'restaurante';
export type EstadoLocal = 'vacio' | 'medio' | 'caliente' | 'fuego';
export type RolUsuario = 'admin' | 'propietario';

export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  mensaje?: string;
  total?: number;
}

export type APIResponse<T = unknown> = ApiResponse<T>;

export interface Perfil {
  id: string;
  rol: RolUsuario;
  local_asignado_id?: string | null;
  nombre_completo?: string | null;
  email?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CodigoInvitacion {
  id: string;
  codigo: string;
  usado: boolean;
  created_by: string;
  usado_por?: string | null;
  fecha_uso?: string | null;
  created_at: string;
}

export interface SuperAdmin {
  user_id: string;
  nombre: string;
  email: string;
  created_at: string;
}

export interface Auditoria {
  id: string;
  tabla: string;
  registro_id: string;
  accion: 'INSERT' | 'UPDATE' | 'DELETE';
  usuario_id?: string | null;
  cambios: Record<string, unknown>;
  created_at: string;
}

export interface LocalCreateDTO {
  nombre: string;
  tipo: TipoLocal;
  direccion: string;
  latitud: number;
  longitud: number;
  estado?: EstadoLocal;
  capacidad_actual?: number;
  musica_actual?: string;
  promocion?: string;
  tiene_musica_en_vivo?: boolean;
  es_zona_segura?: boolean;
}

export interface LocalUpdateDTO {
  capacidad_actual?: number;
  estado?: EstadoLocal;
  musica_actual?: string | null;
  promocion?: string | null;
  tiempo_espera?: number;
  tiene_musica_en_vivo?: boolean;
}

// Local con todos los campos del frontend
export interface Local {
  id: string;
  nombre: string;
  tipo: TipoLocal;
  direccion: string;
  latitud: number;
  longitud: number;
  estado: EstadoLocal;
  capacidad_actual: number;
  capacidad_maxima?: number;
  plan?: 'basico' | 'profesional' | 'premium';
  musica_actual?: string | null;
  promocion?: string | null;
  tiempo_espera: number;
  tiene_musica_en_vivo: boolean;
  es_zona_segura: boolean;
  horario_apertura?: string;
  horario_cierre?: string;
  rango_precio?: string;
  tags?: string[];
  fotos?: string[];
  propietario_id?: string;
  activo: boolean;
  verificado?: boolean;
  codigo_invitacion?: string | null;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  updated_at?: string;
  created_at?: string;
  telefono?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  descripcion?: string;
}

export type LocalBase = Local;
export type LocalSanitized = Local;
