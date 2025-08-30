// 提示词解析模块
// @ts-check

/**
 * @typedef {import('../../types.d.ts').ParseResult} ParseResult
 * @typedef {import('../../types.d.ts').CategoryMapping} CategoryMapping
 */

// 8大类别映射（用于正则匹配）
export const categoryMapping = {
  'base_styles': {
    patterns: [/\[Base\s+Styles?\s*\/?\s*基础风格?\]/, /\[基础风格\s*\/?\s*Base\s+Styles?\]/],
    key: 'base_styles',
    name: '🎨 基础风格 (Base Styles)',
    zhName: '基础风格'
  },
  'artistic_styles': {
    patterns: [/\[Art(?:istic)?\s+Styles?\s*\/?\s*(?:艺术风格|画风表现)?\]/, /\[(?:艺术风格|画风表现)\s*\/?\s*Art(?:istic)?\s+Styles?\]/],
    key: 'artistic_styles',
    name: '🖌️ 艺术风格 (Artistic Styles)',
    zhName: '艺术风格'
  },
    'cinematic': {
    patterns: [
      /\[Cinematography?\s*\/?\s*镜头语言?\]/, 
      /\[镜头语言\s*\/?\s*Cinematography?\]/, 
      /\[Cinematography?\s*\/?\s*摄影感?\]/, 
      /\[摄影感\s*\/?\s*Cinematography?\]/, 
      /\[Cinematic\s*\/?\s*镜头语言?\]/, 
      /\[镜头语言\s*\/?\s*Cinematic\]/,
      /\[Cinematic\s*\/?\s*摄影感?\]/, 
      /\[摄影感\s*\/?\s*Cinematic\]/,
      /\[Cinematic\s*\/\s*摄影感\]/,
      /\[摄影感\s*\/\s*Cinematic\]/
    ],
    key: 'cinematic',
    name: '🎬 镜头语言 (Cinematic)', 
    zhName: '镜头语言'
  },
  'lighting_mood': {
    patterns: [/\[Lighting\s*(?:&|\+)?\s*Mood\s*\/?\s*光影氛围?\]/, /\[光影氛围\s*\/?\s*Lighting\s*(?:&|\+)?\s*Mood\]/],
    key: 'lighting_mood',
    name: '💡 光影氛围 (Lighting & Mood)',
    zhName: '光影氛围'
  },
  'theme_styles': {
    patterns: [/\[Theme\s+Styles?\s*\/?\s*主题风格?\]/, /\[主题风格\s*\/?\s*Theme\s+Styles?\]/],
    key: 'theme_styles',
    name: '🌟 主题风格 (Theme Styles)',
    zhName: '主题风格'
  },
  'rendering': {
    patterns: [
      /\[Rendering\s*\/?\s*渲染技?术?\]/, 
      /\[渲染技?术?\s*\/?\s*Rendering\]/, 
      /\[Rendering\s*\/\s*渲染技术\]/,
      /\[渲染技术\s*\/\s*Rendering\]/
    ],
    key: 'rendering',
    name: '🖥️ 渲染技术 (Rendering)',
    zhName: '渲染技术'
  },
  'effects': {
    patterns: [
      /\[Effects?\s*\/?\s*特效元?素?\]/, 
      /\[特效元?素?\s*\/?\s*Effects?\]/, 
      /\[Effects\s*\/\s*特效元素\]/,
      /\[特效元素\s*\/\s*Effects\]/
    ],
    key: 'effects',
    name: '✨ 特效元素 (Effects)',
    zhName: '特效元素'
  },
  'typography': {
    patterns: [
      /\[Overlays?\s*\/?\s*叠加层?\]/,
      /\[叠加层\s*\/?\s*Overlays?\]/,
      /\[Typography\s*(?:&|\+|\s)?\s*Overlay\s*\/?\s*文字与装饰?\]/,
      /\[文字与装饰\s*\/?\s*Typography\s*(?:&|\+|\s)?\s*Overlay\]/,
      /\[Typography\s*\/?\s*文字与装饰?\]/,
      /\[文字与装饰\s*\/?\s*Typography\]/
    ],
    key: 'typography',
    name: '🔤 文字与装饰 (Typography)',
    zhName: '文字与装饰'
  }
};

/**
 * 解析提示词文本
 * @param {string} text 原始文本
 * @returns {ParseResult} 解析结果
 */
export function parsePromptText(text) {
  console.log('解析原始文本:', text);
  const result = {};

  // 为每个类别初始化空结构
  Object.keys(categoryMapping).forEach(key => {
    result[key] = { en: '', zh: '' };
  });

  // 先尝试智能分割混合内容
  text = preprocessMixedContent(text);

  // 按主要分类标题分割文本
  const lines = text.split('\n');
  let currentCategory = null;
  let currentContent = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // 检查是否是主分类标题
    let foundCategory = null;
    for (const [key, mapping] of Object.entries(categoryMapping)) {
      for (const pattern of mapping.patterns) {
        if (pattern.test(line)) {
          foundCategory = key;
          console.log(`找到类别 ${key}:`, line);
          break;
        }
      }
      if (foundCategory) break;
    }

    if (foundCategory) {
      // 保存之前的分类内容
      if (currentCategory && currentContent.length > 0) {
        let content = currentContent.join(', ');
        content = cleanNestedCategories(content);
        if (content.trim()) {
          // 直接分配到当前类别
          result[currentCategory].en = content;
          console.log(`分配到 ${currentCategory}:`, content);
        }
      }

      // 开始新的分类
      currentCategory = foundCategory;
      currentContent = [];
    } else if (currentCategory) {
      // 添加到当前分类
      currentContent.push(line);
    }
  }

  // 保存最后一个分类
  if (currentCategory && currentContent.length > 0) {
    let content = currentContent.join(', ');
    content = cleanNestedCategories(content);
    if (content.trim()) {
      result[currentCategory].en = content;
      console.log(`分配到 ${currentCategory}:`, content);
    }
  }

  console.log('解析结果:', result);
  return result;
}

/**
 * 预处理混合内容
 * @param {string} text 原始文本
 * @returns {string} 处理后的文本
 */
function preprocessMixedContent(text) {
  let processed = text;

  // 检测混合的类别标记模式，并自动分行
  const mixedPatterns = [
    { pattern: /(\[Lighting\s*[&+]?\s*Mood[^\]]*\])/gi, category: '[Lighting & Mood / 光影氛围]' },
    { pattern: /(\[Rendering[^\]]*\])/gi, category: '[Rendering / 渲染技术]' },
    { pattern: /(\[Effects?[^\]]*\])/gi, category: '[Effects / 特效元素]' },
    { pattern: /(\[Typography[^\]]*\])/gi, category: '[Typography / 文字与装饰]' },
    { pattern: /(\[Theme\s+Styles?[^\]]*\])/gi, category: '[Theme Styles / 主题风格]' }
  ];

  mixedPatterns.forEach(({ pattern, category }) => {
    processed = processed.replace(pattern, `\n${category}\n`);
  });

  return processed;
}

/**
 * 清理嵌套的类别标记
 * @param {string} text 原始文本
 * @returns {string} 清理后的文本
 */
function cleanNestedCategories(text) {
  let cleaned = text;

  // 更全面的类别标记模式
  const categoryPatterns = [
    // 英文类别标记
    /\[Base\s+Styles?\s*[\/\|]?\s*[^\]]*\]/gi,
    /\[Art(?:istic)?\s+Styles?\s*[\/\|]?\s*[^\]]*\]/gi,
    /\[Cinematic(?:ography)?\s*[\/\|]?\s*[^\]]*\]/gi,
    /\[Lighting\s*(?:&|\+|\s)?\s*Mood\s*[\/\|]?\s*[^\]]*\]/gi,
    /\[Theme\s+Styles?\s*[\/\|]?\s*[^\]]*\]/gi,
    /\[Rendering\s*[\/\|]?\s*[^\]]*\]/gi,
    /\[Effects?\s*[\/\|]?\s*[^\]]*\]/gi,
    /\[Typography\s*(?:&|\+|\s)?\s*Overlay\s*[\/\|]?\s*[^\]]*\]/gi,
    /\[Overlay\s*[\/\|]?\s*[^\]]*\]/gi,

    // 中文类别标记
    /\[[^\]]*基础风格[^\]]*\]/gi,
    /\[[^\]]*艺术风格[^\]]*\]/gi,
    /\[[^\]]*画风表现[^\]]*\]/gi,
    /\[[^\]]*镜头语言[^\]]*\]/gi,
    /\[[^\]]*摄影感[^\]]*\]/gi,
    /\[[^\]]*光影氛围[^\]]*\]/gi,
    /\[[^\]]*光照效果[^\]]*\]/gi,
    /\[[^\]]*主题风格[^\]]*\]/gi,
    /\[[^\]]*主题[^\]]*\]/gi,
    /\[[^\]]*渲染技术[^\]]*\]/gi,
    /\[[^\]]*渲染[^\]]*\]/gi,
    /\[[^\]]*特效元素[^\]]*\]/gi,
    /\[[^\]]*特效[^\]]*\]/gi,
    /\[[^\]]*文字[^\]]*装饰[^\]]*\]/gi,
    /\[[^\]]*文字[^\]]*\]/gi,
    /\[[^\]]*装饰[^\]]*\]/gi,
    /\[[^\]]*叠加层[^\]]*\]/gi,

    // 混合模式的标记（英文/中文）
    /\[[^\/\]]*\/[^\/\]]*\]/gi,

    // 通用方括号标记（最后清理剩余的）
    /\[[A-Za-z\s&+\/\|\u4e00-\u9fff]*\]/gi
  ];

  categoryPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });

  // 多轮清理，确保彻底移除
  let prevLength = 0;
  while (cleaned.length !== prevLength) {
    prevLength = cleaned.length;
    cleaned = cleaned.replace(/\[[^\]]*\]/gi, ''); // 清理任何剩余的方括号
  }

  // 清理多余的逗号、空格和特殊字符
  cleaned = cleaned
    .replace(/,\s*,+/g, ',')           // 多个逗号合并
    .replace(/^\s*,+\s*/, '')         // 开头的逗号
    .replace(/\s*,+\s*$/, '')         // 结尾的逗号
    .replace(/\s+/g, ' ')             // 多个空格合并
    .trim();

  return cleaned;
}

/**
 * 生成示例文本
 * @returns {string} 示例文本
 */
export function getSampleText() {
  return `[Base Styles / 基础风格]
anime style, bishoujo character, elegant silhouette

[Artistic Styles / 艺术风格]
cel shading, manga lineart, vibrant pastel tones

[Cinematic / 镜头语言]
cinematic composition, dynamic action shot, ultra-realistic rim lighting

[Lighting & Mood / 光影氛围]
glowing pastel light, soft bloom effect, moonlit atmosphere

[Theme Styles / 主题风格]
fantasy Japanese setting, traditional haori fluttering, supernatural battle theme

[Rendering / 渲染技术]
hyper-detailed, 8K resolution, subsurface scattering for skin

[Effects / 特效元素]
floating cherry blossoms, glowing energy ribbons, heart-shaped sparks

[Typography & Overlay / 文字与装饰]
calligraphic kanji overlay, dissolving brushstroke text, flowing mist captions`;
}

/**
 * 校验提示词解析结果
 * @param {Object} prompts 解析后的提示词对象
 * @returns {Object} 校验结果
 */
export function validatePrompts(prompts) {
  const result = {
    isValid: true,
    isEmpty: false,
    missingCategories: [],
    hasContent: false
  };

  // 检查是否有任何有效内容
  let totalContentLength = 0;
  const missingCategories = [];

  Object.keys(categoryMapping).forEach(key => {
    const prompt = prompts[key];
    if (prompt && prompt.en && prompt.en.trim()) {
      totalContentLength += prompt.en.trim().length;
      result.hasContent = true;
    } else {
      missingCategories.push(key);
    }
  });

  // 判断是否完全为空
  if (totalContentLength === 0) {
    result.isEmpty = true;
    result.isValid = false;
  }
  // 判断是否有缺失类别（但不是全空）
  else if (missingCategories.length > 0) {
    result.missingCategories = missingCategories;
    result.isValid = false; // 需要用户确认
  }

  console.log('提示词校验结果:', {
    totalContentLength,
    missingCount: missingCategories.length,
    result
  });

  return result;
}
