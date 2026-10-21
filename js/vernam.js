/**
 * vernam.js
 * Algoritmo de Cifrado de Vernam (One-Time Pad — XOR).
 */

function vernamEncrypt(msg, key) {
  if (!key) throw new Error('La clave no puede estar vacía.');

  // Convertimos tanto el mensaje como la clave a arrays de bytes UTF-8 reales
  var encoder = new TextEncoder();
  var msgBytes = encoder.encode(msg);
  var keyBytes = encoder.encode(key);

  var steps = [];
  var result = '';

  for (var i = 0; i < msgBytes.length; i++) {
    var mByte = msgBytes[i];
    var kByte = keyBytes[i % keyBytes.length];

    var xorVal = mByte ^ kByte;
    var hex = xorVal.toString(16).padStart(2, '0');
    result += hex;

    steps.push(
      'Byte ' + i + ': ' + mByte + ' ⊕ ' + kByte + ' = ' + xorVal + ' → 0x' + hex
    );
  }

  return { result: result, steps: steps };
}

function vernamDecrypt(hexMsg, key) {
  if (!key) throw new Error('La clave no puede estar vacía.');

  // Eliminamos cualquier espacio en blanco (espacios, tabulaciones, saltos de línea)
  var cleanHex = hexMsg.replace(/\s+/g, '');

  // Validamos que sea hexadecimal y tenga longitud par sobre la cadena limpia
  if (!/^[0-9a-fA-F]*$/.test(cleanHex) || cleanHex.length % 2 !== 0) {
    throw new Error(
      'El mensaje cifrado debe ser una cadena hexadecimal válida de longitud par.'
    );
  }

  var encoder = new TextEncoder();
  var keyBytes = encoder.encode(key);

  var numBytes = cleanHex.length / 2;
  var plainBytes = new Uint8Array(numBytes);
  var steps = [];

  // Procesamos byte por byte sobre cleanHex
  for (var i = 0; i < numBytes; i++) {
    var hexPair = cleanHex.slice(i * 2, i * 2 + 2);
    var byte_ = parseInt(hexPair, 16);
    var kByte = keyBytes[i % keyBytes.length];

    var plainByte = byte_ ^ kByte;
    plainBytes[i] = plainByte;

    steps.push(
      '0x<span class="hl">' + hexPair + '</span> (' + byte_ + ') ⊕ ' +
      '0x' + kByte.toString(16).padStart(2, '0') + ' (' + kByte + ') = ' +
      '<span class="hl">' + plainByte + '</span>'
    );
  }

  var decoder = new TextDecoder('utf-8');
  var result = decoder.decode(plainBytes);

  return { result: result, steps: steps };
}