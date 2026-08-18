/**
 * views/projects.js — 项目：卡片网格
 * 点击整张卡片展开详情：我的角色 → 量化成果 → 总体架构（HR 视角）
 */
import { esc } from '../i18n.js';

export default {
  render(t) {
    const linkLabel = t('projects.linkLabel');
    const detailLabel = t('projects.detailLabel');
    const archLabel = t('projects.archLabel');
    const resultLabel = t('projects.resultLabel');
    const roleLabel = t('projects.roleLabel');
    return `
      <section class="page-head">
        <h1 class="page-title">${esc(t('projects.title'))}</h1>
        <p class="page-subtitle">${esc(t('projects.subtitle'))}</p>
      </section>

      <section class="section">
        <div class="grid grid-3">
          ${t('projects.list').map((p) => {
            const link = p.link
              ? `<a class="project-link" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(linkLabel)} →</a>`
              : '';
            return `
              <article class="card project-card expandable" tabindex="0">
                <div class="expand-head">
                  <h3>${esc(p.name)}</h3>
                  <span class="expand-hint">${esc(detailLabel)} <span class="expand-arrow">▾</span></span>
                </div>
                <p>${esc(p.desc)}</p>
                <div class="tags">${(p.tech || []).map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div>
                ${link}
                <div class="expand-body">
                  <div class="expand-inner">
                    <h4>${esc(roleLabel)}</h4>
                    <p class="detail-result">${esc(p.role || '')}</p>
                    <h4>${esc(resultLabel)}</h4>
                    <p class="detail-result">${esc(p.result || '')}</p>
                    <h4>${esc(archLabel)}</h4>
                    <pre class="arch-box">${esc(p.arch || '')}</pre>
                  </div>
                </div>
              </article>`;
          }).join('')}
        </div>
      </section>`;
  },

  mount() {
    document.querySelectorAll('#view .project-card.expandable').forEach((card) => {
      const head = card.querySelector('.expand-head');
      const arrow = card.querySelector('.expand-arrow');
      const toggle = () => {
        const open = card.classList.toggle('open');
        if (arrow) arrow.textContent = open ? '▴' : '▾';
        card.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      if (head) head.addEventListener('click', toggle);
      card.addEventListener('click', (e) => {
        // 整卡点击展开；链接保持原行为
        if (e.target.closest('a')) return;
        if (e.target.closest('.expand-head')) return; // head 已绑定
        toggle();
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  }
};
