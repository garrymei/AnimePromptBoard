# 🎨 Anime Prompt Board — Electron 桌面版

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/garrymei/AnimePromptBoard)
[![Electron](https://img.shields.io/badge/electron-31.3.1-9feaf9.svg)](https://www.electronjs.org/)

本地运行的二次元提示词管理工具，无需登录，数据完全保存在本机。专为 AI 绘画爱好者设计，支持 8 大类别提示词的智能分类和管理。

## ✨ 主要功能

### 📤 智能导入
- **图片上传**：支持拖拽和多选上传（PNG, JPG, JPEG, WebP）
- **提示词解析**：智能识别 8 大类别提示词文本
- **自动分类**：正则匹配自动将提示词分类到对应类别

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
- **编辑功能**：在线编辑提示词、管理标签
- **一键复制**：单类或全部英文提示词复制
- **数据管理**：导入/导出 JSON、打开数据目录
- **分页展示**：高效浏览大量条目

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

### 使用方法

1. **导入图片**：
   - 点击"选择图片"选项卡
   - 拖拽或选择你的图片文件

2. **输入提示词**：
   - 点击"输入提示词"选项卡
   - 粘贴格式化的 8 类提示词文本

3. **自动分类**：
   - 系统自动识别分类标签
   - 实时预览分类结果

4. **管理条目**：
   - 填写标题和标签
   - 点击"导入条目"完成添加
   - 使用编辑功能修改内容

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

## 🔧 技术架构

- **主进程** (`main.js`): Electron 主进程，处理文件系统、IPC 通信
- **预加载脚本** (`preload.js`): 安全的 API 桥接层
- **渲染进程** (`renderer/`): 前端界面，基于原生 HTML/CSS/JS

### IPC 接口
- `entries:list` - 获取条目列表
- `entries:save` - 保存条目数据
- `media:saveDataURL` - 保存图片文件
- `resolve:mediaURL` - 解析媒体文件路径
- `export:json` - 导出 JSON 数据
- `import:json` - 导入 JSON 数据
- `open:userData` - 打开数据目录

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

**🌟 如果这个项目对你有帮助，请给个 Star！**
