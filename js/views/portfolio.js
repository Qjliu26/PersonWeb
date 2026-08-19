/**
 * views/portfolio.js — 作品：点击整张卡片展开「效果 + 架构图」
 */
import { esc } from '../i18n.js';

export default {
  render(t) {
    const resultLabel = t('projects.resultLabel');
    const archLabel = t('projects.archLabel');
    return `
      <section class="page-head">
        <h1 class="page-title">${esc(t('portfolio.title'))}</h1>
        <p class="page-subtitle">${esc(t('portfolio.subtitle'))}</p>
      </section>

      <section class="section">
        <div class="grid grid-3">
          ${t('portfolio.list').map((item) => {
            const cover = item.image
              ? `<img src="${esc(item.image)}" alt="${esc(item.title)}">`
              : `<span>${esc(item.type)}</span>`;
            return `
              <article class="card portfolio-card expandable" tabindex="0">
                <div class="portfolio-cover" aria-hidden="true">${cover}</div>
                <div class="expand-head">
                  <h3>${esc(item.title)}</h3>
                  <span class="expand-hint"><span class="expand-arrow">▾</span></span>
                </div>
                <p>${esc(item.desc)}</p>
                <span class="portfolio-type">${esc(item.type)}</span>
                <div class="expand-body">
                  <div class="expand-inner">
                    <h4>${esc(resultLabel)}</h4>
                    <p class="detail-result">${esc(item.result || '')}</p>
                    <h4>${esc(archLabel)}</h4>
                    <pre class="arch-box">${esc(item.arch || '')}</pre>
                  </div>
                </div>
              </article>`;
          }).join('')}
        </div>
      </section>`;
  },

  mount() {
    document.querySelectorAll('#view .portfolio-card.expandable').forEach((card) => {
      const arrow = card.querySelector('.expand-arrow');
      const toggle = () => {
        const open = card.classList.toggle('open');
        if (arrow) arrow.textContent = open ? '▴' : '▾';
        card.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  }
};
