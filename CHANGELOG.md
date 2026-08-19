# 更新日志（Changelog）

> 本文件记录个人主页的所有维护与修改历史。每次修改请在此追加一条，格式：
> `YYYY-MM-DD 简述改动`（提交信息保持为空，细节记在这里）。

## 2026（最近更新）

- **目录与文件全面规范化**：全部改为大驼峰（PascalCase）命名，语义化表达——
  `Styles/`（样式，原 css/）、`Modules/`（JS 模块，原 js/，内含 `Views/` 视图层）、
  `Languages/`（双语词典，原 i18n/）、`Assets/`（静态资源，原 assets/）、
  `Launcher/`（启动脚本，原 scripts/）；文件同步改为 `Base.css`、`Main.js`、
  `Zh.json` 等大驼峰文件名，`index.html` 按部署惯例保留小写
- **修复页面空白与交互失效**：`I18n.js` 补回全局导出（此前技能 tab、项目分页
  点击无效的根因），并改为模块 import 引用，双保险
- **粒子引擎性能优化**：空间哈希网格分桶，连线与斥力只检查相邻桶
  （O(n²) → O(n·k)，约 30 倍提速）；颜色预生成分档；粒子数按面积自适应封顶
- **个人特质改一横排**（一行 4 个）
- 历史功能：真分页项目页（5 个/页）、作品页一行 5 个默认展开、技能雷达图
  （顶部类别标签 + 居中雷达 + 评分依据）、首页左右结构 + 左下角联系方式、
  项目/作品卡片内容统一（标题 2 行、描述 2 行、角色/成果 2 行、架构 4-5 行）

## 使用说明（给维护者）

- 本地运行：双击 `Launcher\Serve.bat`（或 `python -m http.server 8080`，站点根目录）
- 改内容：只改 `Languages\Zh.json` / `En.json`（词典驱动，改完刷新即可）
- 改样式：`Styles\` 下按 Base/Layout/Components/Views 四层
- 加页面：`Modules\Views\` 新增模块 → 在 `Views\Index.js` 登记
- 上线：`git add -A && git commit --allow-empty-message -m "" && git push`
  （GitHub Pages 自动部署，1-2 分钟生效）
- 回归测试：本地 `_tmp_smoke.js`（无头浏览器全流程测试，不入库）
