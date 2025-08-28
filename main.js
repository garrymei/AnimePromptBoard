import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;

function ensureDirs() {
  const base = app.getPath('userData');
  fs.mkdirSync(path.join(base, 'data'), { recursive: true });
  fs.mkdirSync(path.join(base, 'media'), { recursive: true });
  return base;
}

function getDBPath() {
  const base = app.getPath('userData');
  return path.join(base, 'data', 'entries.json');
}

function readJSON() {
  const p = getDBPath();
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); }
  catch { return []; }
}

function writeJSON(data) {
  const p = getDBPath();
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
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

app.whenReady().then(() => { ensureDirs(); createWindow(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

ipcMain.handle('entries:list', () => readJSON());
ipcMain.handle('entries:save', (e, entries) => { writeJSON(entries); return {ok:true}; });
ipcMain.handle('media:saveDataURL', (e,{dataUrl,filenameBase})=>{
  try {
    const base = app.getPath('userData'); 
    const mediaDir=path.join(base,'media');
    const [meta,b64]=String(dataUrl).split(','); 
    const extMatch=/data:image\/(png|jpeg|jpg|webp)/.exec(meta||'');
    const ext=extMatch?(extMatch[1]==='jpeg'?'jpg':extMatch[1]):'png';
    const file=`${filenameBase}.${ext}`;
    const fullPath = path.join(mediaDir,file);
    fs.writeFileSync(fullPath, Buffer.from(b64,'base64'));
    return {ok:true, path: `file://${fullPath}`};
  } catch (error) {
    console.error('Save media error:', error);
    return {ok:false, error: error.message};
  }
});
ipcMain.handle('open:userData',()=>{const p=app.getPath('userData'); shell.openPath(p); return{ok:true,path:p};});

// 解析媒体文件路径
ipcMain.handle('resolve:mediaURL', (e, relPath) => {
  try {
    const base = app.getPath('userData');
    const fullPath = path.join(base, relPath);
    if (fs.existsSync(fullPath)) {
      return { ok: true, url: `file://${fullPath}` };
    }
    return { ok: false, error: 'File not found' };
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
