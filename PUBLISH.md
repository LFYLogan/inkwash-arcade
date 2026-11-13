# 发布到 GitHub Pages

仓库已经包含 `.github/workflows/pages.yml`，所以最省事的路径是「推上去 → 设置里点一下」。

## 方式一：GitHub Actions（推荐，本仓库默认）

```powershell
git remote add origin https://github.com/<你的用户名>/inkwash-arcade.git
git push -u origin main
```

然后：仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
首次推送会自动触发 `Deploy static site to Pages`，约 30–60 秒后可访问：

```
https://<你的用户名>.github.io/inkwash-arcade/
```

后续每次 `git push` 到 `main` 都会自动重新发布。

## 方式二：直接从分支发布（不用 Actions）

**Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save**。
纯静态站点不需要构建步骤，两种方式结果等价。

## 方式三：自己机器上先看

```powershell
# 任选其一
python -m http.server 8080
npx serve .
```

打开 `http://127.0.0.1:8080`。

## 用 API 一步做完（可选）

如果你有 `gh` CLI：

```powershell
gh repo create inkwash-arcade --public --source . --push
gh api -X POST repos/{owner}/inkwash-arcade/pages -f build_type=workflow
```

没有 `gh` 的话，用 `curl`/`Invoke-RestMethod` 调同一套 REST 接口也可以：

1. `POST /user/repos`（body: `{"name":"inkwash-arcade","private":false}`）
2. `git push`
3. `POST /repos/<owner>/inkwash-arcade/pages`（body: `{"build_type":"workflow"}`）

## 常见问题

- **404 但 Actions 是绿的**：Pages 首次启用后要等 1–2 分钟；确认 `Settings → Pages` 里显示的地址和你访问的一致。
- **样式全丢**：资源用的是相对路径 `./assets/...`，确保访问的是仓库根目录下的 `index.html`，不要挂在子路径里当子项目。
- **想加自定义域名**：`Settings → Pages → Custom domain`，同时在根目录放一个 `CNAME` 文件，内容是你的域名。
