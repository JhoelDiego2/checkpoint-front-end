/**
 * Mapeamento explícito de status para a lista pessoal de jogos.
 * Rótulos de interface (PT-BR) e valores canônicos armazenados.
 */

export const STATUS_OPTIONS = [
  { value: 'quero-jogar', label: 'quero jogar' },
  { value: 'jogando', label: 'jogando' },
  { value: 'jogado', label: 'jogado' },
];

export const STATUS_MAP = {
  'quero-jogar': 'quero jogar',
  'jogando': 'jogando',
  'jogado': 'jogado',
};

export const REVERSE_STATUS_MAP = {
  'quero jogar': 'quero-jogar',
  'jogando': 'jogando',
  'jogado': 'jogado',
};

/**
 * Valida se um valor canônico é válido.
 * @param {string} value 
 * @returns {boolean}
 */
export function isValidCanonicalStatus(value) {
  return Object.prototype.hasOwnProperty.call(STATUS_MAP, value);
}

/**
 * Valida se um rótulo de interface é válido.
 * @param {string} label 
 * @returns {boolean}
 */
export function isValidInterfaceLabel(label) {
  return Object.prototype.hasOwnProperty.call(REVERSE_STATUS_MAP, label);
}

/**
 * Retorna o rótulo de interface para um valor canônico.
 * @param {string} canonicalValue 
 * @returns {string}
 */
export function getInterfaceLabel(canonicalValue) {
  return STATUS_MAP[canonicalValue] || canonicalValue;
}

/**
 * Retorna o valor canônico para um rótulo de interface.
 * @param {string} interfaceLabel 
 * @returns {string}
 */
export function getCanonicalValue(interfaceLabel) {
  return REVERSE_STATUS_MAP[interfaceLabel] || interfaceLabel;
}
