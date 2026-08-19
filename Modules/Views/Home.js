/**
 * Modules/Views/Home.js — 首页
 * 左个人信息（含联系方式）| 右当前状态；下方精选项目列表（点击进入项目页）
 */
import { esc } from '../I18n.js';

export default {
  render(t) {
    const featured = t('projects.list').filter((p) => p.featured);
    const contacts = t('home.contactShort');
    return `
      <section class="hero-split">
        <div class="hero-left">
          <div class="hero-identity">
            <img class="hero-avatar" src="Assets/Images/avatar.jpg" alt="${esc(t('hero.avatarAlt'))}">
            <div>
              <p class="hero-greeting">${esc(t('hero.greeting'))}</p>
              <h1 class="hero-name">${esc(t('hero.name'))}</h1>
              <p class="hero-tagline">${esc(t('hero.tagline'))}</p>
            </div>
          </div>
          <p class="hero-intro">${esc(t('hero.intro'))}</p>
          <p class="hero-status"><span class="status-dot"></span>${esc(t('hero.status'))}</p>
          <div class="hero-contact">
            ${contacts.map((c) => c.link
              ? `<a class="hero-contact-item" href="${esc(c.link)}">${esc(c.icon)} ${esc(c.value)}</a>`
              : `<span class="hero-contact-item">${esc(c.icon)} ${esc(c.value)}</span>`).join('')}
          </div>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/projects">${esc(t('hero.ctaProjects'))}</a>
            <a class="btn btn-ghost" href="#/about">${esc(t('hero.ctaAbout'))}</a>
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
        <div class="featured-list">
          ${featured.map((p, i) => `
            <a class="card featured-item" href="#/projects">
              <div class="featured-head">
                <span class="bullet">${i + 1}</span>
                <h3>${esc(p.name)}</h3>
              </div>
              <div class="featured-desc">
                <p>${esc(p.desc)}</p>
                <div class="tags">${(p.tech || []).map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div>
              </div>
            </a>`).join('')}
        </div>
      </section>`;
  },
  mount() { /* 无动态事件 */ }
};
