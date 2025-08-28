import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import fs from 'fs';

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
  win = new BrowserWindow({
    width: 1300, height: 900,
    webPreferences: { preload: path.join(process.cwd(), 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile(path.join(process.cwd(), 'renderer', 'index.html'));
}

app.whenReady().then(() => { ensureDirs(); createWindow(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

ipcMain.handle('entries:list', () => readJSON());
ipcMain.handle('entries:save', (e, entries) => { writeJSON(entries); return {ok:true}; });
ipcMain.handle('media:saveDataURL', (e,{dataUrl,filenameBase})=>{
  const base = app.getPath('userData'); const mediaDir=path.join(base,'media');
  const [meta,b64]=String(dataUrl).split(','); const extMatch=/data:image\/(png|jpeg|jpg|webp)/.exec(meta||'');
  const ext=extMatch?(extMatch[1]==='jpeg'?'jpg':extMatch[1]):'png';
  const file=`${filenameBase}.${ext}`; fs.writeFileSync(path.join(mediaDir,file),Buffer.from(b64,'base64'));
  return {ok:true,path:`media/${file}`};
});
ipcMain.handle('open:userData',()=>{const p=app.getPath('userData'); shell.openPath(p); return{ok:true,path:p};});
