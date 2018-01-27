/* Alya Smart Mirror
 * Global process
 *
 * By Bilal Al-Saeedi
 * MIT Licensed.
 */

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');

// Launching the mirror in dev mode
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {

  const browserWindowOptions = {
    width: 800,
    height: 600,
    kiosk: !isDev,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
    }
  };

  // Create the browser window.
  mainWindow = new BrowserWindow(browserWindowOptions);

  // and load the index.html of the app.
  mainWindow.loadURL(isDev ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => (mainWindow = null));
}


app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});