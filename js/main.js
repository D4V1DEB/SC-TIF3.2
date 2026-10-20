/**
 * main.js
 * Punto de entrada: despacha la operación al algoritmo correcto
 * y conecta el evento con la interfaz.
 */

/**
 * runCipher — lee los inputs, llama al algoritmo seleccionado
 * y muestra el resultado (o el error) en la UI.
 */
function runCipher() {
  var msg    = document.getElementById('input-msg').value;
  var keyRaw = document.getElementById('input-key').value.trim();

  if (!msg)    { showError('Por favor ingresa un mensaje.');  return; }
  if (!keyRaw) { showError('Por favor ingresa una clave.');   return; }

  try {
    var res;

    if (currentAlgo === 'permutation') {
      var key = parsePermKey(keyRaw);
      res = (currentMode === 'encrypt')
        ? permutationEncrypt(msg, key)
        : permutationDecrypt(msg, key);

    } else { /* vernam */
      res = (currentMode === 'encrypt')
        ? vernamEncrypt(msg, keyRaw)
        : vernamDecrypt(msg, keyRaw);
    }

    showOutput(res.result, res.steps);

  } catch (e) {
    showError(e.message);
  }
}

/* ── Inicialización ── */
document.addEventListener('DOMContentLoaded', function () {
  switchAlgo('permutation');
});
