function Point(x, y) {
  this.x = x;
  this.y = y;
}

// export const edgesToPath = (edges) => {
//   return edges.map(([a, b]) =>
//     `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} `
//   ).join(' ') + 'z';
// }

export const edgesToPath = (edges) => {
  const loop = edgesToLoop(edges);
  
  if (!loop.length) return '';
  
  let d = `M ${loop[0][0]} ${loop[0][1]}`;
  
  for (let i = 1; i < loop.length; i++) {
    d += ` L ${loop[i][0]} ${loop[i][1]}`;
  }
  
  return d + ' Z';
};

export const edgeToPolygon = (edges) => {
  return edges.map(([a, b]) =>
    `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} `
  ).join(' ') + 'z';
}

function edgesToLoop(edges) {
  const map = new Map();
  
  for (const [a, b] of edges) {
    const key = `${a[0]}_${a[1]}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(b);
  }
  
  const start = edges[0][0];
  const loop = [start];
  
  let current = start;
  
  while (true) {
    const key = `${current[0]}_${current[1]}`;
    const nextList = map.get(key);
    
    if (!nextList || nextList.length === 0) break;
    
    const next = nextList.pop();
    current = next;
    loop.push(current);
    
    if (current[0] === start[0] && current[1] === start[1]) break;
  }
  
  return loop;
}




export const outlineFromPoints = (points) => {
  const set = new Set(points.map(p => `${p.x}_${p.y}`));
  const edges = [];
  
  for (const { x, y } of points) {
    const key = (x, y) => `${x}_${y}`;
    
    // top
    if (!set.has(key(x, y - 1))) {
      edges.push([
        [x, y],
        [x + 1, y]
      ]);
    }
    
    // right
    if (!set.has(key(x + 1, y))) {
      edges.push([
        [x + 1, y],
        [x + 1, y + 1]
      ]);
    }
    
    // bottom
    if (!set.has(key(x, y + 1))) {
      edges.push([
        [x + 1, y + 1],
        [x, y + 1]
      ]);
    }
    
    // left
    if (!set.has(key(x - 1, y))) {
      edges.push([
        [x, y + 1],
        [x, y]
      ]);
    }
  }
  
  return edges;
}

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

function lerpPoint(p0, p1, t) {
  return {
    x: lerp(p0.x, p1.x, t),
    y: lerp(p0.y, p1.y, t),
  };
}

function diagonalDistance(p0, p1) {
  return Math.max(
    Math.abs(p1.x - p0.x),
    Math.abs(p1.y - p0.y)
  );
}

function roundPoint(p) {
  return {
    x: Math.round(p.x),
    y: Math.round(p.y),
  };
}

export function linePoints(p0, p1) {
  const points = [];
  const N = diagonalDistance(p0, p1);
  
  for (let step = 0; step <= N; step++) {
    const t = N === 0 ? 0 : step / N;
    points.push(roundPoint(lerpPoint(p0, p1, t)));
  }
  
  // dedupe (important)
  const seen = new Set();
  return points.filter(p => {
    const key = `${p.x}_${p.y}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function supercover_line(p0, p1) {
  let dx = p1.x - p0.x,
    dy = p1.y - p0.y;
  let nx = Math.abs(dx),
    ny = Math.abs(dy);
  let sign_x = dx > 0 ? 1 : -1,
    sign_y = dy > 0 ? 1 : -1;
  
  let p = new Point(p0.x, p0.y);
  let points = [new Point(p.x, p.y)];
  for (let ix = 0, iy = 0; ix < nx || iy < ny;) {
    let decision = (1 + 2 * ix) * ny - (1 + 2 * iy) * nx;
    if (decision === 0) {
      // next step is diagonal
      p.x += sign_x;
      p.y += sign_y;
      ix++;
      iy++;
    } else if (decision < 0) {
      // next step is horizontal
      p.x += sign_x;
      ix++;
    } else {
      // next step is vertical
      p.y += sign_y;
      iy++;
    }
    points.push(new Point(p.x, p.y));
  }
  return points;
}