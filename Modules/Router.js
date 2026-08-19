/**
 * router.js — Hash 路由：视图切换 + 过渡动画 + 导航高亮
 * - URL 形如 #/home、#/about …，默认 #/home
 * - 切换时重渲染 #view 并播放淡入动画（粒子背景不受影响）
 */
import { t, applyStatic } from './I18n.js';
import views from './Views/Index.js';

let routerCurrent = null;

export function currentViewName() {
  return routerCurrent;
}

/** 解析当前 hash 对应的视图名（非法值回退 home） */
export function parseHash() {
  const name = location.hash.replace(/^#\/?/, '') || 'home';
  return views[name] ? name : 'home';
}

/** 渲染指定视图 */
export function renderView(name) {
  const view = views[name];
  if (!view) return;
  routerCurrent = name;

  const main = document.getElementById('view');
  main.innerHTML = view.render(t);
  // 重启动画
  main.classList.remove('view-enter');
  void main.offsetWidth;
  main.classList.add('view-enter');

  applyStatic(); // 视图内静态 [data-i18n]（如页脚年份等全局元素）
  document.title = t(`meta.${name}Title`);

  // 导航高亮
  document.querySelectorAll('.nav-links a[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('data-nav') === name);
  });

  if (view.mount) view.mount();
}

/** 初始化路由并渲染当前 hash */
export function initRouter() {
  window.addEventListener('hashchange', () => renderView(parseHash()));

  // 点击同一视图链接时不触发 hashchange，需手动刷新
  document.querySelectorAll('.nav-links a[data-nav]').forEach((a) => {
    a.addEventListener('click', () => {
      if (a.getAttribute('data-nav') === parseHash()) renderView(parseHash());
    });
  });

  renderView(parseHash());
}
