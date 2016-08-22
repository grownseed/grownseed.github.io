var game,
  options,
  heaps,
  round,
  current_player;

/*
 * Nim Game - https://en.wikipedia.org/wiki/Nim
 */
function nim() {
  var nb_remove,
    chosen_heap,
    x = heaps.reduce(function(a, b){ return a ^ b; });

  if (x === 0) {
    if (Math.max.apply(null, heaps)) {
      console.log('Losing');
    }

    for (var i = 0; i < heaps.length; i++) {
      if (heaps[i] > 0) {
        chosen_heap = i;
        nb_remove = heaps[i];
        break;
      }
    }
  } else {
    var sums = heaps.map(function(h) { return (h ^ x) < h });
    chosen_heap = sums.indexOf(true);
    nb_remove = heaps[chosen_heap] - (heaps[chosen_heap] ^ x);
    var heaps_twomore = 0;
    for (var i = 0; i < heaps.length; i++) {
      var n = chosen_heap === i ? heaps[i] - nb_remove : heaps[i];
      if (n > 1) {
        heaps_twomore += 1;
      }
    }

    if (heaps_twomore === 0) {
      chosen_heap = heaps.indexOf(Math.max.apply(null, heaps));
      var heaps_one = heaps.map(function(n) { return n === 1 }).reduce(function(a, b) { return a + b });
      nb_remove = heaps_one % 2 != options.misere_mode ? heaps[chosen_heap] - 1 : heaps[chosen_heap];
    }
  }

  return {heap: chosen_heap, nb: nb_remove};
}

function parseOptions() {
  var options = {},
    fields = ['players_nb', 'heaps_nb', 'size_min', 'size_max', 'misere_mode'];

  fields.forEach(function(f) {
    options[f] = parseInt(document.getElementById(f).value);
  });

  if (options.size_min > options.size_max) {
    options.size_max = options.size_min;
  }

  options.misere_mode = !!options.misere_mode;

  return options;
}

function clearGame() {
  game.innerHTML = '';
}

function showBoard() {
  document.getElementById('board').style.visibility = 'visible';
}

function adjustSizes() {
  var stacks = game.children,
    width = Math.floor(100 / stacks.length),
    max_height = 0;

  for (var i = 0; i < stacks.length; i++) {
    // set heap width & offset
    stacks[i].style.width = (width - 2) + '%';
    stacks[i].style.marginLeft = (width * i) + '%';

    // find max height
    var height = stacks[i].offsetHeight;

    if (height > max_height) {
      max_height = height;
    }
  }

  // adjust game height for alignment
  game.style.height = max_height + 'px';
}

function updateBoard(end) {
  document.getElementById('board_header').innerHTML = 'Player ' + (current_player + 1) +
    (end ? (options.misere_mode ? ' lost!' : ' won!') : ' - Round ' + (round + 1));
}

function nextRound() {
  var total = heaps.reduce(function(a, b) { return a + b });

  if (total > 0) {
    round++;

    current_player = round % options.players_nb;

    updateBoard();
  } else {
    updateBoard(true);
  }
}

function hinter() {
  document.getElementById('hint').addEventListener('click', function() {
    var hint = nim();

    for (var i = 1; i <= hint.nb; i++) {
      document.getElementById('cell_' + hint.heap + '_' + i).className += ' hint';
    }
  });
}

function drawCell(heap, target, iterations, current) {
  if (iterations === 0) {
    return;
  }

  current = current || 0;
  current++;

  var cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = 'cell_' + heap + '_' + current;

  cell.addEventListener('click', function(e) {
    e.stopPropagation();
    
    heaps[heap] -= current;
    drawHeaps();

    nextRound();
  });

  target.appendChild(cell);

  if (current < iterations) {
    return drawCell(heap, cell, iterations, current);
  }

  return;
}

function drawHeaps() {
  clearGame();

  for (var i = 0; i < heaps.length; i++) {
    drawCell(i, game, heaps[i]);
  }

  adjustSizes();
}

function generateHeaps() {
  heaps = [];

  for (var i = 0; i < options.heaps_nb; i++) {
    heaps.push(Math.floor(Math.random() * (options.size_max - options.size_min + 1)) + options.size_min);
  }
}

(function() {
  document.getElementById('options_form').addEventListener('submit', function(e) {
    e.preventDefault();

    game = document.getElementById('game');
    round = 0;
    current_player = 0;
    options = parseOptions();
    showBoard();
    updateBoard();
    generateHeaps();
    drawHeaps();
    hinter();
  });
})();