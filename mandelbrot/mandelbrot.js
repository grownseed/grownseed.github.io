var colors,
  hue = 0,
  width,
  height,
  canvas,
  context,
  image_data,
  resolution = 4,
  offset = resolution / 2,
  iterations = 100,
  res_width,
  res_height,

  one_third = 1/3,
  two_thirds = 2/3,
  one_sixth = 1/6;

// http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
function hue2rgb(t) {
  var p = .25, q = .75;
  if(t < 0) t += 1;
  if(t > 1) t -= 1;
  if(t < one_sixth) return p + 3 * t;
  if(t < .5) return q;
  if(t < two_thirds) return .25 + 3 * (two_thirds - t);
  return p;
}

function hsl2rgb(h){
  return [
    hue2rgb(h + one_third) * 255,
    hue2rgb(h) * 255,
    hue2rgb(h - one_third) * 255,
    255
  ];
}

function drawMandelbrot() {
  var x, y, i, xt,
    cx, cy,
    zx, zy, zsum;

  width = window.innerWidth;
  height = window.innerHeight;
  canvas = document.getElementById('surface');
  context = canvas.getContext('2d');
  image_data = context.getImageData(0, 0, width, height);
  res_width = resolution / width;
  res_height = resolution / height;

  colors = {};

  canvas.width = width;
  canvas.height = height;

  for (x = 0; x < width; x++) {
    cx = -offset + x * res_width;

    for (y = 0; y < height; y++) {
      i = 0;
      cy = -offset + y * res_height;
      zx = 0;
      zy = 0;

      do {
        xt = zx * zy;
        zx = zx * zx - zy * zy + cx;
        zy = offset * xt + cy;
        zsum = zx * zx + zy * zy;
        i++;
      }
      while(i < iterations && zsum < 4);

      var index = ((y * width + x) * 4);

      if (zsum > 4) {
        colors[index] = (i * 50 * zx / zy);
      }else{
        image_data.data[index] = 0;
        image_data.data[++index] = 0;
        image_data.data[++index] = 0;
        image_data.data[++index] = 255;
      }
    }
  }
}

function rotateHue() {
  hue += 2;

  for (var index in colors) {
    var rgb = hsl2rgb(((colors[index] + hue) % 360) / 360);

    image_data.data[index] = rgb[0];
    image_data.data[++index] = rgb[1];
    image_data.data[++index] = rgb[2];
    image_data.data[++index] = rgb[3];
  }

  context.putImageData(image_data, 0, 0);

  return setTimeout(rotateHue, 50);
}

document.addEventListener('DOMContentLoaded', function() {
  drawMandelbrot();
  rotateHue();
});
window.addEventListener('resize', drawMandelbrot);
