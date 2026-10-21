/**
 * permutation.js
 * Algoritmo de Cifrado por Permutación de Grupos.
 */
function parsePermKey(raw) {
  // convertimos el texto a una lista de numeros
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

  // verificamos que esten los numeros del 1 al n sin repetir
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

function permutationEncrypt(msg, key) {
  var n = key.length;

  // rellenamos con x hasta completar el ultimo bloque
  var padded = msg;
  while (padded.length % n !== 0) padded += 'X';

  var steps = [];
  var result = '';

  // procesamos el mensaje en bloques del tamano de la clave
  for (var i = 0; i < padded.length; i += n) {
    var block = padded.slice(i, i + n);
    var out = '';

    // acomodamos las letras segun las posiciones de la clave
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

function permutationDecrypt(msg, key) {
  var n = key.length;

  if (msg.length % n !== 0) {
    throw new Error(
      'La longitud del mensaje cifrado (' + msg.length +
      ') debe ser múltiplo de ' + n + '.'
    );
  }

  // calculamos la clave inversa para saber la posicion original de cada letra
  var invKey = new Array(n);
  for (var j = 0; j < n; j++) {
    invKey[key[j] - 1] = j + 1;
  }

  var steps = [];
  var result = '';

  // procesamos el mensaje cifrado por bloques
  for (var i = 0; i < msg.length; i += n) {
    var block = msg.slice(i, i + n);
    var out = '';

    // reordenamos el bloque con la clave inversa para recuperar el texto
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
