const { app, BrowserWindow } = require('electron');
const path = require('path');
const electron = require('electron');
const Tray = electron.Tray;
const Menu = electron.Menu;
const logoIcon = path.join(__dirname + "/assets/ms-icon.png");

let mainWindow = null;
let loading = null;
let appIcon = null;
const gotTheLock = app.requestSingleInstanceLock();
console.log(gotTheLock);

const createWindow = () => {
  loading = new BrowserWindow({
    show: false, 
    frame: false,
    transparent: true,
    resizable: false,
    width: 802,
    center: true,
    icon: logoIcon
  });

  loading.once('show', () => {
    mainWindow = new BrowserWindow({
      width: 1360,
      height: 768,
      webPreferences: {
        nodeIntegration: true
      },
      resizable: false,
      show: false,
      title: "EVERY-DGSW",
      icon: logoIcon,
    });

    mainWindow.webContents.once('dom-ready', () => {
      console.log('메인 윈도우 로드!');
      mainWindow.show();
      loading.hide();
      loading.close();
    });

      mainWindow.removeMenu();
      mainWindow.loadURL("http://every-dgsw.s3-website.ap-northeast-2.amazonaws.com/");
  });

  loading.loadFile(__dirname + '/assets/dgsw-logo.svg');
  loading.removeMenu();
  loading.show();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.allowRendererProcessReuse = true;

app.on('ready', () => {
  if(!gotTheLock) {
    app.quit();
  } else {
    createWindow();
    appIcon = new Tray(logoIcon);
    
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Reload', click: () => { mainWindow.reload(); } },
      { label: 'Quit EVERY-DGSW', click: () => { app.quit(); } },
    ]);
  
    appIcon.setContextMenu(contextMenu);
  
    app.on('window-all-closed', () => {
      if(process.platform != "darwin") {
        console.log("window on background process");
        mainWindow = null;
      } else {
        app.quit();
      }
    });
  
    appIcon.on('click', () => {
      if (mainWindow === null) { createWindow(); }
    })
  }
});