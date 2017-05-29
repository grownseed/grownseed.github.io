function draw(options) {
  // remove existing canvas
  let current_canvas = document.querySelector('#canvas canvas');

  if (current_canvas) {
    current_canvas.remove();
  }

  // create new canvas
  let canvas = document.createElement('canvas');
  let target = document.getElementById('canvas');
  target.appendChild(canvas);

  let cx = canvas.getContext('2d');
  cx.strokeStyle = 'black';

  // set dimensions based on input
  cx.canvas.width = 8 * (options.width + options.padding) + options.padding + options.stroke;
  cx.canvas.height = options.text.length * options.height + options.padding;

  let chain = options.text.split('').map((c, i) => {
    let bin = c.charCodeAt(0).toString(2);

    bin = (Array(8 - bin.length + 1).join('0') + bin);

    // reverse every other char to avoid straight line
    if (i % 2) {
      bin = bin.split('').reverse().join('');
    }

    return bin;
  });

  cx.beginPath();
  cx.lineWidth = options.stroke;

  for (let i = 0; i < 8; i++) {
    let previous_x;

    for (var j = 0; j < chain.length; j++) {
      let x = i * (options.width + options.padding) + (chain[j][i] === '0' ? 0 : options.width) + options.padding + options.stroke / 2;
      let y = j * options.height + options.padding;

      if (j === 0) {
        cx.moveTo(x, options.padding);
      } else {
        if (options.style === 'straight') {
          cx.lineTo(x, y);
        }
        else if (options.style === 'bells') {
          cx.quadraticCurveTo(previous_x, y, x, y);
        }
        else if (options.style === 'circuit') {
          let mid_x;
          if (previous_x === x) {
            mid_x = x;
          } else {
            mid_x = (x > previous_x ? x - options.width / 2 : x + options.width / 2);
          }

          cx.quadraticCurveTo(previous_x, y - options.height / 2, mid_x, y - options.height / 2);
          cx.quadraticCurveTo(x, y - options.height / 2, x, y);
        }
      }

      previous_x = x;
    }
  }

  cx.stroke();
}

document.addEventListener('DOMContentLoaded', () => {
  const options = {
    text: '',
    width: 30,
    height: 30,
    padding: 10,
    stroke: 6,
    style: 'circuit'
  };

  let params;

  if (window.location.hash) {
    //console.log(window.location.hash);
    try {
      params = JSON.parse(decodeURIComponent(window.location.hash.substr(1)));
    } catch(e) {}
  }

  Object.keys(options).forEach(input => {
    let el = document.getElementById(input);

    if (params && params[input] !== undefined) {
      options[input] = params[input];
    }

    if (options[input]) {
      el.value = options[input];
    }

    let update = () => {
      if (options[input] !== undefined) {
        options[input] = el.type === 'number' ? parseInt(el.value || 0) : el.value;
      }

      history.replaceState(null, null, '#' + encodeURIComponent(JSON.stringify(options)));

      draw(options);
    };

    el.addEventListener('change', update);
    el.addEventListener('keyup', update);
  });

  draw(options);
});