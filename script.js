// === Konfiguration ===
const WINDOW_SIZE = window.innerHeight;
const NODE_RADIUS = 7;
const EDGE_WIDTH = 2;
const CLAIMED_EDGE_WIDTH = 4;
const CLICK_THRESHOLD = 12;
const HOVER_WIDTH = 6;
let BOARD_SCALE = 1.9;
const ANIM_DURATION = 500; // ms
const PULSE_DURATION = 200;
let botM=false;
let botismoving = false;
let blitzongoing = false;
let rednodemoving = false;
let rednodeadding = false;


function playClickSound() {
    const sound = new Audio('Sound/click-21156.mp3');
    sound.volume = 0.4;
    sound.play();
}

const victorysound = new Audio('Sound/goodresult-82807.mp3');
victorysound.volume = 0.6;

const loosesoundgodlike = new Audio('Sound/booohwav-14768.mp3');
loosesoundgodlike.volume = 0.6;

const victorysoundgodlike = new Audio('Sound/dj-airhorn-sound-39405.mp3');
victorysoundgodlike.volume = 0.6;

const loosesound = new Audio('Sound/failure-1-89170.mp3');
loosesound.volume = 0.6;

const thunderstormsound = new Audio('Sound/sound-of-thunderstorm-and-rain-hd-261867.mp3');
thunderstormsound.volume = 0.6;

const lasersound = new Audio('Sound/scifi-laser-gun-shot-2-341617.mp3');
lasersound.volume =0.6;

const lasersoundcharge = new Audio('Sound/magic-chargeup-102051.mp3');
lasersoundcharge.volume=0.6;

const addingsound = new Audio('Sound/science-fiction-effect-020-305484.mp3');
addingsound.volume =0.3;

const colormap = {
  'orange' : [255, 153, 51], 'blue' : [51,51,255]
}

// --- TikZ Knoten & Kanten ---
let tikz_nodes = {
  '0': [0.3750, 0.1000], '1': [0.2652, 0.3652], '2': [0.0000, 0.4750], '3': [-0.2652, 0.3652],
  '4': [-0.3750, 0.1000], '5': [-0.2652, -0.1652], '6': [0.0000, -0.2750], '7': [0.2652, -0.1652],
  '8': [0.2727, 0.1000], '9': [0.1928, 0.2928], '10': [0.0000, 0.3727], '11': [-0.1928, 0.2928],
  '12': [-0.2727, 0.1000], '13': [-0.1928, -0.0928], '14': [0.0000, -0.1727], '15': [0.1928, -0.0928],
  '16': [0.1875, 0.1000], '17': [0.1326, 0.2326], '18': [0.0000, 0.2875], '19': [-0.1326, 0.2326],
  '20': [-0.1875, 0.1000], '21': [-0.1326, -0.0326], '22': [0.0000, -0.0875], '23': [0.1326, -0.0326],
  '24': [0.1193, 0.1000], '25': [0.0844, 0.1844], '26': [0.0000, 0.2193], '27': [-0.0844, 0.1844],
  '28': [-0.1193, 0.1000], '29': [-0.0844, 0.0156], '30': [0.0000, -0.0193], '31': [0.0844, 0.0156],
  '32': [0.0597, 0.1000], '33': [0.0422, 0.1422], '34': [0.0000, 0.1597], '35': [-0.0422, 0.1422],
  '36': [-0.0597, 0.1000], '37': [-0.0422, 0.0578], '38': [0.0000, 0.0403], '39': [0.0422, 0.0578],
  '40': [0.0000, 0.1000]
};

let red_nodes = new Set(['8', '12']);
let initred_nodes = new Set(['8', '12']);

let edge_pairs = [
  ['0','1'],['0','7'],['0','8'],['1','2'],['1','8'],['2','3'],['2','9'],['2','10'],
  ['3','4'],['3','11'],['4','5'],['4','11'],['5','6'],['5','12'],['5','13'],['6','7'],['6','13'],
  ['8','9'],['8','15'],['8','16'],['8','23'],['9','10'],['9','16'],['9','17'],['10','11'],['10','17'],
  ['10','18'],['11','12'],['11','19'],['12','13'],['12','19'],['12','20'],['13','14'],['13','20'],['13','21'],
  ['14','15'],['14','21'],['14','22'],['15','23'],['16','17'],['16','23'],['16','24'],['17','18'],['17','24'],
  ['17','25'],['18','19'],['18','25'],['18','26'],['19','20'],['19','26'],['19','27'],['20','21'],['20','28'],
  ['21','22'],['21','28'],['21','29'],['22','23'],['22','29'],['22','30'],['23','30'],['23','31'],['24','25'],
  ['24','31'],['24','32'],['24','39'],['25','26'],['25','33'],['26','27'],['26','33'],['26','34'],['27','28'],
  ['27','34'],['27','35'],['28','29'],['28','35'],['28','36'],['29','30'],['29','37'],['30','31'],['30','37'],
  ['30','38'],['31','38'],['31','39'],['32','33'],['32','39'],['32','40'],['33','34'],['33','40'],['34','35'],
  ['35','36'],['35','40'],['36','37'],['36','40'],['37','38'],['37','40'],['38','39'],['39','40']
];

let Teasy = [
    ['8', '9'],
    ['9', '10'],
    ['10', '11'],
    ['11', '12'],
    ['12', '13'], 
    ['13', '14'],
    ['14', '15'], 
    ['8', '15'],
    ['8', '16'],
    ['9', '17'],
    ['14', '22'],
    ['10', '18'],
    ['12', '20'], 
    ['16', '17'],
    ['17', '18'],
    ['18', '19'],
    ['19', '20'],
    ['20', '21'], 
    ['21', '22'],
    ['22', '23'], 
    ['16', '23'],
];

/*let T_1 = [
    ['8', '16'],
    ['9', '17'],
    ['10', '18'],
    ['11', '19'],
    ['12', '19'],
    ['13', '20'],
    ['13', '21'],
    ['14', '22'],
    ['15', '23'],
    ['16', '24'],
    ['17', '25'],
    ['18', '26'],
    ['19', '27'],
    ['21', '28'],
    ['21', '29'],
    ['22', '30'],
    ['23', '31'],
    ['24', '32'],
    ['25', '33'],
    ['26', '34'],
    ['27', '34'],
    ['27', '35'],
    ['29', '37'],
    ['30', '38'],
    ['31', '38'],
    ['31', '39'],
    ['32', '40'],
    ['33', '40'],
    ['35', '40'],
    ['36', '37'],    
    ['37', '40'],
    ['39', '40']
];*/

let T_1 = [
    ['0', '1'],
    ['0', '7'],
    ['1', '8'],
		['2','10'],
		['3','11'],
		['3','4'],
		['5','12'],
		['6','13'],
		['8', '9'],
    ['8', '15'],
    ['8', '23'],
    ['9', '17'],
		['10','17'],
		['11','19'],
		['12','20'],
		['13','20'],
		['14','21'],
		['14','22'],
		['16','17'],
		['17','24'],
		['18','19'],
		['19','20'],
		['20','28'],
		['21','28'],
		['22','23'],
		['24','32'],
		['25','26'],
		['26','27'],
		['27','34'],
		['27','35'],
		['29','37'],
		['30','37'],
		['30','38'],
		['31','38'],
		['32','33'],
		['32','40'],
		['35','36'],
		['36','37'],
		['37','40'],
		['39','40']
];

/*let T_2 = [
    ['8', '9'],
    ['8', '15'],
    ['9', '10'],
    ['10', '11'],
    ['11', '12'],
    ['12', '20'],
    ['13', '14'],
    ['14', '15'],
    ['16', '17'],
    ['16', '23'],
    ['17', '18'],
    ['18', '19'],
    ['19', '20'],
    ['20', '28'],
    ['21', '22'],
    ['22', '23'],
    ['24', '25'],
    ['24', '31'],
    ['25', '26'],
    ['26', '27'],
    ['27', '28'],
    ['28', '36'],
    ['29', '30'],
    ['30', '31'],
    ['32', '33'],
    ['32', '39'],
    ['33', '34'],
    ['34', '35'],
    ['35', '36'],
    ['36', '40'],
    ['37', '38'],
    ['38', '39']
];*/

let T_2 = [
  ['0','8'], ['1','2'], ['2','3'], ['2','9'], ['4','5'], ['4','11'], ['5','6'], ['5','13'],
  ['6','7'], ['8','16'], ['9','10'], ['9','16'], ['10','11'], ['10','18'], ['11','12'], ['12','13'],
  ['12','19'], ['13','14'], ['13','21'], ['14','15'], ['15','23'], ['16','23'], ['16','24'],
  ['17','18'], ['17','25'], ['18','25'], ['18','26'], ['19','26'], ['19','27'], ['20','21'],
  ['21','22'], ['21','29'], ['22','29'], ['22','30'], ['23','30'], ['23','31'], ['24','25'],
  ['24','31'], ['24','39'], ['25','33'], ['26','33'], ['26','34'], ['27','28'], ['28','29'],
  ['28','35'], ['28','36'], ['29','30'], ['30','31'], ['31','39'], ['32','39'], ['33','34'],
  ['33','40'], ['34','35'], ['35','40'], ['36','40'], ['37','38'], ['38','39']
];


let Items={"blitz":4, "redmove":8, "addred":12};
let blitzused=0;
let rednodemoveuse=0;
let addreduse =0;


let node_positions = {};
for (const [name, [fx, fy]] of Object.entries(tikz_nodes)) {
  const x = WINDOW_SIZE / 2 + fx * (WINDOW_SIZE / 2) * BOARD_SCALE;
  const y = WINDOW_SIZE / 2 - fy * (WINDOW_SIZE / 2) * BOARD_SCALE;
  node_positions[name] = [x, y];
}


//--------------------------------------------------
/*
function shuffle(array) {
  for (let i = array.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createMaximalPlanarGraph(n) {
  if (n < 3) throw new Error("Ein maximal planarer Graph benötigt mindestens 3 Knoten.");

  const graph = {};
  function addNode(id) {
    if (!graph[id]) graph[id] = new Set();
  }
  function addEdge(u, v) {
    graph[u].add(v);
    graph[v].add(u);
  }

  addNode(0);
  addNode(1);
  addNode(2);
  addEdge(0, 1);
  addEdge(1, 2);
  addEdge(2, 0);

  let faces = [[0, 1, 2]];
  for (let newNode = 3; newNode < n; newNode++) {
    addNode(newNode);
    let face = faces.pop();
    const [a, b, c] = face;
    addEdge(newNode, a);
    addEdge(newNode, b);
    addEdge(newNode, c);
    faces.push([newNode, a, b]);
    faces.push([newNode, b, c]);
    faces.push([newNode, c, a]);
  }

  const edges = [];
  const seen = new Set();
  for (const u in graph) {
    for (const v of graph[u]) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`;
      if (!seen.has(key)) {
        edges.push([u.toString(), v.toString()]);
        seen.add(key);
      }
    }
  }

  return { nodes: Object.keys(graph).map(String), edges, graph };
}

function removeEdges(nodes, edges, edgesToRemove) {
  const graph = {};
  nodes.forEach(n => graph[n] = new Set());

  const removeSet = new Set(edgesToRemove.map(e =>
    e[0] < e[1] ? `${e[0]}-${e[1]}` : `${e[1]}-${e[0]}`
  ));

  edges.forEach(([u, v]) => {
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    if (!removeSet.has(key)) {
      graph[u].add(v);
      graph[v].add(u);
    }
  });

  return graph;
}

function isConnected(graph) {
  const visited = new Set();
  function dfs(u) {
    visited.add(u);
    for (const v of graph[u]) {
      if (!visited.has(v)) dfs(v);
    }
  }
  if (!graph['0']) return false;
  dfs('0');
  return Object.keys(graph).every(n => visited.has(n));
}

function getRandomSpanningTreeEdgesFromGraph(graph) {
  const visited = new Set();
  const treeEdges = [];

  function dfs(u) {
    visited.add(u);
    const neighbors = shuffle([...graph[u]]);
    for (const v of neighbors) {
      if (!visited.has(v)) {
        treeEdges.push([u.toString(), v.toString()]);
        dfs(v);
      }
    }
  }

  dfs('0');
  return treeEdges;
}

function getTikzNodePositionsGrid(nodes, range = 0.8) {
  const positions = {};
  const n = nodes.length;
  const gridSize = Math.ceil(Math.sqrt(n));
  const spacing = (2 * range) / (gridSize - 1);

  let i = 0;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (i >= n) break;
      const x = -range + col * spacing;
      const y = range - row * spacing;
      positions[nodes[i]] = [+(x.toFixed(4)), +(y.toFixed(4))];
      i++;
    }
  }
  return positions;
}


function mergeEdges(edges1, edges2) {
  const edgeSet = new Set();
  const addEdge = ([u, v]) => {
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    edgeSet.add(key);
  };
  edges1.forEach(addEdge);
  edges2.forEach(addEdge);
  return Array.from(edgeSet).map(e => e.split('-'));
}

function findTwoSpanningTreesRandom(n) {
  const { nodes, edges, graph: originalGraph } = createMaximalPlanarGraph(n);
  let tree1Edges, tree2Edges;
  let tries = 0;
  const maxTries = 100;

  while (tries < maxTries) {
    tries++;
    tree1Edges = getRandomSpanningTreeEdgesFromGraph(originalGraph);
    const graphWithoutTree1 = removeEdges(nodes, edges, tree1Edges);
    if (isConnected(graphWithoutTree1)) {
      tree2Edges = getRandomSpanningTreeEdgesFromGraph(graphWithoutTree1);
      break;
    }
  }

  if (tries === maxTries) {
    throw new Error("Kein zweiter Spannbaum gefunden nach vielen Versuchen.");
  }

  const tikz_nodess = getTikzNodePositionsGrid(nodes);

  const edge_pairss = mergeEdges(tree1Edges, tree2Edges);

  return { tikz_nodess, tree1Edges, tree2Edges, edge_pairss };
}

*/



//--------------------------------------------------

// --- Spielzustand ---
let edge_state = new Map(); // key: "u,v" sorted string, value: null or 'M' or 'B'
const move_history = [];
const edge_animations = new Map(); // key: "u,v", value: {startTime, fromColor, toColor}
let winning_path = [];
let current_turn = 'M';
let game_over = false;
let undo_available = false;
let lastmove_available = false;
let hovered_edge = null;



//-------------------------------------------------------------
function generateRandomTree(n) {
      const prufer = Array.from({ length: n - 2 }, () => Math.floor(Math.random() * n));
      const degree = Array(n).fill(1);
      for (let node of prufer) degree[node]++;

      const edges = [];
      for (let node of prufer) {
        for (let i = 0; i < n; i++) {
          if (degree[i] === 1) {
            edges.push([i, node]);
            degree[i]--;
            degree[node]--;
            break;
          }
        }
      }
      const remaining = [];
      for (let i = 0; i < n; i++) {
        if (degree[i] === 1) remaining.push(i);
      }
      edges.push(remaining);
      return edges;
    }

    function getComplementEdges(n, usedEdges) {
      const edgeSet = new Set(usedEdges.map(e => `${Math.min(...e)}-${Math.max(...e)}`));
      const complement = [];
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const key = `${i}-${j}`;
          if (!edgeSet.has(key)) {
            complement.push([i, j]);
          }
        }
      }
      return complement;
    }

    function getRandomSpanningTreeFromEdges(n, edgeList) {
      const parent = Array(n).fill(0).map((_, i) => i);
      const find = x => parent[x] === x ? x : parent[x] = find(parent[x]);
      const union = (x, y) => { parent[find(x)] = find(y); };

      const shuffled = edgeList.slice().sort(() => Math.random() - 0.5);
      const tree = [];

      for (const [u, v] of shuffled) {
        if (find(u) !== find(v)) {
          union(u, v);
          tree.push([u, v]);
          if (tree.length === n - 1) break;
        }
      }
      return tree;
    }

function buildGraphData(n, tree1Edges, tree2Edges) {
  // 1. Convert edge lists to string-based identifiers
  const stringifyEdges = edges => 
    edges.map(([u, v]) => 
      u < v ? [u.toString(), v.toString()] : [v.toString(), u.toString()]
    );
    
  const tree1Str = stringifyEdges(tree1Edges);
  const tree2Str = stringifyEdges(tree2Edges);

  // 2. Build union edge list
  const edgeKey = (u, v) => {
    const [a, b] = [u, v].sort();
    return `${a}-${b}`;
  };

  const edgeSet = new Set();
  const unionEdges = [];

  for (let [u, v] of tree1Str.concat(tree2Str)) {
    const key = edgeKey(u, v);
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      unionEdges.push([u, v]);
    }
  }

  // 3. Build adjacency list
  const adj = {};
  const degrees = {};
  for (let i = 0; i < n; i++) {
    const id = i.toString();
    adj[id] = [];
    degrees[id] = 0;
  }
  for (let [u, v] of unionEdges) {
    adj[u].push(v);
    adj[v].push(u);
    degrees[u]++;
    degrees[v]++;
  }

  // 4. BFS to find diameter
  function bfs(start) {
    const dist = {};
    const prev = {};
    const queue = [start];
    dist[start] = 0;
    let farthest = start;

    while (queue.length > 0) {
      const u = queue.shift();
      for (let v of adj[u]) {
        if (dist[v] === undefined) {
          dist[v] = dist[u] + 1;
          prev[v] = u;
          queue.push(v);
          if (dist[v] > dist[farthest]) {
            farthest = v;
          }
        }
      }
    }

    return { farthest, dist, prev };
  }

  const { farthest: v1 } = bfs("0");
  const { farthest: v2 } = bfs(v1);
  const diameterNodes = new Set([v1, v2]);

  // 5. Force-directed Layout (Fruchterman-Reingold)
  const ids = Object.keys(degrees);
  const positions = {};
  for (let i = 0; i < n; i++) {
    const id = i.toString();
    positions[id] = [Math.random(), Math.random()];
  }

  const steps = 200;
  const area = 1.0;
  const k = Math.sqrt(area / n); // ideal distance between nodes
  const gravity = 0.1;
  const cooling = t => 0.1 * (1 - t / steps);

  for (let step = 0; step < steps; step++) {
    const disp = {};
    for (let id of ids) disp[id] = [0, 0];

    // Repulsive forces
    for (let i = 0; i < n; i++) {
      const v = ids[i];
      const [xv, yv] = positions[v];
      for (let j = i + 1; j < n; j++) {
        const u = ids[j];
        const [xu, yu] = positions[u];
        let dx = xv - xu, dy = yv - yu;
        let dist = Math.sqrt(dx*dx + dy*dy) + 1e-4;
        let force = k * k / dist;
        let fx = (dx / dist) * force, fy = (dy / dist) * force;
        disp[v][0] += fx; disp[v][1] += fy;
        disp[u][0] -= fx; disp[u][1] -= fy;
      }
    }

    // Attractive forces
    for (let [v, u] of unionEdges) {
      const [xv, yv] = positions[v];
      const [xu, yu] = positions[u];
      let dx = xv - xu, dy = yv - yu;
      let dist = Math.sqrt(dx*dx + dy*dy) + 1e-4;
      let force = (dist * dist) / k;
      let fx = (dx / dist) * force, fy = (dy / dist) * force;
      disp[v][0] -= fx; disp[v][1] -= fy;
      disp[u][0] += fx; disp[u][1] += fy;
    }

    // Apply forces
    const temp = cooling(step);
    for (let id of ids) {
      let [dx, dy] = disp[id];
      let [x, y] = positions[id];
      let len = Math.sqrt(dx*dx + dy*dy);
      if (len > 0) {
        dx = dx / len * Math.min(temp, len);
        dy = dy / len * Math.min(temp, len);
      }
      x += dx;
      y += dy;

      // Gravity toward center
      x += (0.5 - x) * gravity * temp;
      y += (0.5 - y) * gravity * temp;

      positions[id] = [x, y];
    }
  }


// 6. Normalize to [-0.8, 0.8] range, centered
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
for (let id in positions) {
  const [x, y] = positions[id];
  minX = Math.min(minX, x); maxX = Math.max(maxX, x);
  minY = Math.min(minY, y); maxY = Math.max(maxY, y);
}
const w = maxX - minX;
const h = maxY - minY;

for (let id in positions) {
  const [x, y] = positions[id];
  const normX = (x - (minX + maxX) / 2) / (w / 2); // [-1, 1]
  const normY = (y - (minY + maxY) / 2) / (h / 2); // [-1, 1]
  positions[id] = [normX * 0.8, normY * 0.6+0.3];      // scale to [-0.8, 0.8]
}



  return {
    positions,         // { "0": [x, y], ... }
    unionEdges,        // [["0", "1"], ...]
    tree1Edges: tree1Str,
    tree2Edges: tree2Str,
    diameterNodes      // Set(["u", "v"])
  };
}







// Hilfsfunktion für Key in Map: sortiere Knoten alphabetisch
function edgeKey(u,v) {
  return (parseInt(u) < parseInt(v)) ? `${u},${v}` : `${v},${u}`;
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

const effectCanvas = document.getElementById('effectcanvas');
const effectCtx = effectCanvas.getContext('2d');

effectCanvas.width = WINDOW_SIZE;
effectCanvas.height = WINDOW_SIZE;

// UI Elemente
const restartBtn = document.getElementById('restartBtn');
const undoBtn = document.getElementById('undoBtn');
const lastmoveBtn = document.getElementById('lastmoveBtn');
const randomlayoutBtn = document.getElementById('randomlayoutBtn');
const statusDiv = document.getElementById('status');
const blitzBtn = document.getElementById('blitz-button');
const pointselement = document.getElementById('points-value');
const reloadredBtn = document.getElementById('reloadred-button');
const addredBtn = document.getElementById('addred-button');

restartBtn.addEventListener('click', () => {
  if(blitzongoing || botismoving || rednodemoving || rednodeadding) return;
  resetGame();
  updateStatus();
  draw();
});

undoBtn.addEventListener('click', () => {
  if (!undo_available || game_over || blitzongoing || rednodemoving || rednodeadding) return;
  undoMove();
  updateStatus();
  draw();
});

lastmoveBtn.addEventListener('click', () => {
  if (!lastmove_available || game_over || blitzongoing || rednodemoving || rednodeadding) return;
  lastMove();
});

randomlayoutBtn.addEventListener('click', () => {
  if(blitzongoing || rednodemoving || rednodeadding) return;
  randomgamelayout();
  resetGame();
  updateStatus();
  draw();
});

blitzBtn.addEventListener('click', () => {
  if (game_over || botismoving || blitzongoing || rednodemoving ||rednodeadding) return;
  startThunderstorm();
});

reloadredBtn.addEventListener('click', () => {
  if (game_over || botismoving || blitzongoing || rednodemoving || rednodeadding) return;
  rednovemove();
  updateStatus();
  itemsavailable();
});

addredBtn.addEventListener('click', () => {
  if (game_over || botismoving || blitzongoing || rednodemoving || rednodeadding) return;
  addrednode();
  updateStatus();
  itemsavailable();
});

// Game Loop mit Animationen
function gameLoop(timestamp) {
  draw(timestamp);
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// === Funktionen ===

function resetGame() {
	red_nodes=initred_nodes;
  for (const key of edge_state.keys()) {
    edge_state.set(key, null);
  }
  blitzused=0;
  rednodemoveuse =0;
	addreduse=0;
  move_history.length = 0;
  edge_animations.clear();
  winning_path = [];
  current_turn = 'M';
  game_over = false;
  undo_available = false;
  lastmove_available = false;
  lastmoveBtn.disabled =true;
  undoBtn.disabled =true;
  itemsavailable();
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
  lastmove_available = move_history.length > 0;
  lastmoveBtn.disabled =!undo_available;

  updateStatus();
  draw();
  //if(botM== true && current_turn == 'M')botPlay();
}

function randomgamelayout() {
  let n = 30;
  BOARD_SCALE = 1;
  Teasy = [];
  tree1 = generateRandomTree(n);
  complement = getComplementEdges(n, tree1);
  tree2 = getRandomSpanningTreeFromEdges(n, complement);

  result = buildGraphData(n, tree1, tree2);

  tikz_nodes = result.positions;
  initred_nodes = result.diameterNodes;
	red_nodes = initred_nodes;
  edge_pairs = result.unionEdges;
  T_1 = result.tree1Edges;
  T_2 = result.tree2Edges;

  node_positions = {};
  for (const [name, [fx, fy]] of Object.entries(tikz_nodes)) {
    const x = WINDOW_SIZE / 2 + fx * (WINDOW_SIZE / 2) * BOARD_SCALE;
    const y = WINDOW_SIZE / 2 - fy * (WINDOW_SIZE / 2) * BOARD_SCALE;
    node_positions[name] = [x, y];
  }


  edge_state = new Map(); // key: "u,v" sorted string, value: null or 'M' or 'B'
  // Init alle Kanten mit null (frei)
  for (const [u,v] of edge_pairs) {
    edge_state.set(edgeKey(u,v), null);
  }
  resetGame();
}

function lastMove() {
  if (move_history.length === 0 || lastmove_available === false) return;
  // Letzten Zug holen
  const [lastEdge, lastPlayer] = move_history[move_history.length-1];
  let lastEdgekey = edgeKey(...lastEdge);
  let color = colormap[getEdgeColor(lastEdgekey,0)];
  if(edge_animations.get(lastEdgekey)) return;
  edge_animations.set(lastEdgekey, {
    startTime: performance.now(),
    fromColor: color, // grau
    toColor: [255, 0, 0],
    duration:  PULSE_DURATION
  });
  setTimeout(function() {
    edge_animations.set(lastEdgekey, {
    startTime: performance.now(),
    fromColor: color, // grau
    toColor: [255, 0, 0],
    duration:  PULSE_DURATION
  });
  }, PULSE_DURATION);
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
    playClickSound();
    const key = edgeKey(...bestEdge);
    if (edge_state.get(key) === null) {
      edge_state.set(key, current_turn);
      move_history.push([bestEdge, current_turn]);
      undo_available = true;
      undoBtn.disabled =false;
      lastmove_available = true;
      lastmoveBtn.disabled =false;
      startEdgeAnimation(key, current_turn);
      checkWin();
      if (!game_over) {
        current_turn = current_turn === 'M' ? 'B' : 'M';
        if(botM== true && current_turn == 'M')botPlay(botDifficulty);
      }
    }
  }
  itemsavailable();
}

function startEdgeAnimation(key, player) {
  edge_animations.set(key, {
    startTime: performance.now(),
    fromColor: [192, 192, 192], // grau
    toColor: player === 'M' ? [255, 153, 51] : [51,51,255]
  });
}

function getEdgeColor(key, timestamp) {
  const anim = edge_animations.get(key);
  if (!anim) {
    const state = edge_state.get(key);
    if (state === 'M') return 'orange';
    if (state === 'B') return 'blue';
    if (state === 'N') return 'white'
    return 'lightgray';
  }
  const elapsed = timestamp - anim.startTime;
  let duration = ANIM_DURATION; // shorter animation for last move
  if(anim.duration) duration = anim.duration;
  if (elapsed >= duration) {
    edge_animations.delete(key);
    return (edge_state.get(key) === 'M') ? 'orange' : 'blue';
  }
  // Interpolieren
  const t = elapsed / duration;
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
	//---------------------------
	//if(T_2.some(pair => pair[0] === u && pair[1] === v))color='brown';
	//---------------------------

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
	switch(color){
		case 'red':
			ctx.shadowColor ='rgba(255,0,0,0.7)';
			break;
		default:
			ctx.shadowColor ='rgba(0,0,0,0.15)';
	}
  //ctx.shadowColor = (color === 'red') ? 'rgba(255,0,0,0.7)' : 'rgba(0,0,0,0.15)';
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
  const nodes = Array.from(red_nodes);
  if (nodes.length === 0) return;

  // Adjazenzliste: nur 'M'-Kanten
  const adj = {};
  for (const [u, v] of edge_pairs) {
    if (edge_state.get(edgeKey(u, v)) === 'M') {
      if (!adj[u]) adj[u] = [];
      if (!adj[v]) adj[v] = [];
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  // BFS von einem beliebigen Knoten
  const start = nodes[0];
  const visited = new Set([start]);
  const parent = {};
  const queue = [start];

  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor of (adj[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent[neighbor] = node;
        queue.push(neighbor);
      }
    }
  }

  // Prüfe, ob alle red_nodes erreicht wurden
  let allConnected = true;
  for (const node of nodes) {
    if (!visited.has(node)) {
      allConnected = false;
      break;
    }
  }

  if (allConnected) {
    // Gewinnbedingung erfüllt
    winning_path = [];

    // Pfade zu allen red_nodes rekonstruieren
    for (let i = 1; i < nodes.length; i++) {
      const goal = nodes[i];
      let cur = goal;
      while (cur !== start) {
        const p = parent[cur];
        if (!p) break; // falls ein Pfad doch nicht da ist
        winning_path.push(edgeKey(cur, p));
        cur = p;
      }
    }

    game_over = true;
    updateStatus(`${current_turn} gewinnt!`);
    undo_available = false;
    undoBtn.disabled = true;
    lastmove_available = false;
    lastmoveBtn.disabled = true;
    showResultBanner("M", false);
    return;
  }

  // Kein Pfad gefunden: Prüfen ob M noch gewinnen kann
  winning_path = [];
  if (canMStillWin() === false) {
    game_over = true;
    updateStatus(`B gewinnt!`);
    undo_available = false;
    undoBtn.disabled = true;
    lastmove_available = false;
    lastmoveBtn.disabled = true;
    showResultBanner("B", false);
    return;
  }

  // Spiel geht weiter
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
    const [x2,y2] =node_positions[v];
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
  if (game_over || botismoving || blitzongoing || rednodemoving || rednodeadding) return;
	if(botSelect.value == 'none'){
		botSelect.options[0].hidden = true;
		botSelect.classList.add('highlight');
		return;
	}
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
  // Punkte updaten
  //let currentPoints = parseInt(pointselement.textContent, 10);
  let roundsplayed = parseInt(move_history.length/2);
  pointselement.textContent = Math.max(0,roundsplayed-4*blitzused-8*rednodemoveuse-12*addreduse);
}


function canMStillWin() {
  const redNodesArray = Array.from(red_nodes);
  const start = redNodesArray[0];

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

  // BFS vom start Knoten
  const queue = [start];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor of (adj[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  // Prüfen, ob alle Knoten aus red_nodes erreicht wurden
  return redNodesArray.every(node => visited.has(node));
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
  botismoving =true;
  setTimeout(function() {
  if (botDifficulty=="leicht"){
    botplayleicht();
  }else if(botDifficulty=="mittel"){
    botplaymittel();
  }else if(botDifficulty=="schwer"){
    botplayschwer();
  }else if(botDifficulty=="godlike"){
    botplaygodlike();
  }
  botismoving = false;
}, 500);
  
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
    lastmove_available = true;
    lastmoveBtn.disabled =false;
    startEdgeAnimation(key, current_turn);
    playClickSound();
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
    lastmove_available = true;
    lastmoveBtn.disabled =false;
    startEdgeAnimation(randomKey, current_turn);
    playClickSound();
    checkWin();
    if (!game_over) {
      current_turn = 'B';
    }
    updateStatus();
    draw();
  }
}



function findBestPathForM() {
    const redNodesArray = Array.from(red_nodes);

// Shuffle using Fisher–Yates algorithm
for (let i = redNodesArray.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [redNodesArray[i], redNodesArray[j]] = [redNodesArray[j], redNodesArray[i]];
}

  // Hilfsfunktion: BFS über M-Kanten, um alle von start aus verbundenen Knoten zu ermitteln
  function getConnectedNodes(start) {
    const adj = {};
    for (const [u, v] of edge_pairs) {
      if (edge_state.get(edgeKey(u, v)) === 'M') {
        if (!adj[u]) adj[u] = [];
        if (!adj[v]) adj[v] = [];
        adj[u].push(v);
        adj[v].push(u);
      }
    }
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    while (queue.length > 0) {
      const node = queue.shift();
      for (const n of (adj[node] || [])) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
      }
    }
    return visited;
  }

  // 1) Suche einen Knoten r in red_nodes, der nicht mit allen anderen red_nodes verbunden ist
  let r = null;
  for (const node of redNodesArray) {
    const connected = getConnectedNodes(node);
    // Prüfe, ob alle red_nodes in connected sind
    const allConnected = redNodesArray.every(n => connected.has(n));
    if (!allConnected) {
      r = node;
      break;
    }
  }

  if (!r) {
    // Alle Knoten sind verbunden
    // console.log("Alle Knoten in red_nodes sind bereits verbunden.");
    return null;
  }
  // console.log("Ausgewählter Startknoten r:", r);

  // 2) Finde unter den nicht verbundenen Knoten den mit minimalem Abstand
  const targets = redNodesArray.filter(n => n !== r);

  // Dijkstra-ähnliche Suche von r zu allen Zielen
  const dist = {};
  const prev = {};
  const visited = new Set();

  for (const node in tikz_nodes) {
    dist[node] = Infinity;
  }
  dist[r] = 0;

  const pq = [[0, r]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [curDist, u] = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);

    for (const [n1, n2] of edge_pairs) {
      if (n1 !== u && n2 !== u) continue;
      const v = (n1 === u) ? n2 : n1;
      if (visited.has(v)) continue;

      const key = edgeKey(u, v);
      const state = edge_state.get(key);
      if (state === 'B') continue; // blockiert

      const cost = (state === 'M') ? 0 : 1; // M=0, null=1
      const alt = curDist + cost;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        pq.push([alt, v]);
      }
    }
  }

  // 3) Wähle das Ziel p mit minimalem Abstand, zu dem noch nicht verbunden ist
  let minDist = Infinity;
  let p = null;
  for (const t of targets) {
    // Ist t schon verbunden mit r? Prüfe mit getConnectedNodes nochmal?
    const connectedFromR = getConnectedNodes(r);
    if (connectedFromR.has(t)) continue; // schon verbunden, überspringen

    if (dist[t] < minDist) {
      minDist = dist[t];
      p = t;
    }
  }

  if (p === null || minDist === Infinity) {
    // Kein Ziel gefunden, evtl. alles verbunden oder blockiert
    // console.log("Kein Zielknoten p gefunden, der mit r verbunden werden kann.");
    return null;
  }
   //console.log("Gewählter Zielknoten p:", p);

  // 4) Pfad von r zu p zurückverfolgen
  const path = [];
  let cur = p;
  while (cur !== r) {
    const parent = prev[cur];
    if (!parent) break; // absichern
    path.push(edgeKey(cur, parent));
    cur = parent;
  }
  path.reverse();

   //console.log("Pfad von r zu p:", path);

  return path;
}


function botplaymittel() {
 if (game_over || current_turn !== 'M') return;
  var it = red_nodes.values();
  const start = it.next().value;
  const goal = it.next().value;

  // Zähle bisherige M-Züge
  const mMoves = move_history.filter(move => move[1] === 'M').length;

  // Sonderfall: 2. M-Zug → Bevorzuge Kante mit b5
  if (mMoves === 1) {
    const b5Edges = [];
    for (const [key, state] of edge_state.entries()) {
      if (state === null && key.includes(goal)) {
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
      lastmove_available = true;
      lastmoveBtn.disabled =false;
      startEdgeAnimation(key, current_turn);
      playClickSound();
      checkWin();
      if (!game_over) {
        current_turn = 'B';
      }
      updateStatus();
      draw();
      return;
    }
  }

  const path = findBestPathForM();

  if (path && path.length > 0) {
		for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (edge_state.get(key) === null) {
      const [u, v] = key.split(',');
      edge_state.set(key, 'M');
      move_history.push([[u, v], 'M']);
      undo_available = true;
      undoBtn.disabled = false;
      lastmove_available = true;
      lastmoveBtn.disabled = false;
      startEdgeAnimation(key, current_turn);
      playClickSound();
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
    lastmove_available = true;
    lastmoveBtn.disabled = false;
    startEdgeAnimation(randomKey, current_turn);
    playClickSound();
    checkWin();
    if (!game_over) {
      current_turn = 'B';
    }
    updateStatus();
    draw();
  }
}


/*function botplaymittel() {
  if (game_over || current_turn !== 'M') return;
  var it = red_nodes.values();
  const start = it.next().value;
  const goal = it.next().value;

  // Zähle bisherige M-Züge
  const mMoves = move_history.filter(move => move[1] === 'M').length;

  // Sonderfall: 2. M-Zug → Bevorzuge Kante mit b5
  if (mMoves === 1) {
    const b5Edges = [];
    for (const [key, state] of edge_state.entries()) {
      if (state === null && key.includes(goal)) {
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
      lastmove_available = true;
      lastmoveBtn.disabled =false;
      startEdgeAnimation(key, current_turn);
      hoverclick.play();
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
        lastmove_available = true;
        lastmoveBtn.disabled =false;
        startEdgeAnimation(key, current_turn);
        hoverclick.play();
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
    lastmove_available = true;
    lastmoveBtn.disabled =false;
    startEdgeAnimation(randomKey, current_turn);
    hoverclick.play();
    checkWin();
    if (!game_over) {
      current_turn = 'B';
    }
    updateStatus();
    draw();
  }
}



function findBestPathForM() {
  var it = red_nodes.values();
  const start = it.next().value;
  const goal = it.next().value;

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
}*/

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
  if (mMoves <= 15) {
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
  if(!T1conn.usedEdge){botplayleicht();return;}
  let [u,v]= T1conn.usedEdge;
  playEdge(u,v);
  return;
}
if(T1conn.connected == true && T2conn.connected == false){
  if(!T2conn.usedEdge){botplayleicht();return;}
  let [u,v]= T2conn.usedEdge;
  playEdge(u,v);
  return;
}
else if(T1conn.connected == false && T2conn.connected == false){
  botplaymittel();
  return;
}

function playEdge(u, v) {
  const key = edgeKey(u, v);
  edge_state.set(key, 'M');
  move_history.push([[u, v], 'M']);
  undo_available = true;
  undoBtn.disabled = false;
  lastmove_available = true;
  lastmoveBtn.disabled =false;
  startEdgeAnimation(key, current_turn);
  playClickSound();
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

const itemModal = document.getElementById('itemModal');
const itemsYesBtn = document.getElementById('itemsYes');
const itemsNoBtn = document.getElementById('itemsNo');
const itemsdiv = document.getElementById('Items');
itemsdiv.style.display ='none';



botSelect.addEventListener('mousedown',function(e){
  botSelect.options[0].hidden = true;
  if(botismoving || blitzongoing || rednodemoving || rednodeadding)
  {
     e.preventDefault();
  }
})

/*botSelect.addEventListener('change', () => {
  botDifficulty = botSelect.value;
  botM=true;
  resetGame();
});*/
botSelect.addEventListener('change', () => {
	botSelect.classList.remove('highlight');
  botDifficulty = botSelect.value;
  botM = botDifficulty !== 'none';

  if (botM) {
    // Zeige das Modal
    itemModal.style.display = 'flex';
  } else {
		itemsdiv.style.display ='none';
    resetGame(); // direkt weitermachen wenn "Mensch" gewählt
  }
});

// Nur weiter, wenn der Nutzer Ja oder Nein klickt
itemsYesBtn.addEventListener('click', () => {
  itemsdiv.style.display ='block';
  itemModal.style.display = 'none';
  resetGame();
});

itemsNoBtn.addEventListener('click', () => {
  itemsdiv.style.display ='none';
  itemModal.style.display = 'none';
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
      victorysound.play();
    }else{
      banner.innerHTML = `🎉 Glückwunsch, <strong>Breaker</strong>! Du hast gewonnen! 🎉`;  
      victorysound.play();
    }
  }else if(botDifficulty=="godlike"){
    if(playerName=="M"){
      banner.innerHTML = `😢 Der Computer hat gewonnen. Viel Glück beim nächsten Mal. 😢`;
      //-----------------
      loosesoundgodlike.play();
      //-----------------
    }else{
      banner.innerHTML = `🎉 Glückwunsch, <strong>Breaker</strong>! Du hast gewonnen! 🎉`;  
      //-----------------
      victorysoundgodlike.play();
      //-----------------
    }
  
  }else{
    if(playerName=="M"){
      banner.innerHTML = `😢 Der Computer hat gewonnen. Viel Glück beim nächsten Mal. 😢`;
      //-----------------
      loosesound.play();
      //-----------------
    }else{
      banner.innerHTML = `🎉 Glückwunsch, <strong>Breaker</strong>! Du hast gewonnen! 🎉`;  
      //-----------------
      victorysound.play();
      //-----------------
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
  //-------------------
  // Schließen-Button hinzufügen
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✖';
  closeBtn.className = 'close-button';
  closeBtn.onclick = () => {
    removeBanner();
  };
  banner.appendChild(closeBtn);

  //-------------------
  // Nach 5 Sekunden das Overlay entfernen
  setTimeout(() => {
  removeBanner();
  }, 5000);

}

function removeBanner() {
  const overlay = document.getElementById('result-overlay');
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
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
  background: rgba(0,0,0,0.3); /* Weniger dunkel als vorher (war 0.5) */
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Damit der Banner oben sitzt */
  padding-top: 20vh; /* Abstand von oben ca. 20% der Viewport-Höhe */
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


//--------------------------------------------------------------------
let middleCloud = null;

    function createCloud(left, baseSize, delay, markMiddle) {
      const rel = left / window.innerWidth, edge = 1 + Math.abs(0.5 - rel) * 0.5;
      const size = baseSize * edge * (0.9 + Math.random() * 0.2);
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.setProperty('--cloud-size', size + 'px');
      cloud.style.left = left + 'px';
      cloud.style.top = '0px';
      cloud.style.animation = `floatIn 4s ease-out ${delay}s forwards, floatOut 3s ease-in ${delay + 4}s forwards`;
      if (markMiddle) middleCloud = cloud;

      const parts = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < parts; i++) {
        const p = document.createElement('div');
        p.className = 'cloud-part';
        const scale = 0.2 + Math.random() * 0.6;
        const w = size * scale;
        const h = w * (0.5 + Math.random() * 0.3);
        const xOff = Math.random() * (size - w) + (Math.random() - 0.5) * 20;
        const yOff = (size * 0.3 - h / 2) + (Math.random() - 0.5) * 20;
        p.style.width = w + 'px';
        p.style.height = h + 'px';
        p.style.left = xOff + 'px';
        p.style.top = yOff + 'px';
        cloud.appendChild(p);
      }

      document.getElementById('cloud-layer').appendChild(cloud);
      return cloud;
    }

    function createRainDrop(delay, left, dur) {
      const d = document.createElement('div');
      d.className = 'raindrop';
      d.style.left = left + 'px';
      d.style.animationDelay = delay + 's';
      d.style.animationDuration = dur + 's';
      document.getElementById('rain-layer').appendChild(d);
    }

		function strikeBolt(targetX = null, targetY = null, lineStartX = null, lineStartY = null, lineEndX = null, lineEndY = null) {
			if (!middleCloud) return;
		
			const canvasRect = canvas.getBoundingClientRect();
			const absTargetX = targetX !== null ? canvasRect.left + targetX : null;
			const absTargetY = targetY !== null ? canvasRect.top + targetY : null;
		
			const rect = middleCloud.getBoundingClientRect();
			const startX = rect.left + rect.width / 2;
			const startY = rect.top + rect.height * 0.3;
		
			const endX = absTargetX !== null ? absTargetX : startX;
			const endY = absTargetY !== null ? absTargetY : startY + 640;
		
			const svg = document.getElementById('bolt');
			if (!svg) return;
			svg.innerHTML = '';
		
			const steps = 6;
			const dx = (endX - startX) / (steps - 1);
			const dy = (endY - startY) / (steps - 1);
			const xOffsets = [0, 20, -20, 15, -15, 0];
		
			const points = Array.from({ length: steps }, (_, i) => {
				const x = startX + dx * i + xOffsets[i % xOffsets.length];
				const y = startY + dy * i;
				return `${x},${y}`;
			}).join(' ');
		
			const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
			poly.setAttribute('points', points);
			poly.setAttribute('class', 'bolt boltAnim');
			svg.appendChild(poly);
		
			// ✨ Gelbe Linie mit Fade-Effekt
			if (lineStartX !== null && lineStartY !== null && lineEndX !== null && lineEndY !== null) {
				const absLineStartX = canvasRect.left + lineStartX;
				const absLineStartY = canvasRect.top + lineStartY;
				const absLineEndX = canvasRect.left + lineEndX;
				const absLineEndY = canvasRect.top + lineEndY;
		
				const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
				line.setAttribute('x1', absLineStartX);
				line.setAttribute('y1', absLineStartY);
				line.setAttribute('x2', absLineEndX);
				line.setAttribute('y2', absLineEndY);
				line.setAttribute('class', 'glowLine');
				svg.appendChild(line);
		
				// ❌ Entfernen nach 4 Sekunden
				setTimeout(() => {
					if (line.parentNode) {
						line.remove();
					}
				}, 4000); // 4 Sekunden
			}
		}
		


  function startThunderstorm() {
    blitzongoing = true;
    thunderstormsound.play();
    blitzused+=1;
    itemsavailable();
   document.getElementById('rain-layer').style.opacity = '1';

      const gameCanvas = document.getElementById('game-canvas');
gameCanvas.style.filter = 'brightness(0.5)';
      const sw = window.innerWidth;
      const cfg = [
        { left: 0.05, size: 240, delay: 0 },
        { left: 0.2, size: 260, delay: 0.3 },
        { left: 0.35, size: 280, delay: 0.6 },
        { left: 0.5, size: 300, delay: 0.9 },
        { left: 0.65, size: 270, delay: 1.2 },
        { left: 0.8, size: 260, delay: 1.5 },
        { left: 0.9, size: 250, delay: 1.8 }
      ];
      cfg.forEach((c, i) => createCloud(c.left * sw, c.size, c.delay, i === Math.floor(cfg.length / 2)));

      for (let i = 0; i < 100; i++) {
        createRainDrop(Math.random() * 2, Math.random() * sw, 0.5 + Math.random() * 0.5);
      }

      const cloudDeck = document.getElementById('cloud-deck');
      cloudDeck.style.animation = 'deckIn 4s ease-out forwards, deckOut 3s ease-in 7s forwards';

      setTimeout(() => document.body.style.background = '#444', 2000);

      setTimeout(() => {
        document.getElementById('flash-overlay').classList.add('flash');
        let [blitzu,blitzv] = blitzdeleteedge();
      let [positionblitzux,positionblitzuy] = node_positions[blitzu];
      let [positionblitzvx,positionblitzvy] = node_positions[blitzv];
      let [targetX,targetY] = [positionblitzux/2+positionblitzvx/2,positionblitzuy/2+positionblitzvy/2];
			let dx = positionblitzvx - positionblitzux;
let dy = positionblitzvy - positionblitzuy;

let len = Math.hypot(dx, dy); // Länge von vektor v - u

let directionvx = dx / len;
let directionvy = dy / len;

// In Gegenrichtung für u nach v
let directionux = -directionvx;
let directionuy = -directionvy;

// Starte 10 Einheiten in Richtung v
let x1 = positionblitzux + 10 * directionvx;
let y1 = positionblitzuy + 10 * directionvy;

// Starte 10 Einheiten in Richtung u
let x2 = positionblitzvx + 10 * directionux;
let y2 = positionblitzvy + 10 * directionuy;

// Blitz zeichnen
			strikeBolt(targetX,targetY,x1, y1, x2, y2);
        setTimeout(() => {
          document.getElementById('flash-overlay').classList.remove('flash');
        }, 500);
      }, 4000);

      setTimeout(() => document.getElementById('rain-layer').style.opacity = '0', 5000);

      setTimeout(() => {
        document.getElementById('cloud-layer').innerHTML = '';
  document.getElementById('rain-layer').innerHTML = '';
  document.body.style.background = 'transparent';
  cloudDeck.style.animation = '';
  cloudDeck.style.opacity = 0;

  // Canvas-Helligkeit zurücksetzen
  gameCanvas.style.filter = 'brightness(1)';
  blitzongoing = false;
      }, 9000);
    }

  

function blitzdeleteedge(){
  const freeEdges = [];
  for (const [key, state] of edge_state.entries()) {
    if (state === null) freeEdges.push(key);
  }

  if (freeEdges.length > 0) {
    const randomKey = freeEdges[Math.floor(Math.random() * freeEdges.length)];
    const [u, v] = randomKey.split(',');

		edge_state.set(randomKey, 'N');
    //move_history.push([[u, v], 'M']);
    checkWin();
    
    updateStatus();
    draw();
    return [u,v];
  }
}

function itemsavailable(){
  let points = Math.max(0,parseInt(move_history.length/2)-4*blitzused-8*rednodemoveuse-12*addreduse);
  for (const [name, round] of Object.entries(Items)) {
    if(name=="blitz"){
  if(round <= points){
    blitzBtn.disabled = false;
  }else{
    blitzBtn.disabled =true;
  }
}else if(name =="redmove"){
  if(round <= points){
    reloadredBtn.disabled = false;
  }else{
    reloadredBtn.disabled =true;
  }
}else if(name =="addred"){
  if(round <= points){
    addredBtn.disabled = false;
  }else{
    addredBtn.disabled =true;
  }
}
  }
}


function MWins() {
  const nodes = Array.from(red_nodes);
  if (nodes.length === 0) return false;
  if (nodes.length === 1) return true; // Ein einzelner Knoten ist trivial verbunden

  // Nur Kanten, die von M beansprucht sind, sind erlaubt
  const adj = {};
  for (const [u, v] of edge_pairs) {
    const state = edge_state.get(edgeKey(u, v));
    if (state === 'M') {
      if (!adj[u]) adj[u] = [];
      if (!adj[v]) adj[v] = [];
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  // BFS von einem Startknoten, um zu prüfen, ob alle red_nodes verbunden sind
  const start = nodes[0];
  const visited = new Set([start]);
  const queue = [start];

  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor of (adj[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  // Prüfe, ob alle Knoten aus red_nodes besucht wurden
  for (const node of nodes) {
    if (!visited.has(node)) {
      return false; // Mindestens ein Knoten nicht verbunden
    }
  }

  return true; // Alle red_nodes sind verbunden
}


function rednovemove() {
	rednodemoving =true;
  rednodemoveuse +=1;
function shuffleObjectKeys(obj) {
  // Hole alle Keys des Objekts
  const keys = Object.keys(obj);

  // Fisher-Yates Shuffle Algorithmus
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }

  return keys;
}
let rednodesfallback = red_nodes;
let fixedrednode = [...red_nodes]; // Kopie erstellen

// Zufälligen Index auswählen
let randomIndex = Math.floor(Math.random() * fixedrednode.length);

// Element an diesem Index entfernen
fixedrednode.splice(randomIndex, 1);
let shuffledkeys = shuffleObjectKeys(tikz_nodes);
for (let i = 0; i < shuffledkeys.length; i++) {
  const name = shuffledkeys[i];
  if(!fixedrednode.includes(name)){
    let oldred;
    red_nodes.forEach((node)=>{if(!fixedrednode.includes(node))oldred =node;});
    red_nodes = new Set();
		for (let j = 0; j < fixedrednode.length; j++) {
			red_nodes.add(fixedrednode[j]);
		}
    red_nodes.add(name);
    if(canMStillWin() && !MWins()){
      red_nodes = new Set();
      for (let j = 0; j < fixedrednode.length; j++) {
			red_nodes.add(fixedrednode[j]);
			}
      animateRay(node_positions[oldred], node_positions[name],()=>{red_nodes.add(name);rednodemoving=false;});
      return;
    }
  }else{red_nodes = rednodesfallback;}
}
rednodemoving = false;
}



//-------------------------------------------------------------------


function animateRay(posnodestart,posnodetarget,onComplete) {
  let [startX,startY] = posnodestart;
  let [targetX,targetY] = posnodetarget;
  const maxLength = 100; // max Strahllänge
  const rotationRadius = 70;
  const totalRotations = 10;
  const pointRadius = 12;
	
  let phase = 0;

  let growLength = 0;     // für das erstmalige Wachsen des Strahls an Startpunkt
  let moveY = startY;     // Y-Position Strahl beim Hochbewegen (Phase 1)
  let shrinkLength = maxLength; // für Zusammenschrumpfen (Phase 2)

  let rotationCenterX = 0;
  let rotationCenterY = 0;

  let angle = 0;
  let speed = 0.04;
  let completedRotations = 0;

  let impactGrowLength = 0;

  let particles = [];

  function createParticles(x, y) {
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: x,
        y: y,
        radius: Math.random() * 3 + 2,
        alpha: 1,
        dx: (Math.random() - 0.5) * 6,
        dy: (Math.random() - 0.5) * 6
      });
    }
  }

  function updateParticles() {
    for (let p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      p.alpha -= 0.02;
    }
    particles = particles.filter(p => p.alpha > 0);
  }

  function drawParticles(ctx) {
    for (let p of particles) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,0,0,${p.alpha})`;
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function animateStep() {
    effectCtx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
    effectCtx.save();
    effectCtx.shadowColor = 'red';
    effectCtx.shadowBlur = 20;

    if (phase === 0) {
			lasersoundcharge.play();
      // Strahl wächst an Startpunkt
      effectCtx.strokeStyle = 'rgba(255,0,0,1)';
      effectCtx.lineWidth = 3;
      effectCtx.beginPath();
      effectCtx.moveTo(startX, startY);
      effectCtx.lineTo(startX, startY - growLength);
      effectCtx.stroke();

      // Kopf des Strahls (roter Punkt)
      effectCtx.fillStyle = 'red';
      effectCtx.beginPath();
      effectCtx.arc(startX, startY - growLength, pointRadius, 0, 2 * Math.PI);
      effectCtx.fill();

      growLength += 1.5;
      if (growLength >= maxLength) {
        growLength = maxLength;
        phase = 1;
        moveY = startY;
      }
    }
    else if (phase === 1) {
      // Strahl fährt mit konstanter Länge nach oben (moveY verringert sich)
      effectCtx.strokeStyle = 'rgba(255,0,0,1)';
      effectCtx.lineWidth = 3;
      effectCtx.beginPath();
      effectCtx.moveTo(startX, moveY);
      effectCtx.lineTo(startX, moveY - maxLength);
      effectCtx.stroke();

      effectCtx.fillStyle = 'red';
      effectCtx.beginPath();
      effectCtx.arc(startX, moveY - maxLength, pointRadius, 0, 2 * Math.PI);
      effectCtx.fill();

      moveY -= 2;
      if (moveY <= startY - maxLength) {
        moveY = startY - maxLength;

        // Drehzentrum auf aktuelle Kopfposition setzen
        rotationCenterX = startX;
        rotationCenterY = moveY - maxLength + maxLength; 
        // moveY - maxLength ist Kopfposition, also moveY - maxLength
        // Aber hier: moveY == startY - maxLength, also Kopf ist (startX, moveY - maxLength)
        // moveY - maxLength = (startY - maxLength) - maxLength = startY - 2*maxLength --> falsch

        // Korrektur: Kopf ist immer moveY - maxLength (also y-Position am oberen Ende)
        rotationCenterY = moveY - maxLength;

        phase = 2;
        shrinkLength = maxLength;
      }
    }
    else if (phase === 2) {
      // Strahl fährt in Punkt zusammen (Schrumpfen der Länge)
      effectCtx.strokeStyle = 'rgba(255,0,0,1)';
      effectCtx.lineWidth = 3;
      effectCtx.beginPath();
      effectCtx.moveTo(rotationCenterX, rotationCenterY + shrinkLength);
      effectCtx.lineTo(rotationCenterX, rotationCenterY + shrinkLength - shrinkLength);
      effectCtx.stroke();

      effectCtx.fillStyle = 'red';
      effectCtx.beginPath();
      effectCtx.arc(rotationCenterX, rotationCenterY + shrinkLength - shrinkLength, pointRadius, 0, 2 * Math.PI);
      effectCtx.fill();

      shrinkLength -= 3;
      if (shrinkLength <= 0) {
        shrinkLength = 0;
        phase = 3;
        angle = Math.PI / 2;;
        speed = 0.04;
      }
    }
    else if (phase === 3) {
			
      // Rotierender Punkt um rotationCenterX, rotationCenterY
      const circleCenterY = rotationCenterY - rotationRadius; // jetzt liegt die tiefste Stelle genau bei rotationCenterY
      const circleCenterX = rotationCenterX;

      
      const x = circleCenterX + Math.cos(angle) * rotationRadius;
  const y = circleCenterY + Math.sin(angle) * rotationRadius;

      effectCtx.fillStyle = 'red';
      effectCtx.beginPath();
      effectCtx.arc(x, y, pointRadius, 0, 2 * Math.PI);
      effectCtx.fill();

      angle += speed;
      speed += 0.001;


      if (angle >= 2 * Math.PI) {
        completedRotations++;
        angle -= 2 * Math.PI;
      }

      if (completedRotations >= totalRotations) {
        phase = 4;
        impactGrowLength = 0;
				lasersound.play();
      }
    }
    else if (phase === 4) {
			
      // Einschlagstrahl wächst Richtung Zielkoordinaten
      const dx = targetX - rotationCenterX;
      const dy = targetY - rotationCenterY;
      const dist = Math.hypot(dx, dy);

      if (impactGrowLength < dist) {
        impactGrowLength += 3;
        const endX = rotationCenterX + (dx / dist) * impactGrowLength;
        const endY = rotationCenterY + (dy / dist) * impactGrowLength;

        effectCtx.strokeStyle = 'rgba(255,0,0,1)';
        effectCtx.lineWidth = 4;
        effectCtx.beginPath();
        effectCtx.moveTo(rotationCenterX, rotationCenterY);
        effectCtx.lineTo(endX, endY);
        effectCtx.stroke();

        effectCtx.fillStyle = 'red';
        effectCtx.beginPath();
        effectCtx.arc(endX, endY, pointRadius, 0, 2 * Math.PI);
        effectCtx.fill();
      } else {
        phase = 5;
      }
    }
    else if (phase === 5) {
      if (typeof onComplete === "function") {
          onComplete();
        }
      // Einschlagstrahl verschwindet, Partikel starten
      effectCtx.strokeStyle = 'rgba(255,0,0,1)';
      effectCtx.lineWidth = 4;
      effectCtx.beginPath();
      effectCtx.moveTo(rotationCenterX, rotationCenterY);
      effectCtx.lineTo(targetX, targetY);
      effectCtx.stroke();

      effectCtx.fillStyle = 'red';
      effectCtx.beginPath();
      effectCtx.arc(targetX, targetY, pointRadius, 0, 2 * Math.PI);
      effectCtx.fill();

      createParticles(targetX, targetY);
      phase = 6;
    }
    else if (phase === 6) {
      updateParticles();
      drawParticles(effectCtx);

      if (particles.length === 0) {
        effectCtx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
        cancelAnimationFrame(animationFrame);
        return;
      }
    }

    effectCtx.restore();
    animationFrame = requestAnimationFrame(animateStep);
  }

  animateStep();
}

function addrednode(){
rednodeadding =true;
addreduse+=1;
//search for new red node
function shuffleObjectKeys(obj) {
  // Hole alle Keys des Objekts
  const keys = Object.keys(obj);

  // Fisher-Yates Shuffle Algorithmus
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }

  return keys;
}

let shuffledkeys = shuffleObjectKeys(tikz_nodes);
let newrednode;
for (let i = 0; i < shuffledkeys.length; i++) {
	const name = shuffledkeys[i];
	if(!red_nodes.has(name)){
		newrednode=name;
		break;
	}
}

function onComplete(){
	let red_nodesold = red_nodes;
	red_nodes = new Set();
	red_nodesold.forEach((node)=>red_nodes.add(node))
	red_nodes.add(newrednode);
	rednodeadding=false;
}

let rednodecoordinates=[];
red_nodes.forEach((node)=>{
	rednodecoordinates.push(node_positions[node]);
});
animatePoints(rednodecoordinates,node_positions[newrednode],onComplete);


//----------------------
function animatePoints(points, destination,onComplete) {
	addingsound.play();
  const targetY = 60;
  const centerX = effectCanvas.width / 2-200;
  const centerY = targetY;
  const [destX, destY] = destination;

  let currentPhase = 'ascend';
  const animatedPoints = points.map(([x, y]) => ({
    x, y, startX: x, startY: y
  }));

  let pulsePoint = { x: centerX, y: centerY, startX: centerX, startY: centerY, targetX: destX, targetY: destY };

  let startFlashTime = null;
  const flashDuration = 6000;
  let fadeOutStart = null;
  let isAnimationDone = false;

  function addnodedraw() {
    if (isAnimationDone) return;
    effectCtx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);

    if (currentPhase === 'flash') {
      const pulseRadius = 14 + Math.sin(Date.now() / 100) * 4;

      effectCtx.save();
      effectCtx.shadowColor = 'red';
      effectCtx.shadowBlur = 30;
      effectCtx.fillStyle = 'red';
      effectCtx.beginPath();
      effectCtx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      effectCtx.fill();
      effectCtx.restore();

      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const length = 20 + Math.random() * 30;
        const x2 = centerX + Math.cos(angle) * length;
        const y2 = centerY + Math.sin(angle) * length;
        effectCtx.strokeStyle = 'red';
        effectCtx.lineWidth = 1 + Math.random();
        effectCtx.beginPath();
        effectCtx.moveTo(centerX, centerY);
        effectCtx.lineTo(x2, y2);
        effectCtx.stroke();
      }
    }

    else if (['return', 'fadeout'].includes(currentPhase)) {
      const alpha =
        currentPhase === 'fadeout'
          ? 1 - Math.min((Date.now() - fadeOutStart) / 1000, 1)
          : 1;

      effectCtx.globalAlpha = alpha;
      effectCtx.fillStyle = 'red';

      for (const point of animatedPoints) {
        effectCtx.beginPath();
        effectCtx.arc(point.x, point.y, 10, 0, Math.PI * 2);
        effectCtx.fill();
      }

      // Pulsierender Punkt mit glow
      const radius = 14 + Math.sin(Date.now() / 100) * 4;
      effectCtx.save();
      effectCtx.shadowColor = 'red';
      effectCtx.shadowBlur = 30;
      effectCtx.fillStyle = 'red';
      effectCtx.beginPath();
      effectCtx.arc(pulsePoint.x, pulsePoint.y, radius, 0, Math.PI * 2);
      effectCtx.fill();
      effectCtx.restore();

      effectCtx.globalAlpha = 1;
    }

    else {
      // Normaler Punkt-Zeichnen
      effectCtx.fillStyle = 'red';
      for (const point of animatedPoints) {
        effectCtx.beginPath();
        effectCtx.arc(point.x, point.y, 10, 0, Math.PI * 2);
        effectCtx.fill();
      }
    }
  }

  function update() {
    if (currentPhase === 'ascend') {
      let allReachedY = true;
      for (const point of animatedPoints) {
        if (point.y > targetY) {
          point.y -= 2;
          allReachedY = false;
        }
      }
      if (allReachedY) currentPhase = 'merge';
    }

    else if (currentPhase === 'merge') {
      for (const point of animatedPoints) {
        point.x += (centerX - point.x) * 0.05;
      }
      const allMerged = animatedPoints.every(p => Math.abs(p.x - centerX) < 1);
      if (allMerged) {
        currentPhase = 'flash';
        startFlashTime = Date.now();
      }
    }

    else if (currentPhase === 'flash') {
      if (Date.now() - startFlashTime >= flashDuration) {
        currentPhase = 'return';
      }
    }

    else if (currentPhase === 'return') {
      let allReturned = true;

      for (const point of animatedPoints) {
        point.x += (point.startX - point.x) * 0.05;
        point.y += (point.startY - point.y) * 0.05;

        if (Math.abs(point.x - point.startX) > 1 || Math.abs(point.y - point.startY) > 1) {
          allReturned = false;
        }
      }

      // Pulsierender Punkt bewegt sich zur Zielposition
      pulsePoint.x += (pulsePoint.targetX - pulsePoint.x) * 0.05;
      pulsePoint.y += (pulsePoint.targetY - pulsePoint.y) * 0.05;

      if (
        allReturned &&
        Math.abs(pulsePoint.x - pulsePoint.targetX) < 1 &&
        Math.abs(pulsePoint.y - pulsePoint.targetY) < 1
      ) {
        currentPhase = 'fadeout';
        fadeOutStart = Date.now();
      }
    }

    else if (currentPhase === 'fadeout') {
      const elapsed = Date.now() - fadeOutStart;
      if (elapsed >= 1000) {
        effectCtx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
        isAnimationDone = true;
				if (typeof onComplete === "function") {
          onComplete();
        }
      }
    }
  }

  function animate() {
    update();
    addnodedraw();
    if (!isAnimationDone) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}


}

//--------------------------------------------------------------------


// Start
resetGame();
updateStatus();
draw();
