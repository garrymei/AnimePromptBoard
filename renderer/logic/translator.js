// 提示词翻译模块
// @ts-check

// AI提示词专用翻译词典
const aiPromptTranslations = {
  // 基础词汇
  'anime': '动漫', 'manga': '漫画', 'illustration': '插画', 'digital art': '数字艺术',
  'masterpiece': '杰作', 'high quality': '高质量', 'detailed': '细致的', 'hyper-detailed': '超详细的',
  'beautiful': '美丽的', 'elegant': '优雅的', 'cute': '可爱的', 'kawaii': '萌系',

  // 人物相关
  '1girl': '一个女孩', '1boy': '一个男孩', 'bishoujo': '美少女', 'bishonen': '美少年',
  'character': '角色', 'silhouette': '剪影', 'portrait': '肖像', 'face': '面部',

  // 艺术风格
  'cel shading': '赛璐珞渲染', 'lineart': '线稿', 'painting': '绘画', 'sketch': '素描',
  'watercolor': '水彩', 'pastel': '粉彩', 'vibrant': '鲜艳的', 'tones': '色调',
  'soft': '柔和的', 'warm colors': '暖色调', 'cool colors': '冷色调',

  // 镜头和构图
  'cinematic': '电影级的', 'composition': '构图', 'shot': '镜头', 'close-up': '特写',
  'wide shot': '远景', 'panoramic': '全景', 'angle': '角度', 'perspective': '透视',
  'framing': '画面构图', 'camera': '摄像机', 'dynamic action': '动态动作',

  // 光照和氛围
  'lighting': '光照', 'light': '光线', 'glow': '发光', 'bloom': '光晕效果',
  'rim lighting': '边缘光', 'moonlit': '月光照射的', 'sunlit': '阳光照射的',
  'atmosphere': '氛围', 'mood': '情调', 'ultra-realistic': '超现实的',
  'golden hour': '黄金时间', 'sunset': '日落', 'glowing': '发光的',

  // 主题风格
  'fantasy': '奇幻', 'japanese': '日式', 'setting': '背景设定', 'theme': '主题',
  'traditional': '传统的', 'supernatural': '超自然的', 'battle': '战斗',
  'haori': '羽织', 'fluttering': '飘动的', 'peaceful': '宁静的', 'serene': '安详的',

  // 渲染技术
  'rendering': '渲染', '4k': '4K分辨率', '8k': '8K分辨率', 'resolution': '分辨率',
  'quality': '质量', 'subsurface scattering': '次表面散射', 'skin': '皮肤',
  'realistic': '现实的', 'photorealistic': '照片级现实',

  // 特效元素
  'floating': '漂浮的', 'sparks': '火花', 'particles': '粒子', 'cherry blossoms': '樱花',
  'energy': '能量', 'ribbons': '丝带', 'heart-shaped': '心形的', 'effects': '特效',
  'magical': '魔法的', 'sparkles': '闪烁', 'aura': '光环', 'misty': '薄雾的',
  'atmospheric': '大气感的', 'depth of field': '景深', 'bokeh': '散景',

  // 文字装饰
  'kanji': '汉字', 'text': '文字', 'overlay': '叠加层', 'calligraphic': '书法的',
  'brushstroke': '笔触', 'caption': '字幕', 'typography': '文字排版',
  'font': '字体', 'dissolving': '消散的', 'flowing': '流动的', 'mist': '雾气',
  'lens flare': '镜头光晕',

  // 常用修饰词
  'style': '风格', 'effect': '效果', 'scene': '场景', 'background': '背景',
  'foreground': '前景', 'texture': '纹理', 'pattern': '图案', 'design': '设计'
};

/**
 * 翻译单个提示词文本
 * @param {string} englishText 英文文本
 * @returns {string} 中文翻译
 */
export function translatePromptText(englishText) {
  if (!englishText || !englishText.trim()) return '';

  let result = englishText.toLowerCase();

  // 按词典进行替换（优先长词组）
  const sortedTerms = Object.keys(aiPromptTranslations).sort((a, b) => b.length - a.length);

  for (const term of sortedTerms) {
    const translation = aiPromptTranslations[term];
    // 使用单词边界匹配，避免部分匹配
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, translation);
  }

  // 清理和格式化
  result = result
    .split(',')
    .map(part => part.trim())
    .filter(part => part)
    .join('，');

  return result;
}
