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
    importJSON: () => ipcRenderer.invoke('import:json')
  });
  console.log('API exposed successfully!');
} catch (error) {
  console.error('Failed to expose API:', error);
}
