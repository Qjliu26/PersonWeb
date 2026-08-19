/**
 * views/skills.js — 技能
 * 第一屏：顶部类别标签（默认第一个选中）+ 居中雷达图
 * 第二屏（下翻）：评分依据
 */
import { esc, t } from '../I18n.js';

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
        <div class="skill-tabs">
          ${cats.map((cat, i) => `
            <button type="button" class="skill-tab${i === 0 ? ' active' : ''}" data-cat-index="${i}">
              ${esc(cat.icon)} ${esc(cat.name)}
            </button>`).join('')}
        </div>

        <div class="card radar-panel">
          <h2 class="radar-title" data-radar-title>${esc(first.name)}</h2>
          <div class="radar-wrap" data-radar-wrap>${radarSVG(first.items || [])}</div>
          <div class="radar-legend" data-radar-legend>
            ${(first.items || []).map((x) => `<span class="chip legend-chip">${esc(x.name)} · ${x.level}</span>`).join('')}
          </div>
        </div>
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
    const cats = t('skills.categories');
    const tabs = document.querySelectorAll('#view .skill-tab');
    const wrap = document.querySelector('#view [data-radar-wrap]');
    const title = document.querySelector('#view [data-radar-title]');
    const legend = document.querySelector('#view [data-radar-legend]');
    if (!tabs.length || !wrap) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((b) => b.classList.remove('active'));
        tab.classList.add('active');
        const cat = cats[Number(tab.dataset.catIndex)];
        if (!cat) return;
        if (title) title.textContent = cat.name;
        wrap.innerHTML = radarSVG(cat.items || []);
        if (legend) {
          legend.innerHTML = (cat.items || [])
            .map((x) => `<span class="chip legend-chip">${esc(x.name)} · ${x.level}</span>`)
            .join('');
        }
      });
    });
  }
};
