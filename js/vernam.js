/**
 * vernam.js
 * Algoritmo de Cifrado de Vernam (One-Time Pad — XOR).
 */

function vernamEncrypt(msg, key) {
  if (!key) throw new Error('La clave no puede estar vacía.');

  var steps = [];
  var result = '';

  // recorremos cada letra del mensaje
  for (var i = 0; i < msg.length; i++) {
    // obtenemos el valor numerico de la letra y de la clave repetida
    var mCode = msg.charCodeAt(i);
    var kCode = key.charCodeAt(i % key.length);
    // aplicamos xor entre ambos valores
    var xorVal = mCode ^ kCode;
    // convertimos el resultado a hexadecimal de dos digitos
    var hex = xorVal.toString(16).padStart(2, '0');
    result += hex;

    steps.push(
      "'" + escHtml(msg[i]) + "' (" + mCode + ') ⊕ ' +
      "'" + escHtml(key[i % key.length]) + "' (" + kCode + ') = ' +
      '<span class="hl">' + xorVal + '</span> → ' +
      '<span class="hl">0x' + hex + '</span>'
    );
  }

  return { result: result, steps: steps };
}

function vernamDecrypt(hexMsg, key) {
  if (!key) throw new Error('La clave no puede estar vacía.');

  // validamos que sea hexadecimal y tenga longitud par
  if (!/^[0-9a-fA-F]*$/.test(hexMsg) || hexMsg.length % 2 !== 0) {
    throw new Error(
      'El mensaje cifrado debe ser una cadena hexadecimal válida (longitud par).'
    );
  }

  var steps = [];
  var result = '';

  // procesamos el mensaje de dos en dos caracteres hexadecimales
  for (var i = 0; i < hexMsg.length; i += 2) {
    // convertimos el par hexadecimal a numero
    var byte_ = parseInt(hexMsg.slice(i, i + 2), 16);
    var kCode = key.charCodeAt((i / 2) % key.length);
    // aplicamos xor con la clave para recuperar el codigo original
    var plainCode = byte_ ^ kCode;
    // convertimos el codigo a caracter
    var plainChar = String.fromCharCode(plainCode);
    result += plainChar;

    steps.push(
      '0x<span class="hl">' + hexMsg.slice(i, i + 2) + '</span> (' + byte_ + ') ⊕ ' +
      "'" + escHtml(key[(i / 2) % key.length]) + "' (" + kCode + ') = ' +
      '<span class="hl">' + plainCode + '</span> → ' +
      "'" + escHtml(plainChar) + "'"
    );
  }

  return { result: result, steps: steps };
}
