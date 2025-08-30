// dataRoot.js
import { app } from 'electron';
import fs from 'fs';
import path from 'path';

const SETTINGS = 'settings.json';

function settingsPath() {
  return path.join(app.getPath('userData'), SETTINGS);
}

export function loadSettings() {
  try { return JSON.parse(fs.readFileSync(settingsPath(), 'utf-8')); }
  catch { return {}; }
}

export function saveSettings(s) {
  fs.writeFileSync(settingsPath(), JSON.stringify(s, null, 2), 'utf-8');
}

export function getDataRoot() {
  const s = loadSettings();
  // 默认仍使用 userData，除非用户在设置里选择了目录
  return s.dataRoot || app.getPath('userData');
}

export function setDataRoot(root) {
  const s = loadSettings();
  s.dataRoot = root;
  saveSettings(s);
}

export function ensureDataDirs(root) {
  fs.mkdirSync(path.join(root, 'data'), { recursive: true });
  fs.mkdirSync(path.join(root, 'media'), { recursive: true });
}

export function getDBPath(root) {
  return path.join(root, 'data', 'entries.json');
}

export function ensureDBInitialized(root) {
  const p = getDBPath(root);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, '[]', 'utf-8');
  }
}
