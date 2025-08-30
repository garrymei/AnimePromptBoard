// 数据存储与管理模块
// @ts-check

/**
 * @typedef {import('../../types.d.ts').Entry} Entry
 */

let saveTimeout;

/**
 * 防抖保存条目
 * @param {Entry[]} entries 条目数组
 * @param {number} delay 延迟时间
 */
export async function saveEntriesDebounced(entries, delay = 500) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await window.api.saveEntries(entries);
      console.log('Entries saved (debounced)');
    } catch (error) {
      console.error('Failed to save entries:', error);
    }
  }, delay);
}

/**
 * 立即保存条目
 * @param {Entry[]} entries 条目数组
 */
export async function saveEntries(entries) {
  try {
    await window.api.saveEntries(entries);
  } catch (error) {
    console.error('Failed to save entries:', error);
    throw error;
  }
}

/**
 * 加载条目
 * @returns {Promise<Entry[]>} 条目数组
 */
export async function loadEntries() {
  try {
    const data = await window.api.listEntries();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to load entries:', error);
    return [];
  }
}

/**
 * 解析图片路径
 * @param {string} imagePath 图片路径
 * @returns {Promise<string>} 解析后的URL
 */
export async function resolveImagePath(imagePath) {
  if (imagePath.startsWith('file://') || imagePath.startsWith('data:') || imagePath.startsWith('http')) {
    return imagePath;
  }

  // 如果是相对路径（如 media/xxx.png），需要通过 API 解析为绝对路径
  if (imagePath.startsWith('media/')) {
    try {
      const result = await window.api.resolveMediaURL(imagePath);
      if (result.ok) {
        return result.url;
      }
    } catch (error) {
      console.error('Failed to resolve media path:', error);
    }
  }

  return imagePath;
}

/**
 * 保存媒体文件
 * @param {string} dataUrl 图片DataURL
 * @param {string} filenameBase 文件名基础部分
 * @param {string} [thumbnail] 缩略图DataURL
 */
export async function saveMediaFile(dataUrl, filenameBase, thumbnail) {
  try {
    const result = await window.api.saveMediaDataURL({
      dataUrl,
      filenameBase,
      thumbnail
    });

    if (!result.ok) {
      throw new Error(result.error || '保存失败');
    }

    return result;
  } catch (error) {
    console.error('Save media error:', error);
    throw error;
  }
}

/**
 * 检查文件是否重复
 * @param {File} file 文件对象
 * @param {Entry[]} entries 现有条目
 * @returns {boolean} 是否重复
 */
export function checkDuplicateFile(file, entries) {
  const fileKey = `${file.name}_${file.size}`;
  return entries.some(entry => entry.fileKey === fileKey);
}

/**
 * 导出数据
 * @param {Entry[]} entries 条目数组
 */
export async function exportData(entries) {
  try {
    const result = await window.api.exportJSON(entries);
    return result;
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * 导入数据
 */
export async function importData() {
  try {
    const result = await window.api.importJSON();
    return result;
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}
