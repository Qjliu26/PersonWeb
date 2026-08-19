# 刘秋靖 · 个人主页（PersonWeb）

> 在线访问：[**点击这里直接打开个人主页**](https://Qjliu26.github.io/PersonWeb/)（GitHub Pages，打开即用）

一个纯静态的个人主页：原生 ES Module 单页应用（hash 路由），零依赖、零构建。
深色 Apple 风格 + 交互式粒子背景 + 中英双语切换（右上角 `EN/中文`）。
维护历史见 [CHANGELOG.md](CHANGELOG.md)。

## 怎么操作

### ① 在线看（最快）
直接打开 [Qjliu26.github.io/PersonWeb](https://Qjliu26.github.io/PersonWeb/)，任何设备都能访问。

### ② 本地运行
双击 `Launcher\Serve.bat`（自动启动服务器并打开 <http://localhost:8080>；
优先用 Python，没有 Python 时自动改用 Node 的 `Launcher\Server.js`）

### ③ 改内容（只改两个词典文件，不用碰代码）
所有文案与数据都在：
- `Languages/Zh.json` —— 中文
- `Languages/En.json` —— 英文

对应关系：
| 想改什么 | 改哪里 |
| --- | --- |
| 名字、自我介绍、状态 | `hero.*` |
| 当前状态三张卡 | `status.items` |
| 关于我（简介/特质/荣誉/兴趣/时间线） | `about.*` |
| 技能分类与熟练度（0-100） | `skills.categories` |
| 项目（名称/描述/角色/成果/架构） | `projects.list` |
| 作品（描述/成果/架构） | `portfolio.list` |
| 联系方式 | `contact.items`、`home.contactShort` |

改完保存 → 刷新浏览器即生效。修改后提交：
```bat
git add -A
git commit --allow-empty-message -m ""
git push
```
GitHub Pages 会在 1-2 分钟内自动更新线上版本（细节记入 CHANGELOG.md）。

## 项目结构（大驼峰命名）

```
PersonWeb/
├── README.md               ← 本文件（操作说明）
├── CHANGELOG.md            ← 维护日志（每次修改的记录）
├── index.html              ← SPA 唯一入口（部署惯例保留小写）
├── Styles/                 ← 样式层
│   ├── Base.css            ← 设计变量、重置、排版
│   ├── Layout.css          ← 导航、主视图、页脚
│   ├── Components.css      ← 按钮、卡片、网格、分页等组件
│   └── Views.css           ← 各视图专属样式
├── Modules/                ← JS 模块层
│   ├── Main.js             ← 装配入口
│   ├── Router.js           ← hash 路由 + 视图切换
│   ├── I18n.js             ← 双语词典加载与切换
│   ├── Background.js       ← 交互式粒子背景（空间哈希优化）
│   └── Views/              ← 视图模块（新增页面在此加文件并登记）
│       ├── Index.js        ← 视图注册表
│       ├── Home.js         ├── About.js      ├── Skills.js
│       ├── Projects.js     └── Portfolio.js
├── Languages/              ← 双语词典
│   ├── Zh.json             ← 全部中文文案与数据
│   └── En.json             ← 全部英文文案与数据
├── Assets/                 ← 静态资源
│   └── Images/             ← 头像、证书扫描件（certs/）
└── Launcher/               ← 启动脚本
    ├── Serve.bat           ← 本地一键启动
    └── Server.js           ← Node 备用静态服务器
```

## 技术栈

- 原生 HTML / CSS / JavaScript（ES Module），无框架、无构建、无第三方依赖
- Hash 路由 SPA：视图切换无刷新、带过渡动画；粒子背景全程常驻
- 词典驱动双语：内容与代码完全分离
- Canvas 粒子背景：空间哈希网格优化、面积自适应数量、鼠标/触摸跟随、帧率自动降级

## 隐私说明

- 本仓库不含身份证号等敏感信息；联系方式仅公开邮箱与电话
