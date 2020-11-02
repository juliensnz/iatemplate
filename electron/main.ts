import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import {getTemplates, openTemplate, writeTemplate} from './templates';
import {getRenders, openRender} from './renders';
const Store = require('electron-store');
const store = new Store();
const { dialog } = require('electron')
const childProcess = require('child_process');

let win: BrowserWindow | null = null;

ipcMain.handle('getStoreValue', (event, key) => {
  return store.get(key);
});
ipcMain.handle('templates:get', (event, path) => {
  console.log('refresh templates')
  return getTemplates(path);
});
ipcMain.handle('renders:get', (event, options) => {
  return getRenders(options);
});

ipcMain.handle('templates:generate', (event, options) => {
  console.log(options);
  const command = `./bash/generate.sh ${options.template.path} ${options.target}/${options.template.name} ${options.name} '${JSON.stringify(options.data)}'`;
  console.log(command);
  // return childProcess.execSync(command);
});
ipcMain.handle('templates:open', (event, options) => {
  openTemplate(store.get('preferences').logoDirectory, options.templateName);
});

ipcMain.handle('templates:write', (event, template) => {
  console.log('write template')
  try {
    writeTemplate(store.get('preferences').logoDirectory, template);
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle('renders:open', (event, options) => {
  openRender(store.get('preferences').logoDirectory, options.templateName, options.renderName);
});

const checkLogoDirectory = async () => {
  while (undefined === store.get('preferences')) {
    const logoDirectory = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (logoDirectory.canceled) {
      continue;
    }

    console.log(logoDirectory);
    const preferences = {
      logoDirectory: logoDirectory.filePaths[0]
    };

    store.set('preferences', preferences);
    ipcMain.emit('preferences:updated');
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on('closed', () => win = null);

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }

  checkLogoDirectory()
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
