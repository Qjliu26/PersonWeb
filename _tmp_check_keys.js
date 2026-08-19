// 临时脚本：词典键完整性检查（所有 t('key') 引用 vs 词典）
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const zh = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n/zh.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n/en.json'), 'utf8'));

function hasKey(obj, key) {
  return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj) !== undefined;
}

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (f.endsWith('.js') || f.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(path.join(ROOT, 'js')).concat([path.join(ROOT, 'index.html')]);
const keys = new Set();
const re = /(?:i18n\.)?t\(\s*'([^']+)'\s*\)/g;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = re.exec(src)) !== null) keys.add(m[1]);
}

let missing = 0;
for (const k of [...keys].sort()) {
  const inZh = hasKey(zh, k);
  const inEn = hasKey(en, k);
  if (!inZh || !inEn) {
    missing++;
    console.log(`MISSING key "${k}"  zh=${inZh} en=${inEn}`);
  }
}
console.log(`共引用 ${keys.size} 个键，缺失 ${missing} 个`);
