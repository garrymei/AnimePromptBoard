// 错误处理与兜底模块
// @ts-check

import { showMessage } from './utils.js';

/**
 * 错误类型枚举
 */
export const ErrorTypes = {
  NETWORK: 'network',
  FILE_IO: 'file_io',
  PARSE: 'parse',
  VALIDATION: 'validation',
  PERMISSION: 'permission'
};

/**
 * 错误处理器
 * @param {Error} error 错误对象
 * @param {string} context 错误上下文
 * @param {string} type 错误类型
 */
export function handleError(error, context = '操作', type = ErrorTypes.NETWORK) {
  console.error(`${context} 错误:`, error);

  let userMessage = '';

  switch (type) {
  case ErrorTypes.FILE_IO:
    userMessage = getFileIOErrorMessage(error, context);
    break;
  case ErrorTypes.PARSE:
    userMessage = getParseErrorMessage(error, context);
    break;
  case ErrorTypes.VALIDATION:
    userMessage = getValidationErrorMessage(error, context);
    break;
  case ErrorTypes.PERMISSION:
    userMessage = getPermissionErrorMessage(error, context);
    break;
  default:
    userMessage = getNetworkErrorMessage(error, context);
  }

  showMessage(userMessage, 'error');
}

/**
 * 网络/通用错误消息
 */
function getNetworkErrorMessage(error, context) {
  if (error.message?.includes('Failed to fetch')) {
    return `${context}失败：网络连接异常，请检查网络后重试`;
  }
  if (error.message?.includes('timeout')) {
    return `${context}超时：操作耗时较长，请稍后重试`;
  }
  return `${context}失败：${error.message || '未知错误'}`;
}

/**
 * 文件IO错误消息
 */
function getFileIOErrorMessage(error, context) {
  if (error.message?.includes('ENOENT')) {
    return `${context}失败：文件不存在或已被删除`;
  }
  if (error.message?.includes('EACCES')) {
    return `${context}失败：没有文件访问权限，请检查文件夹权限`;
  }
  if (error.message?.includes('ENOSPC')) {
    return `${context}失败：磁盘空间不足，请清理后重试`;
  }
  if (error.message?.includes('Invalid media path')) {
    return `${context}失败：图片路径无效，可能文件已被移动或删除`;
  }
  return `${context}失败：文件操作错误 - ${error.message}`;
}

/**
 * 解析错误消息
 */
function getParseErrorMessage(error, context) {
  if (error.message?.includes('JSON')) {
    return `${context}失败：数据格式错误，请检查文件内容`;
  }
  if (error.message?.includes('parse')) {
    return `${context}失败：文本解析出错，请检查格式是否正确`;
  }
  return `${context}失败：数据解析错误 - ${error.message}`;
}

/**
 * 验证错误消息
 */
function getValidationErrorMessage(error, context) {
  if (error.message?.includes('required')) {
    return `${context}失败：缺少必填信息，请完整填写后重试`;
  }
  if (error.message?.includes('format')) {
    return `${context}失败：格式不正确，请检查输入内容`;
  }
  return `${context}失败：输入验证错误 - ${error.message}`;
}

/**
 * 权限错误消息
 */
function getPermissionErrorMessage(error, context) {
  if (error.message?.includes('permission')) {
    return `${context}失败：权限不足，请以管理员身份运行或检查文件夹权限`;
  }
  return `${context}失败：权限错误 - ${error.message}`;
}

/**
 * 安全的异步操作包装器
 * @param {Function} asyncFn 异步函数
 * @param {string} context 操作上下文
 * @param {string} errorType 错误类型
 * @returns {Function} 包装后的函数
 */
export function safeAsync(asyncFn, context, errorType = ErrorTypes.NETWORK) {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      handleError(error, context, errorType);
      throw error;
    }
  };
}

/**
 * 图片加载错误处理
 * @param {HTMLImageElement} img 图片元素
 * @param {string} fallbackSrc 备用图片源
 */
export function handleImageError(img, fallbackSrc = null) {
  img.onerror = () => {
    if (fallbackSrc && img.src !== fallbackSrc) {
      img.src = fallbackSrc;
    } else {
      // 显示占位图
      img.src = `data:image/svg+xml;base64,${btoa(`
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6"/>
          <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#6c757d" text-anchor="middle" dy=".3em">图片加载失败</text>
        </svg>
      `)}`;
      img.title = '图片加载失败';
    }
  };
}

/**
 * 全局错误处理器
 */
export function setupGlobalErrorHandling() {
  // 捕获未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
    handleError(new Error(event.reason), '系统操作');
    event.preventDefault();
  });

  // 捕获全局错误
  window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
    if (event.error && !event.error.handled) {
      handleError(event.error, '应用运行');
      event.error.handled = true;
    }
  });
}

/**
 * 验证文件类型
 * @param {File} file 文件对象
 * @param {string[]} allowedTypes 允许的类型
 * @returns {boolean} 是否有效
 */
export function validateFileType(file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']) {
  if (!file || !file.type) {
    throw new Error('文件类型无效');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`不支持的文件类型：${file.type}。支持的格式：${allowedTypes.join(', ')}`);
  }

  return true;
}

/**
 * 验证文件大小
 * @param {File} file 文件对象
 * @param {number} maxSize 最大大小（字节）
 * @returns {boolean} 是否有效
 */
export function validateFileSize(file, maxSize = 10 * 1024 * 1024) { // 默认10MB
  if (!file) {
    throw new Error('文件不存在');
  }

  if (file.size > maxSize) {
    throw new Error(`文件太大：${(file.size / 1024 / 1024).toFixed(1)}MB。最大允许：${(maxSize / 1024 / 1024).toFixed(1)}MB`);
  }

  return true;
}
