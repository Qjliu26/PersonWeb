// 临时脚本：无头浏览器冒烟测试 v2（严格断言，用完即删）
const puppeteer = require('puppeteer-core');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://127.0.0.1:8080/';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });

  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push('[console] ' + msg.text()); });
  page.on('pageerror', (err) => errors.push('[pageerror] ' + String(err)));

  const results = [];
  let pass = 0, fail = 0;
  const check = (name, cond, extra = '') => {
    if (cond) { pass++; results.push(`PASS ${name}${extra ? ' | ' + extra : ''}`); }
    else { fail++; results.push(`FAIL ${name}${extra ? ' | ' + extra : ''}`); }
  };

  // 1. 初始加载
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  const initial = await page.evaluate(() => {
    const view = document.getElementById('view');
    return { len: view ? view.innerHTML.length : -1, footer: document.querySelector('.site-footer p')?.textContent || '' };
  });
  check('初始渲染', initial.len > 1000, `view=${initial.len}`);
  check('页脚年份渲染', initial.footer.includes('2026') && !initial.footer.includes('{year}'), initial.footer.trim());

  // 2. 视图切换
  for (const v of ['about', 'skills', 'projects', 'portfolio', 'home']) {
    await page.evaluate((name) => { location.hash = '#/' + name; }, v);
    await new Promise((r) => setTimeout(r, 450));
    const len = await page.evaluate(() => document.getElementById('view').innerHTML.length);
    check(`视图 #/${v}`, len > 500, `len=${len}`);
  }

  // 3. 技能 tab 切换（验证标题真的改变）
  await page.evaluate(() => { location.hash = '#/skills'; });
  await new Promise((r) => setTimeout(r, 450));
  const tab = await page.evaluate(() => {
    const tabs = document.querySelectorAll('.skill-tab');
    const before = document.querySelector('[data-radar-title]').textContent;
    tabs[1].click();
    return new Promise((resolve) => setTimeout(() => {
      resolve({
        count: tabs.length,
        before,
        after: document.querySelector('[data-radar-title]').textContent,
        legend: document.querySelector('[data-radar-legend]').textContent.trim().slice(0, 40),
      });
    }, 300));
  });
  check('技能 tab 切换', tab.count === 7 && tab.after !== tab.before, `${tab.before} → ${tab.after} | ${tab.legend}`);

  // 4. 项目页翻页（验证内容真的改变）
  await page.evaluate(() => { location.hash = '#/projects'; });
  await new Promise((r) => setTimeout(r, 450));
  const pg = await page.evaluate(() => {
    const first1 = document.querySelector('[data-project-grid] .pcard-title').textContent;
    const n1 = document.querySelectorAll('[data-project-grid] .pcard').length;
    document.querySelector('[data-page-next]').click();
    return new Promise((resolve) => setTimeout(() => {
      const first2 = document.querySelector('[data-project-grid] .pcard-title').textContent;
      const n2 = document.querySelectorAll('[data-project-grid] .pcard').length;
      resolve({ first1, n1, first2, n2 });
    }, 300));
  });
  check('项目分页（第2页内容变化）', pg.n1 === 5 && pg.n2 === 5 && pg.first1 !== pg.first2, `页1首="${pg.first1}" → 页2首="${pg.first2}"`);

  // 5. 首页精选展开
  await page.evaluate(() => { location.hash = '#/home'; });
  await new Promise((r) => setTimeout(r, 450));
  const home = await page.evaluate(() => {
    const items = document.querySelectorAll('.featured-item');
    items[0].click();
    return new Promise((resolve) => setTimeout(() => {
      resolve({ count: items.length, open: items[0].classList.contains('open') });
    }, 300));
  });
  check('首页精选展开', home.count === 4 && home.open, `count=${home.count} open=${home.open}`);

  // 6. 关于页特质横排
  await page.evaluate(() => { location.hash = '#/about'; });
  await new Promise((r) => setTimeout(r, 450));
  const traits = await page.evaluate(() => {
    const grid = document.querySelectorAll('.about-left .grid-4 .trait-card');
    return grid.length;
  });
  check('个人特质横排(4)', traits === 4, `traits=${traits}`);

  // 7. 性能：粒子帧耗时采样
  await page.evaluate(() => { location.hash = '#/home'; });
  await new Promise((r) => setTimeout(r, 600));
  const perf = await page.evaluate(() => new Promise((resolve) => {
    const t0 = performance.now();
    let frames = 0;
    function tick() {
      frames++;
      if (performance.now() - t0 < 2000) requestAnimationFrame(tick);
      else resolve(frames);
    }
    requestAnimationFrame(tick);
  }));
  check('粒子帧率（2 秒采样 ≥ 90 帧）', perf >= 90, `${perf} 帧 / 2s`);

  results.push('--- 错误输出 ---');
  if (errors.length === 0) results.push('（无 console/page 错误）');
  else errors.forEach((e) => results.push(e));
  check('无 JS 错误', errors.length === 0);

  console.log(results.join('\n'));
  console.log(`\n总计: ${pass} 通过, ${fail} 失败`);
  await browser.close();
  process.exit(fail > 0 ? 1 : 0);
})().catch((e) => { console.error('测试异常:', e); process.exit(1); });
