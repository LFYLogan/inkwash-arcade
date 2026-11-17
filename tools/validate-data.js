/* 数据校验：成语库、金融案例库、产品目录
 * 用法：
 *   node tools/validate-data.js                  # 校验 data/ 下的正式数据文件
 *   node tools/validate-data.js <批次文件.js>     # 校验单个批次（内容是数组）
 * 退出码 0 表示全部通过；有问题会列出前若干条并以 1 退出。
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const IDIOM_GROUPS = ['人物情态', '学习才识', '处事方法', '社会关系', '自然景物', '言谈表达', '境遇遭际', '品格德行'];
const COLORS = ['褒义', '贬义', '中性'];
const KINDS = ['best', 'ok', 'bad'];
const cjk = (s) => (String(s || '').match(/[\u4e00-\u9fff]/g) || []).length;

function loadWindowFile(file) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), sandbox, { filename: file });
  return sandbox.window;
}

const problems = [];
const add = (where, msg) => problems.push(`${where}: ${msg}`);

/* ---------------- 成语 ---------------- */
function validateIdioms(list, where) {
  const seen = new Set();
  list.forEach((it, i) => {
    const tag = `${where}#${i}${it && it.w ? '(' + it.w + ')' : ''}`;
    if (!it || typeof it !== 'object') return add(tag, '不是对象');
    if (!/^[\u4e00-\u9fff]{4}$/.test(it.w || '')) add(tag, 'w 必须是 4 个汉字');
    if (seen.has(it.w)) add(tag, '成语重复');
    seen.add(it.w);
    if (cjk(it.m) < 6) add(tag, 'm 释义过短');
    if (!String(it.e || '').includes(it.w)) add(tag, 'e 例句必须原样包含该成语');
    if (!COLORS.includes(it.k)) add(tag, `k 必须是 ${COLORS.join('/')}`);
    if (!IDIOM_GROUPS.includes(it.g)) add(tag, `g 必须是 ${IDIOM_GROUPS.join('/')}`);
    if (it.y && !String(it.w).includes(it.y)) add(tag, 'y 必须是成语里的字');
  });
  return seen.size;
}

/* ---------------- 产品 ---------------- */
function validateProducts(list, where) {
  const ids = new Set();
  list.forEach((p, i) => {
    const tag = `${where}#${i}${p && p.name ? '(' + p.name + ')' : ''}`;
    if (!p.id) add(tag, '缺 id');
    if (ids.has(p.id)) add(tag, 'id 重复');
    ids.add(p.id);
    ['name', 'type', 'term', 'liq', 'min', 'note'].forEach((k) => { if (!p[k]) add(tag, `缺 ${k}`); });
    if (!/^R[1-5]$/.test(p.risk || '')) add(tag, 'risk 必须是 R1-R5');
  });
  return ids;
}

/* ---------------- 案例 ---------------- */
function validateCases(list, where, productIds) {
  const ids = new Set();
  list.forEach((c, i) => {
    const tag = `${where}#${i}${c && c.title ? '《' + c.title + '》' : ''}`;
    if (!c.id) add(tag, '缺 id');
    if (ids.has(c.id)) add(tag, 'id 重复');
    ids.add(c.id);
    if (!c.title) add(tag, '缺 title');
    if (![1, 2, 3].includes(c.level)) add(tag, 'level 必须是 1/2/3');
    if (!Array.isArray(c.tags) || !c.tags.length) add(tag, 'tags 不能为空');
    const cl = c.client || {};
    ['name', 'age', 'job', 'income', 'assets', 'family', 'goal', 'stated', 'risk'].forEach((k) => {
      if (cl[k] === undefined || cl[k] === '') add(tag, `client 缺 ${k}`);
    });
    if (!/^C[1-5]$/.test(cl.risk || '')) add(tag, 'client.risk 必须是 C1-C5');
    if (!Array.isArray(c.steps) || c.steps.length !== 4) add(tag, 'steps 必须是 4 步');
    (c.steps || []).forEach((s, si) => {
      const st = `${tag} 第${si + 1}步`;
      if (!s.q) add(st, '缺 q');
      if (!s.teach) add(st, '缺 teach');
      const opts = s.options || [];
      if (opts.length < 3 || opts.length > 4) add(st, '选项数应为 3-4');
      const best = opts.filter((o) => o.kind === 'best').length;
      if (best !== 1) add(st, `best 选项应恰好 1 个（当前 ${best}）`);
      opts.forEach((o, oi) => {
        if (!o.t) add(`${st} 选项${oi + 1}`, '缺 t');
        if (!KINDS.includes(o.kind)) add(`${st} 选项${oi + 1}`, 'kind 必须是 best/ok/bad');
        if (!o.fb) add(`${st} 选项${oi + 1}`, '缺 fb 反馈');
        if (o.product && productIds && !productIds.has(o.product)) add(`${st} 选项${oi + 1}`, `product 不存在: ${o.product}`);
      });
    });
    if (!Array.isArray(c.lessons) || c.lessons.length < 3) add(tag, 'lessons 至少 3 条');
    if (!c.reg) add(tag, '缺 reg');
  });
  return ids.size;
}

/* ---------------- 入口 ---------------- */
const arg = process.argv[2];
if (arg) {
  const file = path.isAbsolute(arg) ? arg : path.join(ROOT, arg);
  const arr = require(file);
  if (!Array.isArray(arr)) { console.error('批次文件必须导出数组'); process.exit(1); }
  const isIdiom = /idiom/i.test(path.basename(file));
  if (isIdiom) {
    const n = validateIdioms(arr, path.basename(file));
    console.log(`成语批次：${arr.length} 条，去重后 ${n} 条`);
  } else {
    const products = loadWindowFile('data/finance-products.js').FINANCE_PRODUCTS || [];
    const ids = validateProducts(products, '产品目录');
    const n = validateCases(arr, path.basename(file), ids);
    console.log(`案例批次：${arr.length} 个，去重后 ${n} 个`);
  }
} else {
  const idioms = loadWindowFile('data/idioms.js').IDIOM_DATA || [];
  const products = loadWindowFile('data/finance-products.js').FINANCE_PRODUCTS || [];
  const cases = loadWindowFile('data/finance-cases.js').FINANCE_CASES || [];
  const pid = validateProducts(products, '产品目录');
  const iN = validateIdioms(idioms, '成语库');
  const cN = validateCases(cases, '案例库', pid);
  console.log(`成语库：${idioms.length} 条（唯一 ${iN}）`);
  console.log(`产品目录：${products.length} 个`);
  console.log(`案例库：${cases.length} 个（唯一 ${cN}）`);
}

if (problems.length) {
  console.error(`\n发现 ${problems.length} 个问题：`);
  problems.slice(0, 40).forEach((p) => console.error('  - ' + p));
  if (problems.length > 40) console.error(`  ……还有 ${problems.length - 40} 条`);
  process.exit(1);
}
console.log('\n校验通过。');