# 墨戏五卷 · Inkwash Arcade

五个纯前端中文小游戏，零依赖、零后端、可离线，直接托管在 GitHub Pages 上即可访问。

| 卷 | 游戏 | 类型 | 时长 |
| --- | --- | --- | --- |
| 卷一 | 问心局 | 故事式 MBTI 性格测试（24 次抉择 → 16 型人格） | ~8 分钟 |
| 卷二 | 五行医馆 | 中医五行行医经营（相生相克配伍 → 体质判定） | ~10 分钟 |
| 卷三 | 一念飞升 | 快节奏修仙 Roguelite（九境天劫 → 转世传承） | ~5 分钟 / 世 |
| 卷四 | 成语闯关 | 考公向成语训练：释义猜词、语境填词、尾字接龙、褒贬快判 | 随时 |
| 卷五 | 理财诊室 | 银行/基金从业的案例式决策训练：42 个客户案例，四步走完给评分与复盘 | 3–5 分钟 / 案例 |

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
│  └─ common.js          共享工具（存储、随机、toast、顶栏）
├─ data/
│  ├─ idioms.js          成语库（831 条，window.IDIOM_DATA）
│  ├─ finance-products.js 产品目录（14 个，window.FINANCE_PRODUCTS）
│  ├─ finance-cases.js   案例库（42 个，由 data/cases/*.js 生成）
│  └─ cases/             案例批次源文件（手工追加从这里改）
├─ tools/
│  ├─ validate-data.js   数据校验（成语 / 产品 / 案例）
│  └─ build-cases.js     合并案例批次 → data/finance-cases.js
└─ .github/workflows/pages.yml
```

## 题库数据怎么加

**自己加成语、加案例、加产品，都不需要改代码**：编辑 `data/` 下的 JS 数组，刷新页面即生效。
详细字段说明、模板与校验命令见 **[DATA-FORMAT.md](./DATA-FORMAT.md)**。

```powershell
# 改完跑一次校验
node tools\validate-data.js

# 加完案例后重新生成案例库
node tools\build-cases.js
```

## 存档

进度写在浏览器 `localStorage`，键名统一以 `inkwash.` 开头：

- `inkwash.mbti.progress` / `inkwash.mbti.result`
- `inkwash.wuxing.save` / `inkwash.wuxing.records`
- `inkwash.xiuxian.save` / `inkwash.xiuxian.legacy` / `inkwash.xiuxian.records`
- `inkwash.idiom.progress`（已学、掌握、错题本）
- `inkwash.finance.progress`（已完成案例、得分、评级）

## 授权

MIT。素材全部为内联 SVG / CSS 绘制，无第三方图片与字体文件。