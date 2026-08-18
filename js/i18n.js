/**
 * i18n.js — 中英双语词典（ES Module）
 * - 词典从 src/i18n/{lang}.json 加载
 * - [data-i18n="key.path"] / [data-i18n-attr="attr:key"] 静态替换
 * - 视图切换/语言切换时由 main.js 统一触发重渲染
 */

const SUPPORTED = ['zh', 'en'];
const DEFAULT = 'zh';
const dicts = {};
const langListeners = [];

function pickLang() {
  try {
    const stored = localStorage.getItem('site-lang');
    if (SUPPORTED.includes(stored)) return stored;
  } catch (e) { /* ignore */ }
  return DEFAULT;
}

let current = pickLang();

export function currentLang() {
  return current;
}

/** 按 key.path 取当前语言文案 */
export function t(key) {
  const d = dicts[current] || {};
  const val = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), d);
  return val === undefined || val === null ? key : val;
}

/** HTML 转义 */
export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

async function loadDict(lang) {
  if (!dicts[lang]) {
    const res = await fetch(`i18n/${lang}.json`);
    if (!res.ok) throw new Error('词典加载失败: ' + lang);
    dicts[lang] = await res.json();
  }
}

/** 应用文档中所有静态 [data-i18n] / [data-i18n-attr] */
export function applyStatic() {
  document.documentElement.lang = current === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const spec = el.getAttribute('data-i18n-attr').split(':');
    if (spec.length === 2) el.setAttribute(spec[0], t(spec[1]));
  });
}

export function onLangChange(fn) {
  langListeners.push(fn);
}

export async function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  current = lang;
  try { localStorage.setItem('site-lang', lang); } catch (e) { /* ignore */ }
  await loadDict(lang);
  applyStatic();
  updateToggle();
  langListeners.forEach((fn) => fn());
}

function updateToggle() {
  document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
    btn.textContent = current === 'zh' ? 'EN' : '中文';
    btn.title = current === 'zh' ? 'Switch to English' : '切换到中文';
  });
}

/** 初始化：加载默认词典并绑定语言按钮 */
export async function initI18n() {
  try {
    await loadDict(current);
    applyStatic();
  } catch (err) {
    console.error('[i18n] 词典加载失败：', err);
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#7a1f1f;color:#fff;padding:10px 16px;font-size:13px;z-index:9999;line-height:1.6';
    banner.textContent = '多语言词典加载失败：请通过 scripts\\serve.bat 启动本地服务器访问。';
    document.body.appendChild(banner);
  }
  updateToggle();
  document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(current === 'zh' ? 'en' : 'zh'));
  });
}
