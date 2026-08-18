/**
 * views/home.js — 首页：左个人信息 | 右当前状态，下方精选项目一行，一屏展示
 */
import { esc } from '../i18n.js';

export default {
  render(t) {
    const featured = t('projects.list').filter((p) => p.featured);
    return `
      <section class="hero-split">
        <div class="hero-left">
          <div class="hero-identity">
            <img class="hero-avatar" src="assets/images/avatar.jpg" alt="${esc(t('hero.avatarAlt'))}">
            <div>
              <p class="hero-greeting">${esc(t('hero.greeting'))}</p>
              <h1 class="hero-name">${esc(t('hero.name'))}</h1>
              <p class="hero-tagline">${esc(t('hero.tagline'))}</p>
            </div>
          </div>
          <p class="hero-intro">${esc(t('hero.intro'))}</p>
          <p class="hero-status"><span class="status-dot"></span>${esc(t('hero.status'))}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/projects">${esc(t('hero.ctaProjects'))}</a>
            <a class="btn btn-ghost" href="#/contact">${esc(t('hero.ctaContact'))}</a>
          </div>
        </div>

        <div class="hero-right">
          <div class="section-head">
            <h2 class="section-title">${esc(t('status.title'))}</h2>
            <p class="section-subtitle">${esc(t('status.subtitle'))}</p>
          </div>
          <div class="status-stack">
            ${t('status.items').map((it) => `
              <div class="card status-card-row">
                <div class="status-icon">${esc(it.icon)}</div>
                <div>
                  <h3>${esc(it.label)}</h3>
                  <p>${esc(it.text)}</p>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <section class="home-featured">
        <div class="section-head">
          <div>
            <h2 class="section-title">${esc(t('featured.title'))}</h2>
            <p class="section-subtitle">${esc(t('featured.subtitle'))}</p>
          </div>
          <a class="btn btn-ghost btn-sm" href="#/projects">${esc(t('featured.viewAll'))}</a>
        </div>
        <div class="grid grid-4">
          ${featured.map((p) => `
            <a class="card project-card" href="#/projects">
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.desc)}</p>
              <div class="tags">${(p.tech || []).map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div>
            </a>`).join('')}
        </div>
      </section>`;
  },
  mount() { /* 无动态事件 */ }
};
