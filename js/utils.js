/**
 * utils.js
 * Utilidades compartidas entre módulos.
 */

/**
 * escHtml — escapa caracteres especiales HTML para insertar en innerHTML.
 * @param {string} s
 * @returns {string}
 */
function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
