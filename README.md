# 墨戏三卷 · Inkwash Arcade

三个纯前端中文小游戏，零依赖、零后端、可离线，直接托管在 GitHub Pages 上即可访问。

| 卷 | 游戏 | 类型 | 时长 |
| --- | --- | --- | --- |
| 卷一 | 问心局 | 故事式 MBTI 性格测试（24 次抉择 → 16 型人格） | ~8 分钟 |
| 卷二 | 五行医馆 | 中医五行行医经营（相生相克配伍 → 体质判定） | ~10 分钟 |
| 卷三 | 一念飞升 | 快节奏修仙 Roguelite（九境天劫 → 转世传承） | ~5 分钟 / 世 |

## 本地运行

不需要构建。任选一种：

```powershell
# 1) 直接双击 index.html（file:// 也能玩）

# 2) 起个本地静态服务器（推荐，行为与线上一致）
python -m http.server 8080
# 然后打开 http://127.0.0.1:8080
```

## 部署到 GitHub Pages

仓库已经包含 `.github/workflows/pages.yml`，推到 `main` 后会自动发布：

1. 新建仓库（例如 `inkwash-arcade`），推上来：
   ```powershell
   git remote add origin https://github.com/<你的用户名>/inkwash-arcade.git
   git push -u origin main
   ```
2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
3. 等 Actions 跑完，访问 `https://<你的用户名>.github.io/inkwash-arcade/`。

> 也可以不用 Actions：把 Source 设成 `Deploy from a branch` → `main` / `/ (root)`，效果一样。

## 目录结构

```
.
├─ index.html            大厅（三卷入口）
├─ mbti.html             卷一 · 问心局
├─ wuxing.html           卷二 · 五行医馆
├─ xiuxian.html          卷三 · 一念飞升
├─ assets/
│  ├─ theme.css          共享设计令牌与组件
│  └─ common.js          共享工具（存储、随机、toast、顶栏）
└─ .github/workflows/pages.yml
```

三个游戏页彼此独立，删掉任意两个也能正常运行。所有文案、题库、药材、境界都在各页面的配置对象中，改完刷新即生效。

## 存档

进度写在浏览器 `localStorage`，键名统一以 `inkwash.` 开头：

- `inkwash.mbti.progress` / `inkwash.mbti.result`
- `inkwash.wuxing.save` / `inkwash.wuxing.records`
- `inkwash.xiuxian.save` / `inkwash.xiuxian.legacy`
- `inkwash.hub`（大厅里的玩过标记）

## 授权

MIT。素材全部为内联 SVG / CSS 绘制，无第三方图片与字体文件。
