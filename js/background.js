/**
 * background.js — 交互式粒子背景（ES Module）
 * 特性：
 * - 粒子数量按屏幕面积自适应；初始化用泊松盘采样，分布均匀
 * - 粒子间弱斥力：鼠标聚集后松开可快速恢复均匀分布
 * - 低亮度低密度，确保文字内容始终清晰可读
 * - 指针/触摸均可驱动；光标位置逐帧平滑插值
 * - 帧率自适应降级；prefers-reduced-motion 仅绘制静态一帧
 * - Canvas 常驻页面，SPA 切换视图时不会重建
 */

export function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0, dpr = 1;
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 }; // 平滑跟随
  let particles = [];

  const LINK_DIST = 100;   // 连线最大距离
  const RADIUS = 220;      // 吸引半径
  const HALO = 26;         // 光标光环半径
  const PULL = 0.7;        // 吸引强度
  const PUSH = 0.35;       // 光环内轻微外推
  const REPEL = 30;        // 粒子间斥力距离（保持均匀、聚集后可恢复）
  const REPEL_FORCE = 0.02;
  const MIN_SPACING = 15;  // 初始化最小间距（泊松盘采样）
  const DOT = 'rgba(130, 190, 255, 0.42)';   // 低亮度，不干扰阅读
  const LINK = 'rgba(130, 190, 255, ';

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    // 关键：显式声明 CSS 尺寸 = 视口尺寸，位图 = 视口 × dpr，
    // 避免拉伸显示导致与鼠标坐标（clientX/Y）的系统性偏移。
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** 按面积自适应粒子数：约每 10000 px² 一个粒子（密度略降，保证可读性） */
  function targetCount() {
    const count = Math.round((w * h) / 10000);
    return Math.max(60, Math.min(300, count));
  }

  /** 泊松盘采样：新粒子与已有粒子保持最小间距，分布均匀 */
  function spawn(n) {
    for (let i = 0; i < n; i++) {
      let x = 0, y = 0, ok = false;
      for (let attempt = 0; attempt < 24 && !ok; attempt++) {
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

    // 阻尼 + 随机漫步（鼠标离开后随机漫步帮助扩散）
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

  /** 连线 + 粒子间斥力（同一轮 O(n²) 循环，斥力让分布保持均匀） */
  function drawLinksAndRepel() {
    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;

        if (d2 < LINK_DIST * LINK_DIST) {
          const d = Math.sqrt(d2);
          const alpha = (1 - d / LINK_DIST) * 0.08;
          ctx.strokeStyle = LINK + alpha.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        if (d2 < REPEL * REPEL && d2 > 0.0001) {
          const d = Math.sqrt(d2);
          const f = (1 - d / REPEL) * REPEL_FORCE;
          const fx = (dx / d) * f, fy = (dy / d) * f;
          a.vx += fx; a.vy += fy;
          b.vx -= fx; b.vy -= fy;
        }
      }
    }
  }

  // 帧率自适应：最近 90 帧平均耗时
  const frameTimes = [];
  let rafId = null;

  function frame() {
    rafId = requestAnimationFrame(frame);
    const t0 = performance.now();

    pointer.x += (pointer.tx - pointer.x) * 0.14;
    pointer.y += (pointer.ty - pointer.y) * 0.14;

    ctx.clearRect(0, 0, w, h);
    drawLinksAndRepel();
    for (let i = 0; i < particles.length; i++) {
      physics(particles[i]);
      draw(particles[i]);
    }

    frameTimes.push(performance.now() - t0);
    if (frameTimes.length > 90) frameTimes.shift();
    if (frameTimes.length === 90) {
      const avg = frameTimes.reduce((a, b) => a + b, 0) / 90;
      frameTimes.length = 0;
      if (avg > 22 && particles.length > 70) {
        particles = particles.slice(0, Math.floor(particles.length * 0.6));
      } else if (avg < 10 && particles.length < targetCount()) {
        spawn(Math.min(24, targetCount() - particles.length));
      }
    }
  }

  function adjustCount() {
    const want = targetCount();
    while (particles.length > want) particles.pop();
    while (particles.length < want) spawn(want - particles.length);
  }

  /* ---- 事件 ---- */
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

  /* ---- 启动 ---- */
  resize();
  spawn(targetCount());

  if (reduced) {
    drawLinksAndRepel();
    particles.forEach(draw);
  } else {
    frame();
  }
}
