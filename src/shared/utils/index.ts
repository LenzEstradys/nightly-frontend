/**
 * @nightly/shared/utils — copiado a src/shared/utils
 */
import type { EstadoLocal, TipoLocal } from '../types/index';

export function calcularEstado(capacidad: number): EstadoLocal {
  if (capacidad >= 80) return 'fuego';
  if (capacidad >= 50) return 'caliente';
  if (capacidad >= 20) return 'medio';
  return 'vacio';
}

export function obtenerTextoEstado(estado: EstadoLocal): string {
  const textos: Record<EstadoLocal, string> = {
    'fuego': '🔥 A REVENTAR',
    'caliente': '🎉 AMBIENTE BUENO',
    'medio': '🍹 TRANQUILO',
    'vacio': '😴 VACÍO'
  };
  return textos[estado] || 'DESCONOCIDO';
}

export function obtenerColorEstado(estado: EstadoLocal): string {
  const colores: Record<EstadoLocal, string> = {
    'fuego': 'bg-red-600 text-white',
    'caliente': 'bg-purple-600 text-white',
    'medio': 'bg-blue-600 text-white',
    'vacio': 'bg-gray-600 text-white'
  };
  return colores[estado] || 'bg-gray-600 text-white';
}

export function obtenerColorHexEstado(estado: EstadoLocal): string {
  const colores: Record<EstadoLocal, string> = {
    'fuego': '#ef4444',
    'caliente': '#a855f7',
    'medio': '#8b5cf6',
    'vacio': '#6b7280'
  };
  return colores[estado] || '#6b7280';
}

export function obtenerTextoTipo(tipo: TipoLocal): string {
  const textos: Record<TipoLocal, string> = {
    'bar': '🍺 Bar',
    'club': '🎵 Club',
    'discoteca': '💃 Discoteca',
    'pub': '🍻 Pub',
    'restaurante': '🍴 Restaurante'
  };
  return textos[tipo] || tipo;
}

export function obtenerEmojiTipo(tipo: TipoLocal): string {
  const emojis: Record<TipoLocal, string> = {
    'bar': '🍺',
    'club': '🎵',
    'discoteca': '💃',
    'pub': '🍻',
    'restaurante': '🍴'
  };
  return emojis[tipo] || '📍';
}

export function validarCoordenadasLaPaz(lat: number, lng: number): boolean {
  return lat >= -17 && lat <= -16 && lng >= -69 && lng <= -67;
}

export function validarCapacidad(capacidad: number): boolean {
  return capacidad >= 0 && capacidad <= 100;
}

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarUUID(uuid: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}
