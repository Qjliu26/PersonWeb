/**
 * background.js — 交互式粒子背景（ES Module，性能优化版）
 * 性能要点：
 * - 空间哈希网格分桶：连线与斥力只检查相邻桶，O(n·k) 替代 O(n²)
 * - 颜色预生成分档，避免每帧字符串拼接
 * - 粒子数按面积自适应且封顶；帧率过低自动降级
 * - 泊松盘采样初始化 + 粒子间弱斥力，聚集后快速恢复均匀
 */
export function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0, dpr = 1;
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  let particles = [];

  const LINK_DIST = 95;    // 连线最大距离
  const RADIUS = 170;      // 吸引半径
  const HALO = 42;         // 光标光环半径
  const PULL = 0.75;       // 吸引强度
  const PUSH = 0.3;        // 光环内轻微外推
  const REPEL = 30;        // 粒子间斥力距离
  const REPEL_FORCE = 0.02;
  const MIN_SPACING = 15;  // 泊松盘最小间距
  const CELL = 90;         // 空间网格边长

  const DOT = 'rgba(130, 190, 255, 0.42)';
  // 连线颜色按距离预分 5 档，避免每帧拼字符串
  const LINK_LEVELS = [0.018, 0.036, 0.054, 0.072, 0.085]
    .map((a) => 'rgba(130, 190, 255, ' + a.toFixed(3) + ')');

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 空间哈希桶
  const cells = new Map();
  let idCounter = 0;

  function cellKey(x, y) {
    return Math.floor(x / CELL) + ',' + Math.floor(y / CELL);
  }

  function buildGrid() {
    cells.clear();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const key = cellKey(p.x, p.y);
      let arr = cells.get(key);
      if (!arr) { arr = []; cells.set(key, arr); }
      arr.push(p);
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function targetCount() {
    const count = Math.round((w * h) / 11000);
    return Math.max(50, Math.min(240, count));
  }

  /** 泊松盘采样初始化 */
  function spawn(n) {
    for (let i = 0; i < n; i++) {
      let x = 0, y = 0, ok = false;
      for (let attempt = 0; attempt < 22 && !ok; attempt++) {
        x = Math.random() * w;
        y = Math.random() * h;
        ok = true;
        for (let j = 0; j < particles.length; j++) {
          const dx = particles[j].x - x;
          const dy = particles[j].y - y;
          if (dx * dx + dy * dy < MIN_SPACING * MIN_SPACING) { ok = false; break; }
        }
      }
      particles.push({
        id: idCounter++,
        x, y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 0.7 + Math.random() * 1.1
      });
    }
  }

  function physics(p) {
    if (!reduced) {
      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < RADIUS && dist > 0.01) {
        const nx = dx / dist, ny = dy / dist;
        const force = dist > HALO
          ? (1 - dist / RADIUS) * PULL
          : (dist / HALO - 1) * PUSH;
        p.vx += nx * force;
        p.vy += ny * force;
      }
    }

    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    const max = 6;
    if (speed > max) { p.vx = (p.vx / speed) * max; p.vy = (p.vy / speed) * max; }

    p.vx *= 0.985;
    p.vy *= 0.985;
    p.vx += (Math.random() - 0.5) * 0.05;
    p.vy += (Math.random() - 0.5) * 0.05;

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
    if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;
  }

  function draw(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = DOT;
    ctx.fill();
  }

  /** 连线 + 斥力：只检查相邻桶，且每对只处理一次（q.id > p.id） */
  function linksAndRepel(p) {
    const cx = Math.floor(p.x / CELL);
    const cy = Math.floor(p.y / CELL);
    ctx.lineWidth = 0.6;
    for (let gx = cx - 1; gx <= cx + 1; gx++) {
      for (let gy = cy - 1; gy <= cy + 1; gy++) {
        const arr = cells.get(gx + ',' + gy);
        if (!arr) continue;
        for (let k = 0; k < arr.length; k++) {
          const q = arr[k];
          if (q.id <= p.id) continue; // 去重
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const d = Math.sqrt(d2);
            const lv = Math.min(4, Math.floor(d / (LINK_DIST / 5)));
            ctx.strokeStyle = LINK_LEVELS[lv];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
          if (d2 < REPEL * REPEL && d2 > 0.0001) {
            const d = Math.sqrt(d2);
            const f = (1 - d / REPEL) * REPEL_FORCE;
            const fx = (dx / d) * f, fy = (dy / d) * f;
            p.vx += fx; p.vy += fy;
            q.vx -= fx; q.vy -= fy;
          }
        }
      }
    }
  }

  // 帧率自适应
  const frameTimes = [];

  function frame() {
    requestAnimationFrame(frame);
    const t0 = performance.now();

    pointer.x += (pointer.tx - pointer.x) * 0.14;
    pointer.y += (pointer.ty - pointer.y) * 0.14;

    ctx.clearRect(0, 0, w, h);
    buildGrid();
    for (let i = 0; i < particles.length; i++) {
      linksAndRepel(particles[i]);
    }
    for (let i = 0; i < particles.length; i++) {
      physics(particles[i]);
      draw(particles[i]);
    }

    frameTimes.push(performance.now() - t0);
    if (frameTimes.length > 90) frameTimes.shift();
    if (frameTimes.length === 90) {
      const avg = frameTimes.reduce((a, b) => a + b, 0) / 90;
      frameTimes.length = 0;
      if (avg > 20 && particles.length > 60) {
        particles = particles.slice(0, Math.floor(particles.length * 0.6));
      } else if (avg < 9 && particles.length < targetCount()) {
        spawn(Math.min(20, targetCount() - particles.length));
      }
    }
  }

  function adjustCount() {
    const want = targetCount();
    while (particles.length > want) particles.pop();
    while (particles.length < want) spawn(want - particles.length);
  }

  window.addEventListener('pointermove', (e) => {
    pointer.tx = e.clientX;
    pointer.ty = e.clientY;
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      pointer.tx = e.touches[0].clientX;
      pointer.ty = e.touches[0].clientY;
    }
  }, { passive: true });
  document.addEventListener('mouseleave', () => {
    pointer.x = pointer.tx = -9999;
    pointer.y = pointer.ty = -9999;
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      adjustCount();
    }, 200);
  });

  resize();
  spawn(targetCount());

  if (reduced) {
    buildGrid();
    particles.forEach((p) => { linksAndRepel(p); draw(p); });
  } else {
    frame();
  }
}
