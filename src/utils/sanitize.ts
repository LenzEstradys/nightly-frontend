import DOMPurify from 'dompurify';

/**
 * 🛡️ SANITIZADOR DE CONTENIDO
 * Protege contra ataques XSS limpiando HTML malicioso
 */

interface SanitizeOptions {
  allowHtml?: boolean;
  allowedTags?: string[];
}

/**
 * Sanitiza texto plano o HTML
 */
export const sanitize = (
  dirty: string | null | undefined,
  options: SanitizeOptions = {}
): string => {
  if (!dirty) return '';

  const { allowHtml = false, allowedTags = [] } = options;

  if (!allowHtml) {
    // Modo estricto: NO permitir ningún HTML
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
  }

  // Modo permisivo: permitir solo tags específicos
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: allowedTags.length > 0 ? allowedTags : ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

/**
 * Sanitiza nombre de local
 */
export const sanitizeLocalName = (name: string | null | undefined): string => {
  return sanitize(name, { allowHtml: false });
};

/**
 * Sanitiza descripción o promoción (permite formato básico)
 */
export const sanitizeDescription = (description: string | null | undefined): string => {
  return sanitize(description, {
    allowHtml: true,
    allowedTags: ['b', 'i', 'strong', 'em', 'br']
  });
};

/**
 * Sanitiza música actual
 */
export const sanitizeMusic = (music: string | null | undefined): string => {
  return sanitize(music, { allowHtml: false });
};

/**
 * Sanitiza dirección
 */
export const sanitizeAddress = (address: string | null | undefined): string => {
  return sanitize(address, { allowHtml: false });
};

/**
 * Sanitiza cualquier campo de entrada de usuario
 */
export const sanitizeUserInput = (input: string | null | undefined): string => {
  return sanitize(input, { allowHtml: false });
};

/**
 * Sanitiza objeto completo de local
 */
export interface LocalSanitized {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  musica_actual?: string;
  promocion?: string;
  latitud: number;
  longitud: number;
  [key: string]: any;
}

export const sanitizeLocal = (local: any): LocalSanitized => {
  return {
    ...local,
    nombre: sanitizeLocalName(local.nombre),
    direccion: sanitizeAddress(local.direccion),
    musica_actual: local.musica_actual ? sanitizeMusic(local.musica_actual) : undefined,
    promocion: local.promocion ? sanitizeDescription(local.promocion) : undefined,
  };
};

/**
 * Sanitiza array de locales
 */
export const sanitizeLocales = (locales: any[]): LocalSanitized[] => {
  return locales.map(sanitizeLocal);
};
