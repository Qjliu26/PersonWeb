/**
 * main.js — 应用入口：装配粒子、i18n、路由、导航
 */
import { initI18n, onLangChange, applyStatic } from './i18n.js';
import { initBackground } from './background.js';
import { initRouter, renderView, currentViewName } from './router.js';

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

/** 页脚 {year} 占位符替换 */
function fillYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const text = el.textContent;
    if (text.includes('{year}')) el.textContent = text.split('{year}').join(year);
  });
}

async function boot() {
  initBackground();          // 粒子常驻，最先启动
  initNav();
  await initI18n();          // 加载词典、绑定语言按钮
  fillYear();
  initRouter();              // 渲染当前视图

  // 切换语言后重渲染当前视图
  onLangChange(() => {
    fillYear();
    renderView(currentViewName());
  });
}

boot();
