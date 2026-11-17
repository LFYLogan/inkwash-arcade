/* 合并案例批次 → data/finance-cases.js（按 id 排序，自动去重） */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = 'C:/deepseek_harness/play';
const dir = path.join(ROOT, 'data/cases');
const files = fs.readdirSync(dir).filter((f) => /^case-batch-.*\.js$/.test(f)).sort();

const all = [];
for (const f of files) {
  const arr = require(path.join(dir, f));
  if (!Array.isArray(arr)) { console.warn(`${f} 不是数组，跳过`); continue; }
  console.log(`${f}: ${arr.length} 个`);
  all.push(...arr);
}

const map = new Map();
for (const c of all) {
  if (!c || !c.id) continue;
  const prev = map.get(c.id);
  if (!prev) map.set(c.id, c);
  else if ((c.steps || []).length > (prev.steps || []).length) map.set(c.id, c);
}

const cases = [...map.values()].sort((a, b) => String(a.id).localeCompare(String(b.id), 'en', { numeric: true }));

const header = `/* 金融案例库：案例式决策 + 场景学习（由 data/cases/*.js 合并生成，共 ${cases.length} 个）
 * 一个案例 = 一位客户 + 四个决策步骤：了解客户 → 定级/事实判断 → 方案与产品 → 销售动作与后续。
 * 追加案例请改 data/cases/ 下的批次文件，然后运行 node tools/build-cases.js。
 * 字段说明见 DATA-FORMAT.md。
 */
window.FINANCE_CASES = [`;

const body = cases.map((c) => {
  const s = JSON.stringify(c, null, 2)
    .split('\n')
    .map((line, i) => (i === 0 ? line : '  ' + line))
    .join('\n');
  return '  ' + s + ',';
}).join('\n');

const footer = `];
window.FINANCE_CASE_META = { version: '2.0', count: window.FINANCE_CASES.length };
`;

const out = header + '\n' + body + '\n' + footer;
fs.writeFileSync(path.join(ROOT, 'data/finance-cases.js'), out, 'utf8');

const byLevel = cases.reduce((m, c) => { m[c.level] = (m[c.level] || 0) + 1; return m; }, {});
console.log(`\n合并完成：${cases.length} 个案例，难度分布 ${JSON.stringify(byLevel)}`);
console.log(`输出 data/finance-cases.js（${(fs.statSync(path.join(ROOT, 'data/finance-cases.js')).size / 1024).toFixed(1)} KB）`);