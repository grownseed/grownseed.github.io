let source_input,
  canvas;

const charmap = {
  '00': '─',
  '01': '┬',
  '11': '┼',
  '10': '┴'
};

function parseSource() {
  let v = source_input.value;

  history.replaceState(null, null, '#' + v);

  let bin = [...v].map(c => {
    let d = c.charCodeAt(0).toString(2);
    return '0'.repeat(8 - d.length) + d;
  });

  render(bin);
}

function render(bin = []) {
  if (bin.length < 2) {
    canvas.innerText = '';
    return;
  }

  let out = [];

  for (const [i, b] of bin.entries()) {
    if (bin[i + 1]) {
      let str = '';
      for (const [j, c] of [...bin[i]].entries()) {
        str += charmap[c + bin[i + 1][j]];
      }
      out.push(str);
    }
  }

  canvas.innerText = out.join("\n");
}

function init() {
  source_input = document.getElementById('source');
  canvas = document.getElementById('canvas');

  source_input.addEventListener('keyup', parseSource);

  if (location.hash && location.hash !== '#') {
    source_input.value = location.hash.slice(1);
    parseSource();
  }
}

document.addEventListener('DOMContentLoaded', init);