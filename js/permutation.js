/**
 * permutation.js
 * Algoritmo de Cifrado por Permutación de Grupos.
 *
 * La clave es una permutación de números 1..n separados por comas.
 * Ej: "3,1,4,2"
 *
 * Cifrado:  para cada bloque B de tamaño n → salida[j] = B[key[j]-1]
 * Descifrado: calcula la permutación inversa y aplica.
 */

/**
 * parsePermKey
 * Convierte "3,1,4,2" en el arreglo [3,1,4,2] (1-indexed).
 * Lanza un Error si la clave no es una permutación válida.
 * @param {string} raw
 * @returns {number[]}
 */
function parsePermKey(raw) {
  var parts = raw.split(',').map(function (s) {
    return parseInt(s.trim(), 10);
  });

  if (parts.some(isNaN)) {
    throw new Error(
      'La clave debe ser números separados por comas. Ej: 3,1,4,2'
    );
  }

  var n = parts.length;
  var sorted = parts.slice().sort(function (a, b) { return a - b; });

  for (var i = 0; i < n; i++) {
    if (sorted[i] !== i + 1) {
      throw new Error(
        'La clave debe ser una permutación de 1..' + n +
        '. Recibido: ' + parts.join(',')
      );
    }
  }

  return parts;
}

/**
 * permutationEncrypt
 * @param {string}   msg  Texto plano
 * @param {number[]} key  Permutación 1-indexed (parsePermKey)
 * @returns {{ result: string, steps: string[] }}
 */
function permutationEncrypt(msg, key) {
  var n = key.length;

  // Rellenar con 'X' para completar el último bloque
  var padded = msg;
  while (padded.length % n !== 0) padded += 'X';

  var steps  = [];
  var result = '';

  for (var i = 0; i < padded.length; i += n) {
    var block = padded.slice(i, i + n);
    var out   = '';

    for (var j = 0; j < n; j++) {
      out += block[key[j] - 1];
    }

    steps.push(
      'Bloque ' + (i / n + 1) + ': <span class="hl">' + escHtml(block) + '</span>' +
      ' → permutación → <span class="hl">' + escHtml(out) + '</span>'
    );
    result += out;
  }

  return { result: result, steps: steps };
}

/**
 * permutationDecrypt
 * @param {string}   msg  Texto cifrado (debe ser múltiplo de n)
 * @param {number[]} key  Permutación 1-indexed (parsePermKey)
 * @returns {{ result: string, steps: string[] }}
 */
function permutationDecrypt(msg, key) {
  var n = key.length;

  if (msg.length % n !== 0) {
    throw new Error(
      'La longitud del mensaje cifrado (' + msg.length +
      ') debe ser múltiplo de ' + n + '.'
    );
  }

  // Calcular permutación inversa:
  // key[j] = k  →  ciph[j] venía de plain[k-1]
  // invKey[k-1] = j+1  →  plain[k-1] = ciph[invKey[k-1]-1]
  var invKey = new Array(n);
  for (var j = 0; j < n; j++) {
    invKey[key[j] - 1] = j + 1;
  }

  var steps  = [];
  var result = '';

  for (var i = 0; i < msg.length; i += n) {
    var block = msg.slice(i, i + n);
    var out   = '';

    for (var j = 0; j < n; j++) {
      out += block[invKey[j] - 1];
    }

    steps.push(
      'Bloque ' + (i / n + 1) + ': <span class="hl">' + escHtml(block) + '</span>' +
      ' → inv.permutación → <span class="hl">' + escHtml(out) + '</span>'
    );
    result += out;
  }

  return { result: result, steps: steps };
}
