// UI组件模块
// @ts-check

import { escapeHtml } from '../logic/utils.js';
import { categoryMapping } from '../logic/parser.js';

/**
 * @typedef {import('../../types.d.ts').Entry} Entry
 * @typedef {import('../../types.d.ts').CategoryKey} CategoryKey
 * @typedef {import('../../types.d.ts').PromptContent} PromptContent
 */

/**
 * 生成图片卡片HTML
 * @param {Entry} entry 条目数据
 * @param {string} imageSrc 图片源URL
 * @returns {string} HTML字符串
 */
export function createGalleryCard(entry, imageSrc) {
  return `
    <div class="gallery-card" onclick="showDetailModal('${entry.id}')">
      <div class="gallery-image-container">
        <img class="gallery-image" src="${imageSrc}" alt="${escapeHtml(entry.title)}" loading="lazy" />
      </div>
    </div>
  `;
}

/**
 * 生成标签HTML
 * @param {string[]} tags 标签数组
 * @param {string} containerClass 容器类名
 * @param {Function} onRemove 移除回调函数
 * @returns {string} HTML字符串
 */
export function createTagsHTML(tags, containerClass = 'tags-container', onRemove = null) {
  return tags.map(tag => `
    <div class="tag-item">
      ${escapeHtml(tag)}
      ${onRemove ? `<button class="tag-remove" onclick="${onRemove.name}('${escapeHtml(tag)}')">×</button>` : ''}
    </div>
  `).join('');
}

/**
 * 生成类别编辑器HTML
 * @param {CategoryKey} key 类别键
 * @param {PromptContent} prompt 提示词内容
 * @returns {string} HTML字符串
 */
export function createCategoryEditor(key, prompt) {
  const mapping = categoryMapping[key];
  if (!mapping) return '';

  return `
    <div class="category-item">
      <div class="category-header" onclick="toggleCategory('${key}')">
        <span class="category-title">${mapping.name}</span>
        <span class="category-toggle">▼</span>
      </div>
      <div class="category-content">
        <div class="prompt-row">
          <div class="prompt-label">英文提示词:</div>
          <textarea class="prompt-textarea" data-category="${key}" data-lang="en">${escapeHtml(prompt.en)}</textarea>
        </div>
        <div class="prompt-row">
          <div class="prompt-label">中文说明:</div>
          <textarea class="prompt-textarea zh" data-category="${key}" data-lang="zh" placeholder="暂无中文解释，可手动补充">${escapeHtml(prompt.zh)}</textarea>
        </div>
        <div class="prompt-actions">
          <button class="copy-category-btn" onclick="copyCategoryPrompt('${key}')" style="background: #007bff;">📋 复制此类</button>
          <button class="copy-category-btn" onclick="translateCategory('${key}')" style="background: #28a745; margin-left: 8px;">🌏 翻译</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * 生成分页HTML
 * @param {number} currentPage 当前页码
 * @param {number} totalPages 总页数
 * @returns {string} HTML字符串
 */
export function createPaginationHTML(currentPage, totalPages) {
  if (totalPages <= 1) return '';

  let html = '';

  // 上一页
  html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">‹</button>`;

  // 页码
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }

  // 下一页
  html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">›</button>`;

  return html;
}

/**
 * 生成空状态HTML
 * @param {string} title 标题
 * @param {string} text 描述文本
 * @param {string} buttonText 按钮文本
 * @param {string} buttonAction 按钮动作
 * @returns {string} HTML字符串
 */
export function createEmptyStateHTML(title = '暂无数据', text = '上传一些图片并生成提示词来开始使用吧！', buttonText = '开始导入', buttonAction = 'showUploadModal()') {
  return `
    <div class="empty-state">
      <div class="empty-icon">🖼️</div>
      <div class="empty-title">${title}</div>
      <div class="empty-text">${text}</div>
      <button class="btn btn-primary" onclick="${buttonAction}">${buttonText}</button>
    </div>
  `;
}

/**
 * 创建拖拽提示层
 * @returns {HTMLElement} DOM元素
 */
export function createDropOverlay() {
  const dropOverlay = document.createElement('div');
  dropOverlay.id = 'globalDropOverlay';
  dropOverlay.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 200px;
    background: rgba(102, 126, 234, 0.95);
    border: 3px dashed white;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    color: white;
    font-size: 1.5rem;
    text-align: center;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `;
  dropOverlay.innerHTML = `
    <div>
      <div style="font-size: 3rem; margin-bottom: 15px;">📤</div>
      <div>拖拽图片到此处</div>
      <div style="font-size: 1rem; margin-top: 8px; opacity: 0.9;">支持 JPG, PNG, WebP</div>
    </div>
  `;
  return dropOverlay;
}

/**
 * 切换类别展开状态
 * @param {string} categoryKey 类别键
 */
export function toggleCategory(categoryKey) {
  const categoryItem = event.currentTarget.parentElement;
  categoryItem.classList.toggle('expanded');
}

// 将函数暴露到全局作用域以供HTML调用
window.toggleCategory = toggleCategory;
