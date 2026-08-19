/**
 * I18n.js — 中英双语词典（ES Module）
 * 词典由 Modules/Dicts.js 提供（Launcher/Build.py 从 Languages/*.json 打包），
 * 随模块图并行加载、零网络等待，首屏渲染更快。
 * [data-i18n] / [data-i18n-attr] 静态替换；视图渲染由 Router 触发。
 */
import { DICTS } from './Dicts.js';

const SUPPORTED = ['zh', 'en'];
const DEFAULT = 'zh';
const dicts = DICTS;
const langListeners = [];

function pickLang() {
  try {
    const stored = localStorage.getItem('site-lang');
    if (SUPPORTED.includes(stored)) return stored;
  } catch (e) { /* ignore */ }
  return DEFAULT;
}

let i18nCurrent = pickLang();

export function currentLang() {
  return i18nCurrent;
}

/** 按 key.path 取当前语言文案 */
export function t(key) {
  const d = dicts[i18nCurrent] || {};
  const val = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), d);
  return val === undefined || val === null ? key : val;
}

/** HTML 转义 */
export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/** 应用文档中所有静态 [data-i18n] / [data-i18n-attr] */
export function applyStatic() {
  document.documentElement.lang = i18nCurrent === 'zh' ? 'zh-CN' : 'en';
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    let text = t(el.getAttribute('data-i18n'));
    // {year} 占位符统一替换（视图重渲染后也会被调用，保证不出现字面量）
    if (typeof text === 'string') text = text.split('{year}').join(year);
    el.textContent = text;
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
  i18nCurrent = lang;
  try { localStorage.setItem('site-lang', lang); } catch (e) { /* ignore */ }
  applyStatic();
  updateToggle();
  langListeners.forEach((fn) => fn());
}

function updateToggle() {
  document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
    btn.textContent = i18nCurrent === 'zh' ? 'EN' : '中文';
    btn.title = i18nCurrent === 'zh' ? 'Switch to English' : '切换到中文';
  });
}

// 全局导出（视图 mount 钩子等处使用）
window.i18n = {
  t,
  esc,
  setLang,
  get i18nCurrent() { return i18nCurrent; }
};

/** 初始化：词典已随模块加载，直接应用并绑定语言按钮 */
export async function initI18n() {
  applyStatic();
  updateToggle();
  document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(i18nCurrent === 'zh' ? 'en' : 'zh'));
  });
}
