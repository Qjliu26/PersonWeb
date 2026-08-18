/**
 * views/skills.js — 技能：分类卡片 + 熟练度条 + 评分依据说明
 */
import { esc } from '../i18n.js';

export default {
  render(t) {
    return `
      <section class="page-head">
        <h1 class="page-title">${esc(t('skills.title'))}</h1>
        <p class="page-subtitle">${esc(t('skills.subtitle'))}</p>
      </section>

      ${t('skills.categories').map((cat) => {
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
          <section class="section">
            <div class="card skill-category">
              <h2 class="skill-cat-title"><span>${esc(cat.icon)}</span>${esc(cat.name)}</h2>
              <div class="skill-grid">${items}</div>
            </div>
          </section>`;
      }).join('')}

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
  mount() { /* 无动态事件 */ }
};
