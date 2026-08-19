/**
 * main.js — 应用入口：装配粒子、i18n、路由、导航
 */
import { initI18n, onLangChange } from './I18n.js';
import { initBackground } from './Background.js';
import { initRouter, renderView, currentViewName } from './Router.js';

/** 移动端汉堡菜单 */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  links.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('a')) {
      links.classList.remove('open');
      toggle.classList.remove('open');
    }
  });
}

async function boot() {
  initBackground();          // 粒子常驻，最先启动
  initNav();
  await initI18n();          // 加载词典、绑定语言按钮（{year} 在 applyStatic 内统一替换）
  initRouter();              // 渲染当前视图

  // 切换语言后重渲染当前视图
  onLangChange(() => {
    renderView(currentViewName());
  });
}

boot();
