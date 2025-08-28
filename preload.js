import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('api', {
  listEntries:()=>ipcRenderer.invoke('entries:list'),
  saveEntries:(entries)=>ipcRenderer.invoke('entries:save',entries),
  saveMediaDataURL:(payload)=>ipcRenderer.invoke('media:saveDataURL',payload),
  openUserData:()=>ipcRenderer.invoke('open:userData')
});
