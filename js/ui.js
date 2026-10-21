var currentAlgo = 'permutation';
var currentMode = 'encrypt';

var KEY_HINT = {
  permutation: 'ej: 3,1,4,2',
  vernam: 'cualquier texto'
};

var KEY_PLACEHOLDER = {
  permutation: 'ej: 3,1,4,2',
  vernam: 'Clave secreta...'
};

function switchAlgo(algo) {
  currentAlgo = algo;
  document.getElementById('tab-perm').classList.toggle('active', algo === 'permutation');
  document.getElementById('tab-vern').classList.toggle('active', algo === 'vernam');
  document.getElementById('key-hint').textContent = KEY_HINT[algo];
  document.getElementById('input-key').placeholder = KEY_PLACEHOLDER[algo];
  clearAll();
}

function setMode(mode) {
  currentMode = mode;
  document.getElementById('btn-encrypt').classList.toggle('active', mode === 'encrypt');
  document.getElementById('btn-decrypt').classList.toggle('active', mode === 'decrypt');
  clearOutput();
}

function clearAll() {
  document.getElementById('input-msg').value = '';
  document.getElementById('input-key').value = '';
  clearOutput();
}

function clearOutput() {
  var box = document.getElementById('output-box');
  box.textContent = 'El resultado aparecerá aquí...';
  box.classList.add('empty');
  document.getElementById('error-msg').classList.remove('visible');
  var details = document.getElementById('steps-section');
  if (details) {
    details.removeAttribute('open');
    details.classList.remove('visible');
  }
}

function showError(msg) {
  var el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.add('visible');
}

function showOutput(text, steps) {
  var box = document.getElementById('output-box');
  box.textContent = text;
  box.classList.remove('empty');
  document.getElementById('error-msg').classList.remove('visible');

  var details = document.getElementById('steps-section');
  if (details) {
    if (steps && steps.length) {
      var list = document.getElementById('steps-list');
      var count = document.getElementById('steps-count');
      if (count) {
        count.textContent = '(' + steps.length + (steps.length === 1 ? ' paso' : ' pasos') + ')';
      }
      list.innerHTML = steps.map(function (s) {
        return '<div class="step-item">' + s + '</div>';
      }).join('');
      details.removeAttribute('open');
      details.classList.add('visible');
    } else {
      details.classList.remove('visible');
    }
  }
}

function copyOutput() {
  var box = document.getElementById('output-box');
  if (box.classList.contains('empty')) return;

  navigator.clipboard.writeText(box.textContent).then(function () {
    var btn = document.querySelector('.copy-btn');
    var orig = btn.textContent;
    btn.textContent = '✓ Copiado';
    setTimeout(function () { btn.textContent = orig; }, 1500);
  });
}
