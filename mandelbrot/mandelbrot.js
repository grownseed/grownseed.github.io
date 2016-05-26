function drawMandelbrot() {
  var x, y, i, xt,
    cx, cy,
    zx, zy,
    color,
    width = window.innerWidth,
    height = window.innerHeight,
    canvas = document.getElementById('surface'),
    context = canvas.getContext('2d'),
    resolution = 4,
    offset = resolution / 2,
    iterations = 100;

  canvas.width = width;
  canvas.height = height;

  for(x = 0; x < width; x++) {
    cx = -offset + resolution * (x / width);

    for(y = 0; y < height; y++) {
      i = 0;
      cy = -offset + resolution * (y / height);
      zx = 0;
      zy = 0;

      do {
        xt = zx * zy;
        zx = zx * zx - zy * zy + cx;
        zy = offset * xt + cy;
        i++;
      }
      while(i < iterations && (zx * zx + zy * zy) < 4);


      color = i.toString(16);
      context.beginPath();
      context.rect(x, y, 1, 1);
      if (zx * zx + zy * zy > 4) {
        context.fillStyle = 'hsl(' + i * 50 * zx / zy + ', 50%, 50%)';
      }else{
        context.fillStyle = '#000';
      }

      context.fill();
    }
  }
}

document.addEventListener('DOMContentLoaded', drawMandelbrot);
window.addEventListener('resize', drawMandelbrot);