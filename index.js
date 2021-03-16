const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');
//const { noise } = require('perlin-noise'); //jak mogę tego użyc w engine.js?

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  //win.removeMenu()
  win.loadURL(url.format ({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
    win.removeMenu()
    const fs = window.require('fs');
  }
})