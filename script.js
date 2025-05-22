// === Konfiguration ===
const WINDOW_SIZE = window.innerHeight;
const NODE_RADIUS = 7;
const EDGE_WIDTH = 2;
const CLAIMED_EDGE_WIDTH = 4;
const CLICK_THRESHOLD = 12;
const HOVER_WIDTH = 6;
const BOARD_SCALE = 1.9;
const ANIM_DURATION = 500; // ms
let botM=false;


// --- TikZ Knoten & Kanten ---
const tikz_nodes = {
  'a1': [0.3750, 0.1000], 'a2': [0.2652, 0.3652], 'a3': [0.0000, 0.4750], 'a4': [-0.2652, 0.3652],
  'a5': [-0.3750, 0.1000], 'a6': [-0.2652, -0.1652], 'a7': [0.0000, -0.2750], 'a8': [0.2652, -0.1652],
  'b1': [0.2727, 0.1000], 'b2': [0.1928, 0.2928], 'b3': [0.0000, 0.3727], 'b4': [-0.1928, 0.2928],
  'b5': [-0.2727, 0.1000], 'b6': [-0.1928, -0.0928], 'b7': [0.0000, -0.1727], 'b8': [0.1928, -0.0928],
  'c1': [0.1875, 0.1000], 'c2': [0.1326, 0.2326], 'c3': [0.0000, 0.2875], 'c4': [-0.1326, 0.2326],
  'c5': [-0.1875, 0.1000], 'c6': [-0.1326, -0.0326], 'c7': [0.0000, -0.0875], 'c8': [0.1326, -0.0326],
  'd1': [0.1193, 0.1000], 'd2': [0.0844, 0.1844], 'd3': [0.0000, 0.2193], 'd4': [-0.0844, 0.1844],
  'd5': [-0.1193, 0.1000], 'd6': [-0.0844, 0.0156], 'd7': [0.0000, -0.0193], 'd8': [0.0844, 0.0156],
  'e1': [0.0597, 0.1000], 'e2': [0.0422, 0.1422], 'e3': [0.0000, 0.1597], 'e4': [-0.0422, 0.1422],
  'e5': [-0.0597, 0.1000], 'e6': [-0.0422, 0.0578], 'e7': [0.0000, 0.0403], 'e8': [0.0422, 0.0578],
  'f': [0.0000, 0.1000]
};

const red_nodes = new Set(['b1', 'b5']);

const edge_pairs = [
  ['a1','a2'],['a1','a8'],['a1','b1'],['a2','a3'],['a2','b1'],['a3','a4'],['a3','b2'],['a3','b3'],
  ['a4','a5'],['a4','b4'],['a5','a6'],['a5','b4'],['a6','a7'],['a6','b5'],['a6','b6'],['a7','a8'],['a7','b6'],
  ['b1','b2'],['b1','b8'],['b1','c1'],['b1','c8'],['b2','b3'],['b2','c1'],['b2','c2'],['b3','b4'],['b3','c2'],
  ['b3','c3'],['b4','b5'],['b4','c4'],['b5','b6'],['b5','c4'],['b5','c5'],['b6','b7'],['b6','c5'],['b6','c6'],
  ['b7','b8'],['b7','c6'],['b7','c7'],['b8','c8'],['c1','c2'],['c1','c8'],['c1','d1'],['c2','c3'],['c2','d1'],
  ['c2','d2'],['c3','c4'],['c3','d2'],['c3','d3'],['c4','c5'],['c4','d3'],['c4','d4'],['c5','c6'],['c5','d5'],
  ['c6','c7'],['c6','d5'],['c6','d6'],['c7','c8'],['c7','d6'],['c7','d7'],['c8','d7'],['c8','d8'],['d1','d2'],
  ['d1','d8'],['d1','e1'],['d1','e8'],['d2','d3'],['d2','e2'],['d3','d4'],['d3','e2'],['d3','e3'],['d4','d5'],
  ['d4','e3'],['d4','e4'],['d5','d6'],['d5','e4'],['d5','e5'],['d6','d7'],['d6','e6'],['d7','d8'],['d7','e6'],
  ['d7','e7'],['d8','e7'],['d8','e8'],['e1','e2'],['e1','e8'],['e1','f'],['e2','e3'],['e2','f'],['e3','e4'],
  ['e4','e5'],['e4','f'],['e5','e6'],['e5','f'],['e6','e7'],['e6','f'],['e7','e8'],['e8','f']
];

const Teasy = [
    ['b1', 'b2'],
    ['b2', 'b3'],
    ['b3', 'b4'],
    ['b4', 'b5'],
    ['b5', 'b6'], 
    ['b6', 'b7'],
    ['b7', 'b8'], 
    ['b1', 'b8'],
    ['b1', 'c1'],
    ['b2', 'c2'],
    ['b7', 'c7'],
    ['b3', 'c3'],
    ['b5', 'c5'], 
    ['c1', 'c2'],
    ['c2', 'c3'],
    ['c3', 'c4'],
    ['c4', 'c5'],
    ['c5', 'c6'], 
    ['c6', 'c7'],
    ['c7', 'c8'], 
    ['c1', 'c8'],
];

const T_1 = [
    ['b1', 'c1'],
    ['b2', 'c2'],
    ['b3', 'c3'],
    ['b4', 'c4'],
    ['b5', 'c4'],
    ['b6', 'c5'],
    ['b6', 'c6'],
    ['b7', 'c7'],
    ['b8', 'c8'],
    ['c1', 'd1'],
    ['c2', 'd2'],
    ['c3', 'd3'],
    ['c4', 'd4'],
    ['c6', 'd5'],
    ['c6', 'd6'],
    ['c7', 'd7'],
    ['c8', 'd8'],
    ['d1', 'e1'],
    ['d2', 'e2'],
    ['d3', 'e3'],
    ['d4', 'e3'],
    ['d4', 'e4'],
    ['d6', 'e6'],
    ['d7', 'e7'],
    ['d8', 'e7'],
    ['d8', 'e8'],
    ['e1', 'f'],
    ['e2', 'f'],
    ['e4', 'f'],
    ['e5', 'e6'],    
    ['e6', 'f'],
    ['e8', 'f']
];
let availableT1 = T_1;
const T_2 = [
    ['b1', 'b2'],
    ['b1', 'b8'],
    ['b2', 'b3'],
    ['b3', 'b4'],
    ['b4', 'b5'],
    ['b5', 'c5'],
    ['b6', 'b7'],
    ['b7', 'b8'],
    ['c1', 'c2'],
    ['c1', 'c8'],
    ['c2', 'c3'],
    ['c3', 'c4'],
    ['c4', 'c5'],
    ['c5', 'c6'],
    ['c6', 'c7'],
    ['c7', 'c8'],
    ['d1', 'd2'],
    ['d1', 'd8'],
    ['d2', 'd3'],
    ['d3', 'd4'],
    ['d4', 'd5'],
    ['d5', 'e5'],
    ['d6', 'd7'],
    ['d7', 'd8'],
    ['e1', 'e2'],
    ['e1', 'e8'],
    ['e2', 'e3'],
    ['e3', 'e4'],
    ['e4', 'e5'],
    ['e5', 'f'],
    ['e6', 'e7'],
    ['e7', 'e8']
];
let availableT2 = T_2;



const node_positions = {};
for (const [name, [fx, fy]] of Object.entries(tikz_nodes)) {
  const x = WINDOW_SIZE / 2 + fx * (WINDOW_SIZE / 2) * BOARD_SCALE;
  const y = WINDOW_SIZE / 2 - fy * (WINDOW_SIZE / 2) * BOARD_SCALE;
  node_positions[name] = [x, y];
}

// --- Spielzustand ---
const edge_state = new Map(); // key: "u,v" sorted string, value: null or 'M' or 'B'
const move_history = [];
const edge_animations = new Map(); // key: "u,v", value: {startTime, fromColor, toColor}
let winning_path = [];
let current_turn = 'M';
let game_over = false;
let undo_available = false;
let hovered_edge = null;

// Hilfsfunktion für Key in Map: sortiere Knoten alphabetisch
function edgeKey(u,v) {
  return (u < v) ? `${u},${v}` : `${v},${u}`;
}

// Init alle Kanten mit null (frei)
for (const [u,v] of edge_pairs) {
  edge_state.set(edgeKey(u,v), null);
}

// Farbinterpolation (lerp)
function lerpColor(c1, c2, t) {
  return c1.map((v,i) => Math.round(v + (c2[i] - v)*t));
}

// Abstand Punkt zu Kantenabschnitt
function pointSegmentDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  if(dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1)*dx + (py - y1)*dy) / (dx*dx + dy*dy);
  t = Math.max(0, Math.min(1, t));
  const projx = x1 + t*dx;
  const projy = y1 + t*dy;
  return Math.hypot(px - projx, py - projy);
}

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = WINDOW_SIZE;
canvas.height = WINDOW_SIZE;

// UI Elemente
const restartBtn = document.getElementById('restartBtn');
const undoBtn = document.getElementById('undoBtn');
const statusDiv = document.getElementById('status');

restartBtn.addEventListener('click', () => {
  resetGame();
  updateStatus();
  draw();
});

undoBtn.addEventListener('click', () => {
  if (!undo_available || game_over) return;
  undoMove();
  updateStatus();
  draw();
});

// Game Loop mit Animationen
function gameLoop(timestamp) {
  draw(timestamp);
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// === Funktionen ===

function resetGame() {
  for (const key of edge_state.keys()) {
    edge_state.set(key, null);
  }
  move_history.length = 0;
  edge_animations.clear();
  winning_path = [];
  current_turn = 'M';
  game_over = false;
  undo_available = false;
  undoBtn.disabled =true;
  hovered_edge = null;
  if(botM== true && current_turn == 'M')botPlay(botDifficulty);
}

function undoMove() {
  if (move_history.length === 0) return;

  // Letzten Zug holen
  const [lastEdge, lastPlayer] = move_history.pop();

  // Kante zurücksetzen
  edge_state.set(edgeKey(...lastEdge), null);

  // Animation für diese Kante löschen
  edge_animations.delete(edgeKey(...lastEdge));

  // Spieler wieder zurücksetzen auf den Spieler, der den Zug gemacht hat
  current_turn = lastPlayer;

  // Spiel ist noch nicht vorbei, da Undo einen Zug entfernt
  game_over = false;
  winning_path = [];

  // Undo nur verfügbar, wenn noch weitere Züge in History sind
  undo_available = move_history.length > 0;
  undoBtn.disabled = !undo_available;
  

  updateStatus();
  draw();
  //if(botM== true && current_turn == 'M')botPlay();
}


function takeEdge(mx, my) {
  let bestEdge = null;
  let bestDist = CLICK_THRESHOLD;
  for (const [key, state] of edge_state.entries()) {
    if (state !== null) continue;
    const [u,v] = key.split(',');
    const [x1,y1] = node_positions[u];
    const [x2,y2] = node_positions[v];
    const dist = pointSegmentDist(mx, my, x1, y1, x2, y2);
    if (dist < bestDist) {
      bestDist = dist;
      bestEdge = [u,v];
    }
  }
  if (bestEdge && !game_over) {
    const key = edgeKey(...bestEdge);
    if (edge_state.get(key) === null) {
      edge_state.set(key, current_turn);
      move_history.push([bestEdge, current_turn]);
      undo_available = true;
      undoBtn.disabled =false;
      startEdgeAnimation(key, current_turn);
      checkWin();
      if (!game_over) {
        current_turn = current_turn === 'M' ? 'B' : 'M';
        if(botM== true && current_turn == 'M')botPlay(botDifficulty);
      }
    }
  }
}

function startEdgeAnimation(key, player) {
  edge_animations.set(key, {
    startTime: performance.now(),
    fromColor: [192, 192, 192], // grau
    toColor: player === 'M' ? [0,0,0] : [0, 128, 0]
  });
}

function getEdgeColor(key, timestamp) {
  const anim = edge_animations.get(key);
  if (!anim) {
    const state = edge_state.get(key);
    if (state === 'M') return 'black';
    if (state === 'B') return 'green';
    return 'lightgray';
  }
  const elapsed = timestamp - anim.startTime;
  if (elapsed >= ANIM_DURATION) {
    edge_animations.delete(key);
    return (edge_state.get(key) === 'M') ? 'black' : 'green';
  }
  // Interpolieren
  const t = elapsed / ANIM_DURATION;
  const col = lerpColor(anim.fromColor, anim.toColor, t);
  return `rgb(${col[0]},${col[1]},${col[2]})`;
}

function drawNode(x, y, isRed = false) {
  ctx.beginPath();
  ctx.fillStyle = isRed ? 'red' : 'white';
  ctx.strokeStyle = isRed ? 'red' : 'black';
  ctx.lineWidth = 2;
  ctx.shadowColor = isRed ? 'rgba(255,0,0,0.7)' : 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 6;
  ctx.ellipse(x, y, NODE_RADIUS, NODE_RADIUS, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawEdge(u, v, timestamp) {
  const key = edgeKey(u,v);
  const [x1,y1] = node_positions[u];
  const [x2,y2] = node_positions[v];

  let color = getEdgeColor(key, timestamp || 0);
  let width = EDGE_WIDTH;

  // Hover-Effekt
  if (hovered_edge === key) {
    width = CLAIMED_EDGE_WIDTH;
    if (edge_state.get(key) === null) {
      color = 'darkgrey';
    }
  } else if (winning_path.includes(key)) {
    color = 'red';
    width = CLAIMED_EDGE_WIDTH + 1;
  } else if (edge_state.get(key) !== null) {
    width = CLAIMED_EDGE_WIDTH;
  }

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.shadowColor = (color === 'red') ? 'rgba(255,0,0,0.7)' : 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 3;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function draw(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Kanten zuerst zeichnen
  for (const [u,v] of edge_pairs) {
    drawEdge(u, v, timestamp);
  }

  // Knoten zeichnen
  for (const [name, [x,y]] of Object.entries(node_positions)) {
    drawNode(x, y, red_nodes.has(name));
  }
}

// --- BFS für Siegprüfung: Pfad von b1 nach b5 nur über Kanten von M
function checkWin() {
  const start = 'b1';
  const goal = 'b5';

  // Nur Kanten von 'M' benutzen
  const adj = {};
  for (const [u,v] of edge_pairs) {
    if (edge_state.get(edgeKey(u,v)) === 'M') {
      if (!adj[u]) adj[u] = [];
      if (!adj[v]) adj[v] = [];
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  // BFS
  const queue = [start];
  const visited = new Set([start]);
  const parent = {};
  while(queue.length > 0) {
    const node = queue.shift();
    if(node === goal) {
      // Pfad gefunden, konstruiere Pfad
      winning_path = [];
      let cur = goal;
      while(cur !== start) {
        let p = parent[cur];
        winning_path.push(edgeKey(cur, p));
        cur = p;
      }
      game_over = true;
      updateStatus(`${current_turn} gewinnt!`);
      undo_available = false;
      undoBtn.disabled = true;
      showResultBanner("M",false);
      return;
    }
    for (const n of (adj[node] || [])) {
      if (!visited.has(n)) {
        visited.add(n);
        parent[n] = node;
        queue.push(n);
      }
    }
  }
  // Kein Pfad gefunden
  winning_path = [];
  if(canMStillWin()== false){
    game_over=true;
    updateStatus(`B gewinnt!`);
      undo_available = false;
      undoBtn.disabled = true;
      showResultBanner("B",false);
      return;
  }
  updateStatus(`Spieler ${current_turn} ist am Zug`);
}

// --- Maus Events ---

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  let foundHover = null;
  let bestDist = CLICK_THRESHOLD;
  for (const key of edge_state.keys()) {
    const [u,v] = key.split(',');
    const [x1,y1] = node_positions[u];
    const [x2,y2] = node_positions[v];
    const dist = pointSegmentDist(mx, my, x1, y1, x2, y2);
    if (dist < bestDist) {
      bestDist = dist;
      foundHover = key;
    }
  }
  hovered_edge = foundHover;
});

canvas.addEventListener('mouseleave', e => {
  hovered_edge = null;
});

canvas.addEventListener('click', e => {
  if (game_over) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  takeEdge(mx, my);
  updateStatus();
});

function updateStatus(text) {
  if (text) {
    statusDiv.textContent = text;
  } else if (!game_over) {
    statusDiv.textContent = `Spieler ${current_turn} ist am Zug`;
  } else {
    //statusDiv.textContent = `Spiel vorbei`;
  }
}


function canMStillWin() {
  const start = 'b1';
  const goal = 'b5';

  // Nur Kanten, die noch frei (null) oder von M beansprucht sind, sind erlaubt
  const adj = {};
  for (const [u, v] of edge_pairs) {
    const state = edge_state.get(edgeKey(u, v));
    if (state === null || state === 'M') {
      if (!adj[u]) adj[u] = [];
      if (!adj[v]) adj[v] = [];
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  // BFS mit nur erlaubten Kanten (null oder 'M')
  const queue = [start];
  const visited = new Set([start]);
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === goal) {
      return true; // Es existiert ein möglicher Pfad
    }
    for (const neighbor of (adj[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return false; // Kein möglicher Pfad mehr -> M kann nicht mehr gewinnen
}




/*function botPlay() {
  if (game_over || current_turn !== 'M') return;

  // Alle freien Kanten sammeln
  const freeEdges = [];
  for (const [key, state] of edge_state.entries()) {
    if (state === null) freeEdges.push(key);
  }
  
  if (freeEdges.length === 0) {
    game_over = true;
    updateStatus();
    draw();
    return;
  }
  
  // Zufällige Kante auswählen
  const randomKey = freeEdges[Math.floor(Math.random() * freeEdges.length)];
  const [u, v] = randomKey.split('-');

  // Zug ausführen

  edge_state.set(randomKey, 'M');
  move_history.push([[u,v], 'M']);
  undo_available = true;
  undoBtn.disabled =false;
  startEdgeAnimation(randomKey, current_turn);
  checkWin();
  if (!game_over) {
    current_turn = current_turn === 'M' ? 'B' : 'M';
    botPlay();
  }
  updateStatus();
  draw();
}*/
function botPlay(botDifficulty) {
  setTimeout(function() {
  if (botDifficulty=="leicht"){
    botplayleicht();
  }else if(botDifficulty=="mittel"){
    botplaymittel();
  }else if(botDifficulty=="schwer"){
    botplayschwer();
    return;
  }else if(botDifficulty=="godlike"){
    botplaygodlike();
    return;
  }
}, 0);
  
}
/*function botplayleicht() {
       if (game_over || current_turn !== 'M') return;

  // Alle freien Kanten sammeln
  const freeEdges = [];
  for (const [key, state] of edge_state.entries()) {
    if (state === null) freeEdges.push(key);
  }
  
  if (freeEdges.length === 0) {
    game_over = true;
    updateStatus();
    draw();
    return;
  }
  
  // Zufällige Kante auswählen
  const randomKey = freeEdges[Math.floor(Math.random() * freeEdges.length)];
  const [u, v] = randomKey.split(',');

  // Zug ausführen

  edge_state.set(randomKey, 'M');
  move_history.push([[u,v], 'M']);
  undo_available = true;
  undoBtn.disabled =false;
  startEdgeAnimation(randomKey, current_turn);
  checkWin();
  if (!game_over) {
    current_turn = current_turn === 'M' ? 'B' : 'M';
    botPlay(botDifficulty);
  }
  updateStatus();
  draw();
}*/




function botplayleicht() {
  if (game_over || current_turn !== 'M') return;

  // Liste der bevorzugten Kanten (als Strings wie "b1,b2")
  const Teasy_keys = Teasy.map(pair => pair.join(','));

  // Finde alle freien Kanten aus T_1
  const freieTeasyKanten = Teasy_keys.filter(key => edge_state.get(key) === null);

  if (freieTeasyKanten.length > 0) {
    // Spiele zufällige freie Kante aus T_1
    const key = freieTeasyKanten[Math.floor(Math.random() * freieTeasyKanten.length)];
    const [u, v] = key.split(',');
    edge_state.set(key, 'M');
    move_history.push([[u, v], 'M']);
    undo_available = true;
    undoBtn.disabled = false;
    startEdgeAnimation(key, current_turn);
    checkWin();
    if (!game_over) {
      current_turn = 'B';
    }
    updateStatus();
    draw();
    return;
  }

  // Fallback: Zufällige freie Kante aus dem gesamten Spielfeld
  const freeEdges = [];
  for (const [key, state] of edge_state.entries()) {
    if (state === null) freeEdges.push(key);
  }

  if (freeEdges.length > 0) {
    const randomKey = freeEdges[Math.floor(Math.random() * freeEdges.length)];
    const [u, v] = randomKey.split(',');
    edge_state.set(randomKey, 'M');
    move_history.push([[u, v], 'M']);
    undo_available = true;
    undoBtn.disabled = false;
    startEdgeAnimation(randomKey, current_turn);
    checkWin();
    if (!game_over) {
      current_turn = 'B';
    }
    updateStatus();
    draw();
  }
}



function botplaymittel() {
  if (game_over || current_turn !== 'M') return;

  // Zähle bisherige M-Züge
  const mMoves = move_history.filter(move => move[1] === 'M').length;

  // Sonderfall: 2. M-Zug → Bevorzuge Kante mit b5
  if (mMoves === 1) {
    const b5Edges = [];
    for (const [key, state] of edge_state.entries()) {
      if (state === null && key.includes('b5')) {
        b5Edges.push(key);
      }
    }

    if (b5Edges.length > 0) {
      const key = b5Edges[Math.floor(Math.random() * b5Edges.length)];
      const [u, v] = key.split(',');
      edge_state.set(key, 'M');
      move_history.push([[u, v], 'M']);
      undo_available = true;
      undoBtn.disabled = false;
      startEdgeAnimation(key, current_turn);
      checkWin();
      if (!game_over) {
        current_turn = 'B';
      }
      updateStatus();
      draw();
      return;
    }
  }

  // Sonst: Nutze intelligente Strategie
  const path = findBestPathForM();

  if (path && path.length > 0) {
    for (const key of path) {
      if (edge_state.get(key) === null) {
        const [u, v] = key.split(',');
        edge_state.set(key, 'M');
        move_history.push([[u, v], 'M']);
        undo_available = true;
        undoBtn.disabled = false;
        startEdgeAnimation(key, current_turn);
        checkWin();
        if (!game_over) {
          current_turn = 'B';
        }
        updateStatus();
        draw();
        return;
      }
    }
  }

  // Fallback: Zufälliger freier Zug
  const freeEdges = [];
  for (const [key, state] of edge_state.entries()) {
    if (state === null) freeEdges.push(key);
  }

  if (freeEdges.length > 0) {
    const randomKey = freeEdges[Math.floor(Math.random() * freeEdges.length)];
    const [u, v] = randomKey.split(',');
    edge_state.set(randomKey, 'M');
    move_history.push([[u, v], 'M']);
    undo_available = true;
    undoBtn.disabled = false;
    startEdgeAnimation(randomKey, current_turn);
    checkWin();
    if (!game_over) {
      current_turn = 'B';
    }
    updateStatus();
    draw();
  }
}



function findBestPathForM() {
  const start = 'b1';
  const goal = 'b5';

  // Dijkstra-ähnlich: null = Kosten 1, 'M' = Kosten 0, 'B' = gesperrt
  const dist = {};
  const prev = {};
  const visited = new Set();

  for (const node in tikz_nodes) {
    dist[node] = Infinity;
  }
  dist[start] = 0;

  const pq = [[0, start]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]); // min-heap per Hand
    const [curDist, u] = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);

    if (u === goal) break;

    for (const [n1, n2] of edge_pairs) {
      if (n1 !== u && n2 !== u) continue;
      const v = (n1 === u) ? n2 : n1;
      const key = edgeKey(u, v);
      if (visited.has(v)) continue;

      const state = edge_state.get(key);
      if (state === 'B') continue;

      const cost = (state === 'M') ? 0 : 1;
      const alt = curDist + cost;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        pq.push([alt, v]);
      }
    }
  }

  if (!prev[goal]) return null;

  // Pfad zurückverfolgen
  const path = [];
  let cur = goal;
  while (cur !== start) {
    const p = prev[cur];
    path.push(edgeKey(cur, p));
    cur = p;
  }
  path.reverse();
  return path;
}

/*function botplayschwer() {
  if (game_over || current_turn !== 'M') return;

  const freeEdges = [];
  for (const [key, state] of edge_state.entries()) {
    if (state === null) freeEdges.push(key);
  }

  if (freeEdges.length === 0) {
    game_over = true;
    updateStatus();
    draw();
    return;
  }

  // Hilfsfunktion zum Vergleichen zweier Kanten (ungeordnet)
  function sameEdge(edge1, edge2) {
    return (edge1[0] === edge2[0] && edge1[1] === edge2[1]) ||
           (edge1[0] === edge2[1] && edge1[1] === edge2[0]);
  }

  let chosenEdge = null;

  if (move_history.length === 0) {
    // ERSTER ZUG: Wähle zufällige Kante aus T_1
    if (availableT1.length > 0) {
      chosenEdge = availableT1[Math.floor(Math.random() * availableT1.length)];
    }
  } else {
    // Letzter Zug des Gegners 'B'
    const lastMove = move_history[move_history.length - 1];
    const [u, v] = lastMove[0];
    const lastEdge = [u, v];

    // Prüfen, ob B eine Kante aus T_1 oder T_2 gespielt hat
    const inT1 = T_1.some(e => sameEdge(e, lastEdge));
    const inT2 = T_2.some(e => sameEdge(e, lastEdge));

    if (!inT1 && !inT2) {
      // Gegenzug aus T_1 oder T_2 wählen
      const combined = T_1.concat(T_2).filter(e =>
        freeEdges.includes(`${e[0]}-${e[1]}`) || freeEdges.includes(`${e[1]}-${e[0]}`)
      );
      if (combined.length > 0) {
        chosenEdge = combined[Math.floor(Math.random() * combined.length)];
      }
    } else {
      // Hier kommt deine weitere Logik rein (wenn in T_1 oder T_2)
      // Du kannst mir gleich sagen, was dann passieren soll
      if(inT1){chosenEdge = enemyinT1();}
      else{chosenEdge = enemyinT1();}
    }
  }

  // Falls aus irgendeinem Grund keine passende Kante gefunden wurde → fallback
  if (!chosenEdge) {
    const [fallback] = freeEdges[Math.floor(Math.random() * freeEdges.length)].split('-');
    chosenEdge = fallback.split(',');
  }

  // Zug ausführen
  const [u, v] = chosenEdge;
  const key = edge_state.has(`${u},${v}`) ? `${u},${v}` : `${v},${u}`;
  edge_state.set(key, 'M');
  move_history.push([[u, v], 'M']);
  undo_available = true;
  undoBtn.disabled = false;
  startEdgeAnimation(key, current_turn);
  checkWin();
  if (!game_over) {
    current_turn = 'B';
  }
  updateStatus();
  draw();
}




function enemyinT1(){
  // 1. Alle Knoten aus T_1 sammeln (einfach als Set)
  const nodes = new Set();
  for (const [u,v] of T_1) {
    nodes.add(u);
    nodes.add(v);
  }

  // 2. Adjazenzliste für T_1 bauen (nur Kanten, die noch frei sind)
  // Damit prüfen wir, ob der Teilgraph aus T_1 zusammenhängend ist.
  const adjacency = {};
  for (const node of nodes) {
    adjacency[node] = [];
  }
  for (const [u,v] of T_1) {
    const key1 = `${u}-${v}`;
    const key2 = `${v}-${u}`;
    // Kante nur berücksichtigen, wenn sie nicht belegt ist (frei oder von M selbst?)
    if (edge_state.get(key1) === null || edge_state.get(key2) === null) {
      adjacency[u].push(v);
      adjacency[v].push(u);
    }
  }

  // 3. BFS/DFS um zusammenhängend zu prüfen
  function isConnected(graph, startNode, allNodes) {
    const visited = new Set();
    const stack = [startNode];
    while (stack.length > 0) {
      const node = stack.pop();
      if (!visited.has(node)) {
        visited.add(node);
        for (const neigh of graph[node]) {
          if (!visited.has(neigh)) stack.push(neigh);
        }
      }
    }
    return allNodes.every(n => visited.has(n));
  }

  const nodeArray = Array.from(nodes);
  const connected = nodeArray.length === 0 ? false : isConnected(adjacency, nodeArray[0], nodeArray);

  if (connected) {
    // Graph ist zusammenhängend → wähle freie Kante aus T_1
    const availableT1 = T_1.filter(([u,v]) => {
      const k1 = `${u}-${v}`;
      const k2 = `${v}-${u}`;
      return edge_state.get(k1) === null || edge_state.get(k2) === null;
    });
    if (availableT1.length > 0) {
      const [u,v] = availableT1[Math.floor(Math.random() * availableT1.length)];
      return [u,v];
    }
  }
  
}
function botplayschwer() {
  if (game_over || current_turn !== 'M') return;

  // Hilfsfunktionen
  function edgeKey(u, v) {
    return edge_state.has(`${u},${v}`) ? `${u},${v}` : `${v},${u}`;
  }

  function isEdgeFree(u, v) {
    const key = edgeKey(u, v);
    return edge_state.has(key) && edge_state.get(key) === null;
  }

  function edgeInList(list, [u, v]) {
    return list.some(([a, b]) => (a === u && b === v) || (a === v && b === u));
  }

  function playEdge(u, v) {
    const key = edgeKey(u, v);
    edge_state.set(key, 'M');
    move_history.push([[u, v], 'M']);
    undo_available = true;
    undoBtn.disabled = false;
    startEdgeAnimation(key, current_turn);
    checkWin();
    if (!game_over) {
      current_turn = 'B';
      botPlay(botDifficulty);
    }
    updateStatus();
    draw();
  }

  // Freie Kanten sammeln
  const freeEdges = [];
  for (const [key, state] of edge_state.entries()) {
    if (state === null) freeEdges.push(key);
  }

  if (freeEdges.length === 0) {
    game_over = true;
    updateStatus();
    draw();
    return;
  }

  // Erster Zug → zufällig aus T_1
  if (move_history.length === 0) {
    if (availableT1.length > 0) {
      const [u, v] = availableT1[Math.floor(Math.random() * availableT1.length)];
      playEdge(u, v);
      return;
    }
  }

  // Letzter Zug von Gegner analysieren
  const lastMove = move_history[move_history.length - 1];
  const [lastU, lastV] = lastMove[0];
  const lastEdge = [lastU, lastV];
  const inT1 = edgeInList(T_1, lastEdge);
  const inT2 = edgeInList(T_2, lastEdge);

  // T_1-Knoten & Adjazenzliste
  const nodes = new Set();
  for (const [u, v] of T_1) {
    nodes.add(u);
    nodes.add(v);
  }
  const nodeArray = Array.from(nodes);
  const adjacency = {};
  for (const node of nodeArray) adjacency[node] = [];

  for (const [u, v] of T_1) {
    if (isEdgeFree(u, v)) {
      adjacency[u].push(v);
      adjacency[v].push(u);
    }
  }

  function isConnected(graph, start, allNodes) {
    const visited = new Set();
    const stack = [start];
    while (stack.length > 0) {
      const node = stack.pop();
      if (!visited.has(node)) {
        visited.add(node);
        for (const neighbor of graph[node]) {
          if (!visited.has(neighbor)) stack.push(neighbor);
        }
      }
    }
    return allNodes.every(n => visited.has(n));
  }

  if (inT1) {
    const connected = nodeArray.length === 0 ? false : isConnected(adjacency, nodeArray[0], nodeArray);

    if (connected) {
      // T_1 ist zusammenhängend → zufällige freie Kante aus T_1
      availableT1 = T_1.filter(([u, v]) => isEdgeFree(u, v));
      if (availableT1.length > 0) {
        const [u, v] = availableT1[Math.floor(Math.random() * availableT1.length)];
        playEdge(u, v);
        return;
      }
    } else {
      // Nicht verbunden: Finde zwei nicht erreichbare Knoten
      let disconnectedPair = null;
      outer: for (let i = 0; i < nodeArray.length; i++) {
        for (let j = i + 1; j < nodeArray.length; j++) {
          const start = nodeArray[i], target = nodeArray[j];
          const visited = new Set();
          const stack = [start];
          while (stack.length > 0) {
            const node = stack.pop();
            if (!visited.has(node)) {
              visited.add(node);
              for (const neighbor of adjacency[node]) {
                if (!visited.has(neighbor)) stack.push(neighbor);
              }
            }
          }
          if (!visited.has(target)) {
            disconnectedPair = [start, target];
            break outer;
          }
        }
      }

      if (disconnectedPair) {
        const [start, goal] = disconnectedPair;
        const visitedPaths = new Set();
        let foundT2Edge = null;

        function dfs(node, t2Used, path) {
          if (node === goal && t2Used === 1) {
            for (let i = 0; i < path.length - 1; i++) {
              const u = path[i], v = path[i + 1];
              if (edgeInList(T_2, [u, v]) && isEdgeFree(u, v)) {
                foundT2Edge = [u, v];
                return true;
              }
            }
            return false;
          }

          visitedPaths.add(`${node},${t2Used}`);

          const neighbors = [];

          for (const [u, v] of T_1) {
            if ((u === node || v === node)) {
              const neighbor = u === node ? v : u;
              if (isEdgeFree(u, v)) neighbors.push({ neighbor, usedT2: t2Used });
            }
          }

          if (t2Used === 0) {
            for (const [u, v] of T_2) {
              if ((u === node || v === node)) {
                const neighbor = u === node ? v : u;
                if (isEdgeFree(u, v)) neighbors.push({ neighbor, usedT2: 1 });
              }
            }
          }

          for (const { neighbor, usedT2 } of neighbors) {
            const key = `${neighbor},${usedT2}`;
            if (!visitedPaths.has(key)) {
              if (dfs(neighbor, usedT2, [...path, neighbor])) return true;
            }
          }

          return false;
        }

        if (dfs(start, 0, [start]) && foundT2Edge) {
          const [u, v] = foundT2Edge;
          playEdge(u, v);
          return;
        }
      }
    }
  }

  // Gegner spielte nicht in T_1 oder T_2 → zufällig aus beiden
  if (!inT1 && !inT2) {
    const combined = T_1.concat(T_2).filter(([u, v]) => isEdgeFree(u, v));
    if (combined.length > 0) {
      const [u, v] = combined[Math.floor(Math.random() * combined.length)];
      playEdge(u, v);
      return;
    }
  }

  // Fallback: Irgendeine freie Kante
  const [fallbackU, fallbackV] = freeEdges[Math.floor(Math.random() * freeEdges.length)].split(',');
  playEdge(fallbackU, fallbackV);
}*/

function botplayschwer(){
 if (game_over || current_turn !== 'M') return;

  // Zähle bisherige M-Züge
  const mMoves = move_history.filter(move => move[1] === 'M').length;

  // Sonderfall: 2. M-Zug → Bevorzuge Kante mit b5
  if (mMoves <= 10) {
    botplaygodlike();
  }else{
    botplaymittel();
  }
}

function botplaygodlike() {
let T1conn = areAllT1NodesConnectedExtended(T_1,T_2,edge_state);
let T2conn = areAllT2NodesConnectedExtended(T_1,T_2,edge_state);

if(T1conn.connected == true && T2conn.connected == true){botplayleicht();return;}
if(T1conn.connected == false && T2conn.connected == true){
  let [u,v]= T1conn.usedEdge;
  playEdge(u,v);
  return;
}
if(T1conn.connected == true && T2conn.connected == false){
  let [u,v]= T2conn.usedEdge;
  playEdge(u,v);
  return;
}
else if(T1conn.connected == false && T2conn.connected == false){
  botplayleicht();return;
}

function playEdge(u, v) {
  const key = edgeKey(u, v);
  edge_state.set(key, 'M');
  move_history.push([[u, v], 'M']);
  undo_available = true;
  undoBtn.disabled = false;
  startEdgeAnimation(key, current_turn);
  checkWin();
  if (!game_over) {
    current_turn = 'B';
    botPlay(botDifficulty);
  }
  updateStatus();
  draw();
}
  function edgeKey(u, v) {
  return edge_state.has(`${u},${v}`) ? `${u},${v}` : `${v},${u}`;
}

function areAllT1NodesConnectedExtended(T_1, T_2, edge_state) {
    // Hilfsfunktion: Prüft Verbindung mit einem optionalen zusätzlichen Null-Status-T2-Edge
    function checkConnectivity(extraEdge = null) {
        const T1_nodes = new Set();
        for (const [u, v] of T_1) {
            T1_nodes.add(u);
            T1_nodes.add(v);
        }

        const graph = new Map();

        function addEdge(u, v) {
            if (!graph.has(u)) graph.set(u, []);
            if (!graph.has(v)) graph.set(v, []);
            graph.get(u).push(v);
            graph.get(v).push(u);
        }

        // Kanten aus T_1 mit Status null oder 'M'
        for (const [u, v] of T_1) {
            const key = `${u},${v}`;
            const state = edge_state.get(key);
            if (state === null || state === 'M') {
                addEdge(u, v);
            }
        }

        // Kanten aus T_2 mit Status 'M'
        for (const [u, v] of T_2) {
            const key = `${u},${v}`;
            const state = edge_state.get(key);
            if (state === 'M') {
                addEdge(u, v);
            }
        }

        // Optional eine zusätzliche Null-Kante aus T_2 hinzufügen
        if (extraEdge) {
            const [u, v] = extraEdge;
            addEdge(u, v);
        }

        // Prüfen ob alle T1-Knoten verbunden sind (DFS)
        const visited = new Set();
        const start = [...T1_nodes][0];
        const stack = [start];

        while (stack.length > 0) {
            const node = stack.pop();
            if (!visited.has(node)) {
                visited.add(node);
                const neighbors = graph.get(node) || [];
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
        }

        for (const node of T1_nodes) {
            if (!visited.has(node)) {
                return false;
            }
        }
        return true;
    }

    // 1. Prüfen ohne Zusatzkante
    if (checkConnectivity()) {
        return { connected: true, usedEdge: null };
    }

    // 2. Prüfen mit jeweils einer Null-Kante aus T_2
    for (const [u, v] of T_2) {
        const key = `${u},${v}`;
        if (edge_state.get(key) === null) {
            if (checkConnectivity([u, v])) {
                return { connected: false, usedEdge: [u, v] };
            }
        }
    }

    // 3. Wenn nichts klappt
    return { connected: false, usedEdge: null };
}
function areAllT2NodesConnectedExtended(T_1, T_2, edge_state) {
    function checkConnectivity(extraEdge = null) {
        const T2_nodes = new Set();
        for (const [u, v] of T_2) {
            T2_nodes.add(u);
            T2_nodes.add(v);
        }

        const graph = new Map();

        function addEdge(u, v) {
            if (!graph.has(u)) graph.set(u, []);
            if (!graph.has(v)) graph.set(v, []);
            graph.get(u).push(v);
            graph.get(v).push(u);
        }

        // Kanten aus T_2 mit Status null oder 'M'
        for (const [u, v] of T_2) {
            const key = `${u},${v}`;
            const state = edge_state.get(key);
            if (state === null || state === 'M') {
                addEdge(u, v);
            }
        }

        // Kanten aus T_1 mit Status 'M'
        for (const [u, v] of T_1) {
            const key = `${u},${v}`;
            const state = edge_state.get(key);
            if (state === 'M') {
                addEdge(u, v);
            }
        }

        // Optional eine zusätzliche Null-Kante aus T_1 hinzufügen
        if (extraEdge) {
            const [u, v] = extraEdge;
            addEdge(u, v);
        }

        // Prüfen ob alle T2-Knoten verbunden sind (DFS)
        const visited = new Set();
        const start = [...T2_nodes][0];
        const stack = [start];

        while (stack.length > 0) {
            const node = stack.pop();
            if (!visited.has(node)) {
                visited.add(node);
                const neighbors = graph.get(node) || [];
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
        }

        for (const node of T2_nodes) {
            if (!visited.has(node)) {
                return false;
            }
        }
        return true;
    }

    // 1. Prüfen ohne Zusatzkante
    if (checkConnectivity()) {
        return { connected: true, usedEdge: null };
    }

    // 2. Prüfen mit jeweils einer Null-Kante aus T_1
    for (const [u, v] of T_1) {
        const key = `${u},${v}`;
        if (edge_state.get(key) === null) {
            if (checkConnectivity([u, v])) {
                return { connected: false, usedEdge: [u, v] };
            }
        }
    }

    // 3. Wenn nichts klappt
    return { connected: false, usedEdge: null };
}


}





























let botDifficulty = 'off';

const botSelect = document.getElementById('botLevel');
botSelect.addEventListener('change', () => {
  botDifficulty = botSelect.value;
  botM=true;
  resetGame();
});




//Konfetti
function showResultBanner(playerName,didPlayerWin) {
  // Overlay erstellen
  const overlay = document.createElement('div');
  overlay.id = 'result-overlay';
  document.body.appendChild(overlay);

  // Banner erstellen
  const banner = document.createElement('div');
  banner.id = 'result-banner';

  if(botDifficulty=="off"){
    if(playerName=="M"){
      banner.innerHTML = `🎉 Glückwunsch, <strong>Maker</strong>! Du hast gewonnen! 🎉`;
    }else{
      banner.innerHTML = `🎉 Glückwunsch, <strong>Breaker</strong>! Du hast gewonnen! 🎉`;  
    }
  }else{
    if(playerName=="M"){
      banner.innerHTML = `😢 Der Computer hat gewonnen. Viel Glück beim nächsten Mal.`;
    }else{
      banner.innerHTML = `🎉 Glückwunsch, <strong>Breaker</strong>! Du hast gewonnen! 🎉`;  
    }
  }
  overlay.appendChild(banner);

  // Konfetti nur anzeigen, wenn Spieler gewonnen hat
  if (didPlayerWin) {
    const confettiLeft = document.createElement('div');
    confettiLeft.className = 'confetti-container left';
    overlay.appendChild(confettiLeft);

    const confettiRight = document.createElement('div');
    confettiRight.className = 'confetti-container right';
    overlay.appendChild(confettiRight);

    for(let i=0; i<30; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confettiLeft.appendChild(confetti.cloneNode());
      confettiRight.appendChild(confetti);
    }

    setTimeout(colorizeConfetti, 100);
  }

  // Nach 5 Sekunden das Overlay entfernen
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }, 4000);
}

// CSS (unverändert) & Hilfsfunktionen (randomHue, colorizeConfetti) bleiben gleich...

// CSS hinzufügen, wenn noch nicht vorhanden
if (!document.getElementById('result-style')) {
  const style = document.createElement('style');
  style.id = 'result-style';
  style.textContent = `
    #result-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    #result-banner {
      background: white;
      padding: 2rem 4rem;
      font-size: 2rem;
      font-weight: bold;
      border-radius: 1rem;
      box-shadow: 0 0 20px gold;
      z-index: 10000;
      position: relative;
      max-width: 90vw;
      text-align: center;
    }

    .confetti-container {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 20vw;
      pointer-events: none;
      overflow: visible;
      z-index: 9999;
    }

    .confetti-container.left {
      left: 0;
    }

    .confetti-container.right {
      right: 0;
    }

    .confetti {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      opacity: 0.9;
      top: 0;
      animation-name: fall, spin;
      animation-timing-function: linear, ease-in-out;
      animation-iteration-count: infinite, infinite;
      animation-duration: 4s, 2s;
    }

    @keyframes fall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg);}
      100% { transform: rotate(360deg);}
    }
  `;
  document.head.appendChild(style);
}

function randomHue() {
  return Math.floor(Math.random() * 360);
}

function colorizeConfetti() {
  document.querySelectorAll('.confetti').forEach((confetti) => {
    confetti.style.backgroundColor = `hsl(${randomHue()}, 70%, 50%)`;
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 4}s, ${Math.random() * 2}s`;
  });
}







// Start
resetGame();
updateStatus();
draw();
