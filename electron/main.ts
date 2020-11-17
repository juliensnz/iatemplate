import {app, BrowserWindow, ipcMain} from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';
import {getTemplates, openTemplate, writeTemplate} from './templates';
import {generateRender, getRenders, openRender} from './renders';
import {Progress} from '../common/model/progress';
const Store = require('electron-store');
const store = new Store();
const {dialog} = require('electron');

let win: BrowserWindow | null = null;

ipcMain.handle('getStoreValue', (event, key) => {
  try {
    return store.get(key);
  } catch (error) {
    console.error(error);
  }
});
ipcMain.handle('template:get', (event, path) => {
  try {
    return getTemplates(path);
  } catch (error) {
    console.error(error);
  }
});
ipcMain.handle('template:open', (event, options) => {
  try {
    openTemplate(store.get('preferences').logoDirectory, options.templateName);
  } catch (error) {
    console.error(error);
  }
});
ipcMain.handle('template:write', (event, template) => {
  try {
    writeTemplate(store.get('preferences').logoDirectory, template);
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle('render:get', (event, options) => {
  try {
    return getRenders(store.get('preferences').logoDirectory, options.templateName);
  } catch (error) {
    console.error(error);
  }
});

ipcMain.on('render:generate', async (event, {render}) => {
  const updateProgress = (progress: Progress) => {
    event.reply('progress:update', progress);
  };

  try {
    await generateRender(store.get('preferences').logoDirectory, render, updateProgress);
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle('render:open', (event, render) => {
  try {
    openRender(store.get('preferences').logoDirectory, render.template, render.identifier);
  } catch (error) {
    console.error(error);
  }
});

const checkLogoDirectory = async () => {
  while (undefined === store.get('preferences')) {
    const updated = updateTemplateDirectory();
    if (!updated) {
      continue;
    }
  }
};

const updateTemplateDirectory = async () => {
  const logoDirectory = await dialog.showOpenDialog({properties: ['openDirectory']});
  if (logoDirectory.canceled) {
    return false;
  }

  const preferences = {
    logoDirectory: logoDirectory.filePaths[0],
  };

  console.log(preferences);

  store.set('preferences', preferences);
  ipcMain.emit('preferences:updated');

  return true;
};

ipcMain.handle('preferences:directory:update', async () => {
  await updateTemplateDirectory();
});

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    x: 0,
    y: 300,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on('closed', () => (win = null));

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit',
    });
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }

  checkLogoDirectory();
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
