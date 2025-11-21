// const { app, BrowserWindow, ipcMain, dialog } = require('electron');
// const path = require('path');
// const SchoolDB = require('./database/SchoolDB');

// let mainWindow;
// let schoolDB;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1400,
//     height: 900,
//     minWidth: 1200,
//     minHeight: 800,
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       preload: path.join(__dirname, 'preload.js'),
//       webSecurity: false
//     },
//     icon: path.join(__dirname, '../assets/icon.png'),
//     title: 'Gestion Scolarité - Groupe Scolaire Bilingue La Grâce De Dieu',
//     show: false
//   });

//   if (process.env.NODE_ENV === 'development') {
//     // Mode développement
//     mainWindow.loadURL('http://localhost:5173');
//     mainWindow.webContents.openDevTools();
//   } else {
//     // Mode production - CHEMIN CORRIGÉ
//     const indexPath = path.join(__dirname, '../../frontend/dist/index.html');
//     console.log('Chargement du fichier:', indexPath);
//     mainWindow.loadFile(indexPath);
//   }

//   mainWindow.once('ready-to-show', () => {
//     mainWindow.show();
//   });

//   mainWindow.on('closed', () => {
//     mainWindow = null;
//   });
// }

// // Initialisation DB
// function initDatabase() {
//   schoolDB = new SchoolDB();
//   return schoolDB.init();
// }

// app.whenReady().then(() => {
//   initDatabase();
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', () => {
//   if (schoolDB) schoolDB.close();
//   if (process.platform !== 'darwin') app.quit();
// });

// // ========== IPC & DB ==========

// // Requêtes base de données
// ipcMain.handle('database-query', async (event, { method, params }) => {
//   try {
//     if (!schoolDB[method]) {
//       throw new Error(`Méthode ${method} non trouvée`);
//     }
//     const result = await schoolDB[method](...params);
//     return { success: true, result };
//   } catch (error) {
//     console.error('Erreur DB query:', error);
//     return { success: false, error: error.message };
//   }
// });

// // Application
// ipcMain.handle('get-app-version', () => app.getVersion());

// // Contrôles fenêtre
// ipcMain.handle('minimize-window', () => mainWindow?.minimize());

// ipcMain.handle('maximize-window', () => {
//   if (mainWindow) {
//     mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
//   }
// });

// ipcMain.handle('close-window', () => mainWindow?.close());

// // Dialogues système
// ipcMain.handle('show-save-dialog', async (event, options) => {
//   const result = await dialog.showSaveDialog(mainWindow, options);
//   return result;
// });

// ipcMain.handle('show-open-dialog', async (event, options) => {
//   const result = await dialog.showOpenDialog(mainWindow, options);
//   return result;
// });































const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const SchoolDB = require('./database/SchoolDB');

let mainWindow;
let schoolDB;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    title: 'Gestion Scolarité - Groupe Scolaire Bilingue La Grâce De Dieu',
    show: false
  });

  // TOUJOURS en mode développement pour l'instant
  // Même si NODE_ENV=production, on force le dev
  mainWindow.loadURL('http://localhost:5173');
  mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialisation DB
function initDatabase() {
  schoolDB = new SchoolDB();
  return schoolDB.init();
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (schoolDB) schoolDB.close();
  if (process.platform !== 'darwin') app.quit();
});

// ========== IPC & DB ==========

// Requêtes base de données
ipcMain.handle('database-query', async (event, { method, params }) => {
  try {
    if (!schoolDB[method]) {
      throw new Error(`Méthode ${method} non trouvée`);
    }
    const result = await schoolDB[method](...params);
    return { success: true, result };
  } catch (error) {
    console.error('Erreur DB query:', error);
    return { success: false, error: error.message };
  }
});

// Application
ipcMain.handle('get-app-version', () => app.getVersion());

// Contrôles fenêtre
ipcMain.handle('minimize-window', () => mainWindow?.minimize());

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  }
});

ipcMain.handle('close-window', () => mainWindow?.close());

// Dialogues système
ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});