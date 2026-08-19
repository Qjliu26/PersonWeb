# Build.py — 构建脚本
# 功能：1) Languages/*.json 词典打包为 JS 数据；2) Styles/*.css 拼接；
#       3) Modules/*.js 打包为单段脚本；4) 生成单文件 index.html（内联全部样式与脚本）
# 效果：线上首屏仅 1 个 HTML 请求（+ 图片），显著加快首次渲染。
# 用法：修改任何源码（词典/样式/模块/模板）后运行：
#   python Launcher/Build.py
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return f.read().lstrip('\ufeff')

def write(rel, content):
    with open(os.path.join(ROOT, rel), 'w', encoding='utf-8') as f:
        f.write(content)

# ---------- 1. 词典打包 ----------
zh = json.loads(read('Languages/Zh.json'))
en = json.loads(read('Languages/En.json'))
dicts_js = (
    '/* Dicts — 自动生成，请勿手改（由 Launcher/Build.py 从 Languages/*.json 打包） */\n'
    'const DICTS = {\n'
    '  zh: ' + json.dumps(zh, ensure_ascii=False, indent=2) + ',\n'
    '  en: ' + json.dumps(en, ensure_ascii=False, indent=2) + ',\n'
    '};\n'
)

# ---------- 2. JS 模块打包 ----------
JS_ORDER = [
    ('Dicts.js', None),          # 数据（由上面生成）
    ('I18n.js', None),
    ('Background.js', None),
    ('Router.js', None),
    ('Views/Home.js', 'HomeView'),
    ('Views/About.js', 'AboutView'),
    ('Views/Skills.js', 'SkillsView'),
    ('Views/Projects.js', 'ProjectsView'),
    ('Views/Portfolio.js', 'PortfolioView'),
    ('Views/Index.js', None),    # 注册表必须在视图声明之后
    ('Main.js', None),
]

parts = ['/* ===== 打包脚本（由 Launcher/Build.py 自动生成，请勿手改） ===== */']
parts.append(dicts_js)

for rel, default_name in JS_ORDER:
    if rel == 'Dicts.js':
        continue
    src = read('Modules/' + rel)
    # 删除所有 import 行（打包后变量同作用域）
    src = re.sub(r"^import .*?;\n", "", src, flags=re.MULTILINE)
    # export const/let/var/function/async function → 普通声明
    src = re.sub(r"^export\s+(const|let|var)\s+", r"\1 ", src, flags=re.MULTILINE)
    src = re.sub(r"^export\s+(async\s+)?function\s+", r"\1function ", src, flags=re.MULTILINE)
    if default_name:
        src = re.sub(r"^export default \{", "const " + default_name + " = {", src, flags=re.MULTILINE)
    if rel == 'Views/Index.js':
        src = src.replace(
            'export default { home, about, skills, projects, portfolio };',
            'const views = { home: HomeView, about: AboutView, skills: SkillsView, projects: ProjectsView, portfolio: PortfolioView };'
        )
    parts.append('/* ===== ' + rel + ' ===== */\n' + src.strip() + '\n')

packed_js = '\n'.join(parts)

# ---------- 3. CSS 拼接 ----------
css = ''.join(read('Styles/' + name) for name in
              ['Base.css', 'Layout.css', 'Components.css', 'Views.css'])

# ---------- 4. 生成单文件 index.html ----------
template = read('index.template.html')
html = template.replace('/*__STYLES__*/', css).replace('/*__SCRIPTS__*/', packed_js)
write('index.html', html)

print('Dicts:', len(dicts_js), 'bytes')
print('Packed JS:', len(packed_js), 'bytes')
print('CSS:', len(css), 'bytes')
print('index.html:', len(html), 'bytes')
print('Build OK')
