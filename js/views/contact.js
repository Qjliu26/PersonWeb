/**
 * views/contact.js — 联系：渠道卡片 + 复制按钮
 */
import { esc, t } from '../i18n.js';

export default {
  render(i18nT) {
    return `
      <section class="page-head">
        <h1 class="page-title">${esc(i18nT('contact.title'))}</h1>
        <p class="page-subtitle">${esc(i18nT('contact.subtitle'))}</p>
      </section>

      <section class="section">
        <div class="grid grid-2 contact-grid">
          ${i18nT('contact.items').map((item) => {
            const action = item.link
              ? `<a class="btn btn-ghost btn-sm" href="${esc(item.link)}" target="_blank" rel="noopener">${esc(i18nT('contact.open'))}</a>`
              : `<button type="button" class="btn btn-ghost btn-sm" data-copy="${esc(item.value)}">${esc(i18nT('contact.copy'))}</button>`;
            return `
              <div class="card contact-card">
                <div class="contact-icon">${esc(item.icon)}</div>
                <div class="contact-info">
                  <h3>${esc(item.label)}</h3>
                  <p class="contact-value">${esc(item.value)}</p>
                </div>
                <div class="contact-action">${action}</div>
              </div>`;
          }).join('')}
        </div>
      </section>`;
  },

  mount() {
    const list = document.querySelector('#view .contact-grid');
    if (!list) return;

    const fallbackCopy = (value, done) => {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) { /* ignore */ }
      document.body.removeChild(ta);
      done();
    };

    list.addEventListener('click', (e) => {
      const btn = e.target.closest ? e.target.closest('[data-copy]') : null;
      if (!btn) return;
      const value = btn.getAttribute('data-copy');
      const done = () => {
        btn.textContent = t('contact.copied');
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = t('contact.copy');
          btn.classList.remove('copied');
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(() => fallbackCopy(value, done));
      } else {
        fallbackCopy(value, done);
      }
    });
  }
};
