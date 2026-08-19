/**
 * views/skills.js — 技能
 * 第一屏：左侧类别选择（默认第一个展开） + 右侧该类别技能雷达图
 * 第二屏（下翻）：全部技能明细条 + 评分依据
 */
import { esc } from '../i18n.js';

/** 根据一组技能生成雷达图 SVG（轴数随技能数量 4~8 自适应） */
function radarSVG(items) {
  const n = items.length;
  const cx = 210, cy = 205, R = 132;
  const ang = (i) => -Math.PI / 2 + (2 * Math.PI * i) / n;
  const pt = (i, r) => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];

  let grid = '', axes = '', labels = '';
  const data = [];

  [0.25, 0.5, 0.75, 1].forEach((lv) => {
    const pts = [];
    for (let i = 0; i < n; i++) pts.push(pt(i, R * lv).map((v) => v.toFixed(1)).join(','));
    grid += `<polygon points="${pts.join(' ')}" class="radar-grid"/>`;
  });

  items.forEach((it, i) => {
    const p = pt(i, R);
    axes += `<line x1="${cx}" y1="${cy}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" class="radar-axis"/>`;
    data.push(pt(i, R * ((it.level || 0) / 100)).map((v) => v.toFixed(1)).join(','));
    const lp = pt(i, R + 32);
    labels += `<text x="${lp[0].toFixed(1)}" y="${lp[1].toFixed(1)}" class="radar-label">${esc(it.name)} · ${it.level}</text>`;
  });

  return `<svg viewBox="0 0 420 410" role="img" aria-label="radar chart">`
    + grid + axes
    + `<polygon points="${data.join(' ')}" class="radar-area"/>`
    + `<polygon points="${data.join(' ')}" class="radar-line"/>`
    + labels
    + `</svg>`;
}

function avg(cat) {
  const items = cat.items || [];
  if (!items.length) return 0;
  return Math.round(items.reduce((s, x) => s + (x.level || 0), 0) / items.length);
}

export default {
  render(t) {
    const cats = t('skills.categories');
    const first = cats[0] || { name: '', items: [] };
    return `
      <section class="page-head">
        <h1 class="page-title">${esc(t('skills.title'))}</h1>
        <p class="page-subtitle">${esc(t('skills.subtitle'))}</p>
      </section>

      <section class="skills-hero">
        <div class="skill-nav">
          ${cats.map((cat, i) => `
            <button type="button" class="skill-nav-item${i === 0 ? ' active' : ''}" data-cat-index="${i}">
              <span class="cat-icon">${esc(cat.icon)}</span>
              <span class="cat-name">${esc(cat.name)}</span>
              <span class="cat-avg">${avg(cat)}</span>
            </button>`).join('')}
        </div>

        <div class="card radar-panel">
          <h2 class="radar-title" data-radar-title>${esc(first.name)}</h2>
          <div class="radar-wrap" data-radar-wrap>${radarSVG(first.items)}</div>
          <div class="radar-legend" data-radar-legend>
            ${first.items.map((x) => `<span class="chip legend-chip">${esc(x.name)} · ${x.level}</span>`).join('')}
          </div>
        </div>
      </section>

      <section class="section skills-detail">
        ${cats.map((cat) => {
          const items = (cat.items || []).map((sk) => {
            const level = sk.level || 0;
            return `
              <div class="skill-item">
                <span class="skill-name">${esc(sk.name)}</span>
                <div class="skill-bar"><div class="skill-fill" style="width:${level}%"></div></div>
                <span class="skill-level">${level}</span>
              </div>`;
          }).join('');
          return `
            <div class="card skill-category">
              <h2 class="skill-cat-title"><span>${esc(cat.icon)}</span>${esc(cat.name)}</h2>
              <div class="skill-grid">${items}</div>
            </div>`;
        }).join('')}
      </section>

      <section class="section">
        <div class="card skills-note">
          <h2 class="skill-cat-title">📊 ${esc(t('skills.note.title'))}</h2>
          <p class="skills-note-text">${esc(t('skills.note.text'))}</p>
          <div class="skills-note-rules">
            ${t('skills.note.rules').map((r) => `
              <div class="rule-item">
                <span class="rule-level">${esc(r.level)}</span>
                <span>${esc(r.desc)}</span>
              </div>`).join('')}
          </div>
        </div>
      </section>`;
  },

  mount() {
    const i18n = window.i18n;
    const cats = i18n.t('skills.categories');
    const nav = document.querySelector('#view .skill-nav');
    const wrap = document.querySelector('#view [data-radar-wrap]');
    const title = document.querySelector('#view [data-radar-title]');
    const legend = document.querySelector('#view [data-radar-legend]');
    if (!nav || !wrap) return;

    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('.skill-nav-item');
      if (!btn) return;
      nav.querySelectorAll('.skill-nav-item').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = cats[Number(btn.dataset.catIndex)];
      if (!cat) return;
      if (title) title.textContent = cat.name;
      wrap.innerHTML = radarSVG(cat.items || []);
      if (legend) {
        legend.innerHTML = (cat.items || [])
          .map((x) => `<span class="chip legend-chip">${i18n.esc(x.name)} · ${x.level}</span>`)
          .join('');
      }
    });
  }
};
