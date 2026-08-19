# Build.py — 构建脚本：把 Languages/*.json 词典打包为 Modules/Dicts.js
# 用途：词典随 JS 模块并行加载，消除首屏 fetch 网络等待，显著加快首次渲染。
# 用法：修改 Languages/Zh.json 或 En.json 后，运行：
#   python Launcher/Build.py
# 然后照常提交推送。
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load(name):
    with open(os.path.join(ROOT, 'Languages', name), encoding='utf-8') as f:
        return json.load(f)

zh = load('Zh.json')
en = load('En.json')

# 打包为 ES Module（DICTS 键与语言代码一致）
content = (
    '/* ============================================================\n'
    '   Dicts.js — 自动生成，请勿手改\n'
    '   由 Launcher/Build.py 从 Languages/Zh.json、En.json 打包。\n'
    '   修改词典后请运行：python Launcher/Build.py\n'
    '   ============================================================ */\n'
    'export const DICTS = {\n'
    '  zh: ' + json.dumps(zh, ensure_ascii=False, indent=2) + ',\n'
    '  en: ' + json.dumps(en, ensure_ascii=False, indent=2) + ',\n'
    '};\n'
)

out = os.path.join(ROOT, 'Modules', 'Dicts.js')
with open(out, 'w', encoding='utf-8') as f:
    f.write(content)

print('Dicts.js generated:', os.path.getsize(out), 'bytes')
