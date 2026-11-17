# 墨戏五卷 · Inkwash Arcade

五个纯前端中文小游戏，零依赖、零后端、可离线，直接托管在 GitHub Pages 上即可访问。

| 卷 | 游戏 | 类型 | 时长 |
| --- | --- | --- | --- |
| 卷一 | 问心局 | 故事式 MBTI 性格测试（24 次抉择 → 16 型人格） | ~8 分钟 |
| 卷二 | 五行医馆 | 中医五行行医经营（相生相克配伍 → 体质判定） | ~10 分钟 |
| 卷三 | 一念飞升 | 快节奏修仙 Roguelite（九境天劫 → 转世传承） | ~5 分钟 / 世 |
| 卷四 | 成语闯关 | 考公向成语训练（释义猜词、语境填词、接龙、褒贬快判） | 随时 |
| 卷五 | 理财诊室 | 银行/基金从业训练（题库闯关、适当性实战、资产配置模拟） | 随时 |

## 本地运行

不需要构建。任选一种：

```powershell
# 1) 直接双击 index.html（file:// 也能玩）

# 2) 起个本地静态服务器（推荐，行为与线上一致）
python -m http.server 8080
# 然后打开 http://127.0.0.1:8080
```

## 部署到 GitHub Pages

仓库已包含 `.github/workflows/pages.yml`，推到 `main` 会自动发布；详见 [PUBLISH.md](./PUBLISH.md)。

## 目录结构

```
.
├─ index.html            大厅（故事三卷 + 职业题库两卷）
├─ mbti.html             卷一 · 问心局
├─ wuxing.html           卷二 · 五行医馆
├─ xiuxian.html          卷三 · 一念飞升
├─ idiom.html            卷四 · 成语闯关
├─ finance.html          卷五 · 理财诊室
├─ assets/
│  ├─ theme.css          共享设计令牌与组件
│  ├─ common.js          共享工具（存储、随机、toast、顶栏）
│  ├─ idioms-data.js     成语数据（window.IDIOM_DATA）
│  └─ finance-data.js    金融题库（window.FINANCE_DATA）
└─ .github/workflows/pages.yml
```

## 题库数据格式

### 成语（`assets/idioms-data.js`）

```js
window.IDIOM_DATA = [
  { w: '望洋兴叹', m: '释义，8-60 字', e: '例句，必须包含该成语', k: '中性', g: '人物情态', y: '洋' },
];
```

- `w` 四字成语 · `m` 释义 · `e` 例句（必含 `w`，用于挖空题） · `k` 褒义/贬义/中性 · `g` 类别 · `y` 易错字（可选）
- 类别取值：人物情态、学习才识、处事方法、社会关系、自然景物、言谈表达、境遇遭际、品格德行

### 金融（`assets/finance-data.js`）

```js
window.FINANCE_DATA = [
  { q: '题干', o: ['A', 'B', 'C', 'D'], a: 1, x: '解析', t: '基金', d: 1 },
];
```

- `q` 题干 · `o` 四个选项 · `a` 正确下标（0-3） · `x` 解析 · `t` 基金/股票/债券/银行/合规/适当性 · `d` 难度 1-3

两个数据文件都是普通 JS，改完刷新即生效，不需要构建。

## 存档

进度写在浏览器 `localStorage`，键名统一以 `inkwash.` 开头：

- `inkwash.mbti.progress` / `inkwash.mbti.result`
- `inkwash.wuxing.save` / `inkwash.wuxing.records`
- `inkwash.xiuxian.save` / `inkwash.xiuxian.legacy` / `inkwash.xiuxian.records`
- `inkwash.idiom.progress`（已学、掌握、错题本）
- `inkwash.finance.progress`（已答、正确率、错题本）

## 授权

MIT。素材全部为内联 SVG / CSS 绘制，无第三方图片与字体文件。