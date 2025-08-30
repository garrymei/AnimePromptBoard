const { contextBridge, ipcRenderer } = require('electron');

// 调试信息
console.log('Preload script loading...');

try {
  contextBridge.exposeInMainWorld('api', {
    listEntries: () => ipcRenderer.invoke('entries:list'),
    saveEntries: (entries) => ipcRenderer.invoke('entries:save', entries),
    saveMediaDataURL: (payload) => ipcRenderer.invoke('media:saveDataURL', payload),
    resolveMediaURL: (relPath) => ipcRenderer.invoke('resolve:mediaURL', relPath),
    openUserData: () => ipcRenderer.invoke('open:userData'),
    exportJSON: (data) => ipcRenderer.invoke('export:json', data),
    importJSON: () => ipcRenderer.invoke('import:json'),

    // 设置相关 API
    getSettings: () => ipcRenderer.invoke('settings:get'),
    chooseDir: () => ipcRenderer.invoke('dialog:chooseDir'),
    setDataRoot: (p) => ipcRenderer.invoke('settings:setDataRoot', p)
  });
  console.log('API exposed successfully!');
} catch (error) {
  console.error('Failed to expose API:', error);
}
