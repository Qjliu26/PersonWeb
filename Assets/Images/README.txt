这里存放网站用到的图片（头像、项目截图、作品封面等）。

当前网站使用纯 CSS 占位图（首页头像为首字母圆形、作品集封面为渐变色块），
因此还没有真实图片文件。

以后替换真实内容时：
1. 把图片放进本文件夹，例如 avatar.jpg
2. 在对应位置引用：assets/images/avatar.jpg
   - 首页头像：修改 site/index.html 中 .hero-avatar 部分
   - 作品集封面：修改 site/portfolio.html 的渲染脚本，把 .portfolio-cover 换成 <img>
3. 也可以直接在 zh.json / en.json 的作品数据里加 "image": "assets/images/xxx.jpg" 字段
   并相应修改 portfolio.html 的渲染脚本
