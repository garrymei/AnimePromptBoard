# 🧩 Anime Prompt Board — Electron 桌面版

本地运行的二次元提示词管理工具（macOS / Windows / Linux），无需登录，数据完全保存在本机。

## 功能
- 图片上传 & 管理
- 8 大类别提示词（英文+中文对照）
- 标签系统（多标签、搜索过滤）
- 模糊搜索（标题/标签/提示词）
- 分页列表展示
- 一键复制提示词（单类或全部英文）
- 导入 / 导出 JSON
- 数据路径：
  - macOS: `~/Library/Application Support/Anime Prompt Board`
  - Windows: `%AppData%/Anime Prompt Board`

## 开发运行
```bash
npm install
npm start
```

## 打包（生成 .dmg / .exe）
```bash
npm run mac   # macOS
npm run win   # Windows
npm run linux # Linux
```

---
