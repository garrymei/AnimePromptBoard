# 🎨 Anime Prompt Board — Electron 桌面版

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/garrymei/AnimePromptBoard)
[![Electron](https://img.shields.io/badge/electron-31.3.1-9feaf9.svg)](https://www.electronjs.org/)

本地运行的二次元提示词管理工具，无需登录，数据完全保存在本机。专为 AI 绘画爱好者设计，支持 8 大类别提示词的智能分类和管理。

> 🎯 **新手友好**：5分钟即可上手，从导入到使用全程无障碍
> 
> 🚀 **性能优化**：智能缩略图、防抖保存、错误容错
> 
> 🔒 **安全稳定**：原子写入、路径隔离、跨设备同步

## ✨ 主要功能

### 📤 智能导入
- **图片上传**：支持拖拽和多选上传（PNG, JPG, JPEG, WebP）
- **缩略图生成**：自动生成512px缩略图，提升列表滚动性能
- **重复检测**：智能检测重复文件，支持创建副本
- **提示词解析**：智能识别 8 大类别提示词文本
- **批量处理**：支持多文件同时导入，单文件失败不影响其他

### 🎯 8 大提示词类别
- 🎨 **基础风格** (Base Styles) - 动漫风格、角色类型等
- 🖌️ **画风表现** (Artistic Styles) - 赛璐璐、线稿风格等  
- 🎬 **摄影感** (Cinematic) - 构图、镜头角度等
- 💡 **光影氛围** (Lighting & Mood) - 光线效果、情绪氛围
- 🏮 **主题风格** (Theme Styles) - 场景主题、背景设定
- ⚙️ **渲染技术** (Rendering) - 分辨率、渲染质量等
- ✨ **特效元素** (Effects) - 特殊效果、粒子等
- 📝 **文字装饰** (Typography & Overlay) - 文字叠加等

### 🛠️ 强大功能
- **标签系统**：多标签管理、智能过滤
- **模糊搜索**：支持标题、标签、提示词内容搜索
- **编辑功能**：在线编辑提示词、管理标签、智能翻译
- **一键复制**：单类或全部英文提示词复制
- **快捷键支持**：Esc关闭、Ctrl+F搜索、Enter复制
- **错误容错**：友好的错误提示，图片加载失败显示占位符
- **数据管理**：导入/导出 JSON、打开数据目录
- **分页展示**：高效浏览大量条目，支持懒加载

## 🚀 快速开始

### 开发环境
```bash
# 克隆项目
git clone https://github.com/garrymei/AnimePromptBoard.git
cd AnimePromptBoard

# 安装依赖
npm install

# 启动开发版本
npm start
```

### 📖 完整使用流程（5分钟快速上手）

#### 第一步：选择数据目录（可选）
```
💡 新用户建议先跳过此步，使用默认目录即可
```
- 如需多设备同步，点击界面顶部"选择数据目录"
- 选择你的 Google Drive 或其他云盘同步目录
- 应用会自动创建 `data/` 和 `media/` 子目录

#### 第二步：导入第一个作品
1. **拖拽图片**：直接将图片拖到应用界面（支持多文件）
2. **填写信息**：
   - 标题：`可爱二次元女孩肖像`
   - 标签：点击输入框添加 `二次元` `肖像` 等标签
3. **输入提示词**：点击"📝 填入示例"按钮查看格式，或粘贴你的8类提示词
4. **确认导入**：点击"导入"按钮完成

#### 第三步：管理和使用
- **浏览作品**：在主界面网格中查看缩略图
- **查看详情**：点击任意图片打开详情面板
- **编辑内容**：在详情面板中修改提示词和标签
- **复制使用**：
  - 单类复制：点击对应类别的"📋 复制此类"
  - 全部复制：点击详情面板底部的"📋 复制全部英文提示词"
- **搜索过滤**：使用顶部搜索框查找特定内容

#### 第四步：数据管理
- **导出备份**：点击"导出JSON"保存数据备份
- **导入数据**：点击"导入JSON"恢复或合并数据
- **查看文件**：点击"打开数据目录"查看原始文件

### 🖼️ 界面预览
```
主界面：
┌─────────────────────────────────────────────────────┐
│ 🔍 搜索框    [选择数据目录] [导入JSON] [导出JSON]     │
├─────────────────────────────────────────────────────┤
│ 📊 总计：5个作品  当前：5个  第1页，共1页            │
├─────────────────────────────────────────────────────┤
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                    │
│  │缩略│ │缩略│ │缩略│ │缩略│ │缩略│   ← 图片网格      │
│  │图1│ │图2│ │图3│ │图4│ │图5│                    │
│  └───┘ └───┘ └───┘ └───┘ └───┘                    │
│                                                     │
│  [添加数据] [批量导入]                              │
└─────────────────────────────────────────────────────┘

详情面板：
┌─────────────────────────────────────────────────────┐
│ ✖️ 关闭                                            │
│ ┌─────────────┐  标题：可爱二次元女孩              │
│ │             │  标签：[二次元] [肖像] [+]         │
│ │   原图展示   │                                   │
│ │             │  🎨 基础风格  📋复制 🌏翻译         │
│ │             │  ▼ anime, 1girl, beautiful...     │
│ └─────────────┘                                     │
│                  🖌️ 艺术风格  📋复制 🌏翻译         │
│                  ▼ digital art, cel shading...    │
│                                                     │
│                  ... (其他6个类别)                  │
│                                                     │
│  [💾 保存] [🗑️ 删除] [📋 复制全部英文提示词]        │
└─────────────────────────────────────────────────────┘
```

### 提示词格式示例
```
[Base Styles / 基础风格]
anime style, bishoujo character, Demon Slayer illustration

[Artistic Styles / 画风表现]
cel shading, manga lineart, vibrant pastel tones

[Cinematic / 摄影感]
cinematic composition, dynamic action shot, ultra-realistic rim lighting

[Lighting & Mood / 光影氛围]
glowing pastel light, soft bloom effect, moonlit battlefield atmosphere

[Theme Styles / 主题风格]
fantasy Japanese setting, traditional haori fluttering, supernatural battle theme

[Rendering / 渲染技术]
hyper-detailed, 8K resolution, subsurface scattering for skin

[Effects / 特效元素]
floating cherry blossoms, glowing energy ribbons, heart-shaped sparks

[Typography & Overlay / 文字与装饰]
calligraphic kanji overlay 「恋の呼吸」, dissolving brushstroke text
```

## 📦 打包发布

```bash
# 构建 macOS 版本
npm run mac

# 构建 Windows 版本  
npm run win

# 构建 Linux 版本
npm run linux
```

构建完成后，安装包将在 `dist/` 目录中生成。

## 💾 数据存储

应用数据存储在系统用户目录下：

- **macOS**: `~/Library/Application Support/Anime Prompt Board`
- **Windows**: `%AppData%/Anime Prompt Board`
- **Linux**: `~/.config/Anime Prompt Board`

目录结构：
```
Anime Prompt Board/
├── data/
│   └── entries.json    # 条目数据
└── media/              # 图片文件
    ├── img_xxx.jpg
    └── img_xxx.png
```

## 📁 选择数据目录（推荐 Google Drive）

### 默认使用
第一次安装可直接使用默认目录（userData），无需额外配置。

### 多设备共享设置
若要在多设备间共享数据，可设置自定义数据目录：

1. **选择云盘目录**：
   - 点击界面上的"选择数据目录"按钮
   - 选择你的 Google Drive 同步文件夹（例如 `G:\AnimePromptBoard`）
   - 也可选择其他云盘服务的同步目录

2. **数据同步机制**：
   - `entries.json` 内仅保存相对路径（如 `media/xxx.jpg`）
   - 不同设备的绝对路径无关，确保跨平台兼容
   - 所有图片和数据文件都会保存到选定的目录

3. **⚠️ 注意事项**：
   - **避免多机同时编辑**，防止同步冲突导致数据丢失
   - 建议在一台设备上完成编辑后，等待云盘同步完成再在其他设备使用
   - 首次设置后建议重启应用以确保所有功能正常工作

## 🔧 技术架构

### 核心组件
- **主进程** (`main.js`): Electron 主进程，处理文件系统、IPC 通信
- **数据管理** (`dataRoot.js`): 数据目录抽象、原子写入、设置管理
- **预加载脚本** (`preload.js`): 安全的 API 桥接层，contextIsolation隔离
- **渲染进程** (`renderer/`): 前端界面，基于原生 HTML/CSS/JS

### 模块化结构
```
renderer/
├── ui/
│   └── components.js      # UI组件（卡片、分页、标签等）
├── logic/
│   ├── utils.js          # 工具函数（防抖、文件处理等）
│   ├── storage.js        # 数据存储（防抖保存、路径解析）
│   ├── parser.js         # 提示词解析器
│   ├── translator.js     # AI提示词翻译器
│   └── errorHandler.js   # 错误处理与容错
├── app.js               # 模块化主入口（可选）
└── index.html           # 传统单文件入口
```

### 安全特性
- **CSP保护**: 内容安全策略防止XSS攻击
- **路径隔离**: 严格验证媒体文件路径，拒绝`../`路径穿越
- **原子写入**: 使用`.tmp`文件避免写入冲突
- **上下文隔离**: `contextIsolation: true`，`nodeIntegration: false`

### IPC 接口
- `entries:list` - 获取条目列表
- `entries:save` - 保存条目数据  
- `media:saveDataURL` - 保存图片文件（支持缩略图）
- `resolve:mediaURL` - 解析媒体文件路径（支持thumbs/）
- `export:json` - 导出 JSON 数据
- `import:json` - 导入 JSON 数据
- `open:userData` - 打开数据目录
- `settings:get` - 获取应用设置
- `settings:setDataRoot` - 设置数据根目录
- `dialog:chooseDir` - 打开目录选择对话框

## 🛠️ 开发者工具

### 代码质量
```bash
# 运行 ESLint 检查
npm run lint

# 自动修复代码风格
npm run lint:fix

# 格式化代码
npm run format

# 检查格式
npm run format:check
```

### 类型支持
项目包含 TypeScript 类型定义文件 (`types.d.ts`)，在支持的编辑器中可获得：
- 智能代码补全
- 类型检查
- 接口文档提示

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

**🌟 如果这个项目对你有帮助，请给个 Star！**
