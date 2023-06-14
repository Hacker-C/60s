# 60s API

每天 60 秒读懂世界 API，但是不止 60s。
- `/60s`：每天 60 秒读懂世界
- `/history`：历史上的今天大事件

## 开发

### 环境准备

- 下载 [deno](https://deno.land/manual@v1.28.3/getting_started/installation)，配置 `.vscode/settings.json` 中的 `'deno.path'` 为你的环境
- 下载 VS Code 插件：[Deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)

### 运行

- 运行：
  ```bash
  deno run --watch --allow-net main.ts`
  # 或者
  make run
  ```
- 接口：
  - `/60s`：每天 60 秒读懂世界
  - `/history`：历史上的今天大事件
- 注意：若要配合前端使用，则修改 `config.ts` 中的 `env`，以解决跨域问题
- 使用示例：https://github.com/hacker-c/60s-view

## 部署

- 推荐使用 [deno.dev](https://deno.dev)（免费）
- 注意：部署之后，访问出错，或者结果不对，请科学上网再试！

## 致谢

- 60s 的数据抓取接口来自 [这篇文章](https://viki.moe/60s/)，其他接口可参考编写。
