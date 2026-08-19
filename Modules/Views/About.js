/**
 * Modules/Views/About.js — 关于我
 * 上方左右结构：左（个人介绍 → 荣誉与奖项 → 兴趣） | 右（时间轴/我的经历）
 * 下方：个人特质（横跨整个页面宽度，一行 4 个等高卡片）
 */
import { esc } from '../I18n.js';

export default {
  render(t) {
    return `
      <section class="page-head">
        <h1 class="page-title">${esc(t('about.title'))}</h1>
        <p class="page-subtitle">${esc(t('about.subtitle'))}</p>
      </section>

      <div class="about-top">
        <div class="about-left">
          <section class="card about-card">
            <p>${esc(t('about.p1'))}</p>
            <p>${esc(t('about.p2'))}</p>
          </section>

          <section class="section">
            <div class="section-head">
              <h2 class="section-title">${esc(t('about.honorsTitle'))}</h2>
              <p class="section-subtitle">${esc(t('about.honorsSubtitle'))}</p>
            </div>
            <div class="grid grid-2">
              ${t('about.honors').map((h) => {
                const thumb = h.image
                  ? `<a class="honor-thumb" href="${esc(h.image)}" target="_blank" rel="noopener" title="${esc(h.title)}"><img src="${esc(h.image)}" alt="${esc(h.title)}" loading="lazy"></a>`
                  : `<div class="honor-thumb"><span class="honor-emoji">🏅</span></div>`;
                return `
                  <div class="card honor-card">
                    ${thumb}
                    <h3>${esc(h.title)}</h3>
                    <div class="honor-meta">
                      <span class="honor-level">${esc(h.level)}</span>
                      <span>${esc(h.time)}</span>
                    </div>
                  </div>`;
              }).join('')}
            </div>
          </section>

          <section class="section">
            <div class="section-head">
              <h2 class="section-title">${esc(t('about.interestsTitle'))}</h2>
            </div>
            <div class="chips">
              ${t('about.interests').map((s) => `<span class="chip">${esc(s)}</span>`).join('')}
            </div>
          </section>
        </div>

        <div class="about-right">
          <section class="section">
            <div class="section-head">
              <h2 class="section-title">${esc(t('about.timelineTitle'))}</h2>
            </div>
            <div class="timeline">
              ${t('about.timeline').map((item) => `
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <span class="timeline-time">${esc(item.time)}</span>
                    <h3>${esc(item.title)}</h3>
                    <p>${esc(item.desc)}</p>
                  </div>
                </div>`).join('')}
            </div>
          </section>
        </div>
      </div>

      <section class="section about-traits">
        <div class="section-head">
          <h2 class="section-title">${esc(t('about.traitsTitle'))}</h2>
        </div>
        <div class="grid grid-4 traits-grid">
          ${t('about.traits').map((tr) => `
            <div class="card trait-card">
              <div class="trait-icon">${esc(tr.icon)}</div>
              <h3>${esc(tr.label)}</h3>
              <p>${esc(tr.text)}</p>
            </div>`).join('')}
        </div>
      </section>`;
  },
  mount() { /* 无动态事件 */ }
};
