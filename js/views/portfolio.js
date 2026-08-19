/**
 * views/portfolio.js — 作品：一行 5 个，默认展开详情，卡片内容统一
 */
import { esc } from '../i18n.js';

export default {
  render(t) {
    const resultLabel = t('projects.resultLabel');
    return `
      <section class="page-head">
        <h1 class="page-title">${esc(t('portfolio.title'))}</h1>
        <p class="page-subtitle">${esc(t('portfolio.subtitle'))}</p>
      </section>

      <section class="section">
        <div class="grid grid-5">
          ${t('portfolio.list').map((item) => {
            const cover = item.image
              ? `<img src="${esc(item.image)}" alt="${esc(item.title)}">`
              : `<span>${esc(item.type)}</span>`;
            return `
              <article class="card pcard">
                <div class="portfolio-cover" aria-hidden="true">${cover}</div>
                <h3 class="pcard-title">${esc(item.title)}</h3>
                <p class="pcard-desc">${esc(item.desc)}</p>
                <span class="portfolio-type">${esc(item.type)}</span>
                <div class="pcard-field">
                  <span class="pcard-label">${esc(resultLabel)}</span>
                  <p>${esc(item.result || '')}</p>
                </div>
                <pre class="arch-box">${esc(item.arch || '')}</pre>
              </article>`;
          }).join('')}
        </div>
      </section>`;
  },
  mount() { /* 无动态事件 */ }
};
