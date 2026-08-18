# 刘秋靖 · 个人主页（PersonWeb）

> 在线访问：**https://Qjliu26.github.io/PersonWeb/**（GitHub Pages，打开即用）

一个纯静态的个人主页：原生 ES Module 单页应用（hash 路由），零依赖、零构建。
深色 Apple 风格 + 交互式粒子背景 + 中英双语切换（右上角 `EN/中文`）。

## 怎么操作

### ① 在线看（最快）
直接打开 <https://Qjliu26.github.io/PersonWeb/>，任何设备都能访问。

### ② 本地运行
```bat
cd /d 本仓库所在目录
scripts\serve.bat
```
双击 `scripts\serve.bat` 也可以：自动启动服务器并打开 <http://localhost:8080>。
（优先用 Python，没有 Python 时自动改用 Node 的 `server.js`）

### ③ 改内容（只改两个词典文件，不用碰代码）
所有文案与数据都在：
- `i18n/zh.json` —— 中文
- `i18n/en.json` —— 英文

对应关系：
| 想改什么 | 改哪里 |
| --- | --- |
| 名字、自我介绍、状态 | `hero.*` |
| 当前状态三张卡 | `status.items` |
| 关于我（简介/特质/荣誉/兴趣/时间线） | `about.*` |
| 技能分类与熟练度（0-100） | `skills.categories` |
| 项目（名称/描述/技术栈/架构/效果） | `projects.list` |
| 作品集（作品与架构图） | `portfolio.list` |
| 联系方式（邮箱/电话等） | `contact.items` |

改完保存 → 刷新浏览器即生效。修改后提交：
```bat
git add -A
git commit --allow-empty-message -m ""
git push
```
GitHub Pages 会在 1-2 分钟内自动更新线上版本。

## 项目结构

```
PersonWeb/
├── README.md               ← 本文件（操作说明）
├── scripts/
│   ├── serve.bat           ← 本地一键启动
│   └── server.js           ← Node 备用静态服务器
├── index.html              ← SPA 唯一入口
├── css/                    ← base 变量 / layout 布局 / components 组件 / views 视图
├── js/
│   ├── main.js             ← 装配入口
│   ├── router.js           ← hash 路由 + 切换动画
│   ├── i18n.js             ← 中英词典加载与切换
│   ├── background.js       ← 交互式粒子背景
│   └── views/              ← 六个视图模块（新增页面在此加文件并登记）
├── i18n/                   ← zh.json / en.json（全部内容数据）
└── assets/images/          ← 头像与证书图片
```

## 技术栈

- 原生 HTML / CSS / JavaScript（ES Module），无框架、无构建、无第三方依赖
- Hash 路由 SPA：视图切换无刷新、带过渡动画；粒子背景全程常驻
- 词典驱动双语：内容与代码完全分离
- Canvas 粒子背景：面积自适应数量、鼠标/触摸跟随、帧率自动降级

## 隐私说明

- 本仓库不含身份证号等敏感信息；联系方式仅公开邮箱与电话
