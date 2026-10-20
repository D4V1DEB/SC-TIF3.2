/**
 * vernam.js
 * Algoritmo de Cifrado de Vernam (One-Time Pad — XOR).
 *
 * Cada carácter del mensaje se combina con el carácter correspondiente
 * de la clave mediante XOR. Si la clave es más corta, se rota (módulo).
 *
 * Cifrado  → produce una cadena hexadecimal (2 dígitos por byte).
 * Descifrado → recibe la cadena hex y devuelve el texto original.
 */

/**
 * vernamEncrypt
 * @param {string} msg  Texto plano
 * @param {string} key  Clave (cualquier texto)
 * @returns {{ result: string, steps: string[] }}
 */
function vernamEncrypt(msg, key) {
  if (!key) throw new Error('La clave no puede estar vacía.');

  var steps  = [];
  var result = '';

  for (var i = 0; i < msg.length; i++) {
    var mCode  = msg.charCodeAt(i);
    var kCode  = key.charCodeAt(i % key.length);
    var xorVal = mCode ^ kCode;
    var hex    = xorVal.toString(16).padStart(2, '0');
    result    += hex;

    steps.push(
      "'" + escHtml(msg[i]) + "' (" + mCode + ') ⊕ ' +
      "'" + escHtml(key[i % key.length]) + "' (" + kCode + ') = ' +
      '<span class="hl">' + xorVal + '</span> → ' +
      '<span class="hl">0x' + hex + '</span>'
    );
  }

  return { result: result, steps: steps };
}

/**
 * vernamDecrypt
 * @param {string} hexMsg  Cadena hexadecimal (salida de vernamEncrypt)
 * @param {string} key     Clave (debe ser la misma usada al cifrar)
 * @returns {{ result: string, steps: string[] }}
 */
function vernamDecrypt(hexMsg, key) {
  if (!key) throw new Error('La clave no puede estar vacía.');

  if (!/^[0-9a-fA-F]*$/.test(hexMsg) || hexMsg.length % 2 !== 0) {
    throw new Error(
      'El mensaje cifrado debe ser una cadena hexadecimal válida (longitud par).'
    );
  }

  var steps  = [];
  var result = '';

  for (var i = 0; i < hexMsg.length; i += 2) {
    var byte_     = parseInt(hexMsg.slice(i, i + 2), 16);
    var kCode     = key.charCodeAt((i / 2) % key.length);
    var plainCode = byte_ ^ kCode;
    var plainChar = String.fromCharCode(plainCode);
    result       += plainChar;

    steps.push(
      '0x<span class="hl">' + hexMsg.slice(i, i + 2) + '</span> (' + byte_ + ') ⊕ ' +
      "'" + escHtml(key[(i / 2) % key.length]) + "' (" + kCode + ') = ' +
      '<span class="hl">' + plainCode + '</span> → ' +
      "'" + escHtml(plainChar) + "'"
    );
  }

  return { result: result, steps: steps };
}
