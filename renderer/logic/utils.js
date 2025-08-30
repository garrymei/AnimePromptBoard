// 工具函数模块
// @ts-check

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 转义HTML字符
 * @param {string} text 要转义的文本
 * @returns {string} 转义后的文本
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 复制文本到剪贴板
 * @param {string} text 要复制的文本
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('复制失败:', err);
    return false;
  }
}

/**
 * 文件转换为DataURL
 * @param {File} file 文件对象
 * @returns {Promise<string>} DataURL字符串
 */
export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 生成缩略图
 * @param {string} dataUrl 原图DataURL
 * @param {number} maxSize 最大尺寸
 * @returns {Promise<string>} 缩略图DataURL
 */
export function generateThumbnail(dataUrl, maxSize = 512) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 计算缩略图尺寸，保持宽高比
      let { width, height } = img;
      if (width > height) {
        if (width > maxSize) {
          height = height * (maxSize / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = width * (maxSize / height);
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUrl;
  });
}

/**
 * 创建占位图片
 * @param {string} text 占位文本
 * @returns {string} SVG DataURL
 */
export function createPlaceholderImage(text) {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f9fa"/>
      <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#6c757d" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `)}`;
}

/**
 * 显示消息提示
 * @param {string} message 消息内容
 * @param {string} type 消息类型 (success|warning|error)
 */
export function showMessage(message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 14px;
    max-width: 300px;
    word-wrap: break-word;
    background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#dc3545'};
  `;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}
