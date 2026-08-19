/**
 * views/projects.js — 项目：真分页（每页 5 个）+ 默认展开详情，卡片内容统一
 */
import { esc, t } from '../I18n.js';

const PAGE_SIZE = 5;
let currentPage = 0;

function cardHTML(p, t) {
  const roleLabel = t('projects.roleLabel');
  const resultLabel = t('projects.resultLabel');
  return `
    <article class="card pcard">
      <h3 class="pcard-title">${esc(p.name)}</h3>
      <div class="tags">${(p.tech || []).map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div>
      <p class="pcard-desc">${esc(p.desc)}</p>
      <div class="pcard-field">
        <span class="pcard-label">${esc(roleLabel)}</span>
        <p>${esc(p.role || '')}</p>
      </div>
      <div class="pcard-field">
        <span class="pcard-label">${esc(resultLabel)}</span>
        <p>${esc(p.result || '')}</p>
      </div>
      <pre class="arch-box">${esc(p.arch || '')}</pre>
    </article>`;
}

function pagerHTML(total, t) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (pages <= 1) return '';
  const prev = currentPage > 0 ? '' : ' disabled';
  const next = currentPage < pages - 1 ? '' : ' disabled';
  return `
    <button type="button" class="page-btn" data-page-prev${prev}>‹</button>
    <span class="page-info">${currentPage + 1} / ${pages}</span>
    <button type="button" class="page-btn" data-page-next${next}>›</button>`;
}

export default {
  render(t) {
    currentPage = 0;
    const all = t('projects.list');
    const page = all.slice(0, PAGE_SIZE);
    return `
      <section class="page-head">
        <h1 class="page-title">${esc(t('projects.title'))}</h1>
        <p class="page-subtitle">${esc(t('projects.subtitle'))}</p>
      </section>

      <section class="section">
        <div class="grid grid-5" data-project-grid>
          ${page.map((p) => cardHTML(p, t)).join('')}
        </div>
        <div class="pagination" data-pagination>${pagerHTML(all.length, t)}</div>
      </section>`;
  },

  mount() {
    const grid = document.querySelector('#view [data-project-grid]');
    const pager = document.querySelector('#view [data-pagination]');
    if (!grid || !pager) return;

    const renderPage = () => {
      const all = t('projects.list');
      const start = currentPage * PAGE_SIZE;
      grid.innerHTML = all.slice(start, start + PAGE_SIZE).map((p) => cardHTML(p, t)).join('');
      pager.innerHTML = pagerHTML(all.length, t);
    };

    pager.addEventListener('click', (e) => {
      const all = t('projects.list');
      const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
      if (e.target.closest('[data-page-prev]') && currentPage > 0) {
        currentPage--;
        renderPage();
      } else if (e.target.closest('[data-page-next]') && currentPage < pages - 1) {
        currentPage++;
        renderPage();
      }
    });
  }
};
