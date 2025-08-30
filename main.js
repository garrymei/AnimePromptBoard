import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  getDataRoot, setDataRoot, ensureDataDirs, getDBPath, ensureDBInitialized
} from './dataRoot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;

function atomicWrite(filePath, data) {
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, data, 'utf-8');
  fs.renameSync(tmp, filePath);
}

function readJSON() {
  const p = getDBPath(getDataRoot());
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); }
  catch { return []; }
}

function writeJSON(data) {
  const p = getDBPath(getDataRoot());
  atomicWrite(p, JSON.stringify(data, null, 2));
}

function createWindow() {
  console.log('Creating main window...');
  console.log('Preload path:', path.join(__dirname, 'preload.js'));
  console.log('HTML path:', path.join(__dirname, 'renderer', 'index.html'));
  
  win = new BrowserWindow({
    width: 1300, height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  
  // 开发时打开开发者工具
  win.webContents.openDevTools();
  
  console.log('Window created successfully');
}

app.whenReady().then(() => {
  ensureDataDirs(getDataRoot());
  ensureDBInitialized(getDataRoot());
  createWindow();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

ipcMain.handle('entries:list', () => readJSON());
ipcMain.handle('entries:save', (e, entries) => { writeJSON(entries); return {ok:true}; });
ipcMain.handle('media:saveDataURL', (e, { dataUrl, filenameBase }) => {
  try {
    const root = getDataRoot();
    const mediaDir = path.join(root, 'media');
    const [meta, b64] = String(dataUrl).split(',');
    const extMatch = /data:image\/(png|jpeg|jpg|webp)/.exec(meta || '');
    const ext = extMatch ? (extMatch[1] === 'jpeg' ? 'jpg' : extMatch[1]) : 'png';
    const file = `${filenameBase}.${ext}`;
    fs.writeFileSync(path.join(mediaDir, file), Buffer.from(b64, 'base64'));
    return { ok: true, path: `media/${file}` };
  } catch (error) {
    console.error('Save media error:', error);
    return { ok: false, error: error.message };
  }
});
ipcMain.handle('open:userData',()=>{const p=app.getPath('userData'); shell.openPath(p); return{ok:true,path:p};});

// 解析媒体文件路径（白名单 media/）
ipcMain.handle('resolve:mediaURL', (e, relPath) => {
  try {
    if (!/^media\//.test(relPath)) {
      throw new Error('Invalid media path');
    }
    const abs = path.join(getDataRoot(), relPath);
    return { ok: true, url: new URL(`file://${abs}`).toString() };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

// 导出JSON数据
ipcMain.handle('export:json', (e, data) => {
  try {
    const result = dialog.showSaveDialogSync(win, {
      title: '导出数据',
      defaultPath: `anime-prompt-board-${new Date().toISOString().slice(0, 10)}.json`,
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (result) {
      fs.writeFileSync(result, JSON.stringify(data, null, 2), 'utf-8');
      return { ok: true, path: result };
    }
    return { ok: false, error: 'Cancelled' };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

// 导入JSON数据
ipcMain.handle('import:json', () => {
  try {
    const result = dialog.showOpenDialogSync(win, {
      title: '导入数据',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    });
    
    if (result && result[0]) {
      const data = fs.readFileSync(result[0], 'utf-8');
      const parsed = JSON.parse(data);
      return { ok: true, data: parsed };
    }
    return { ok: false, error: 'Cancelled' };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

// 设置相关 IPC
ipcMain.handle('settings:get', () => ({ dataRoot: getDataRoot() }));

ipcMain.handle('dialog:chooseDir', async () => {
  try {
    const res = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (res.canceled || !res.filePaths?.[0]) return { ok: false };
    return { ok: true, path: res.filePaths[0] };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

ipcMain.handle('settings:setDataRoot', (e, root) => {
  try {
    ensureDataDirs(root);
    ensureDBInitialized(root);
    setDataRoot(root);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
