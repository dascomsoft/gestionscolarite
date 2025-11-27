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
//     icon: path.join(__dirname, '../assets/logograce.png'),
//     title: 'Gestion Scolarité - Groupe Scolaire Bilingue La Grâce De Dieu',
//     show: false
//   });

//   if (process.env.NODE_ENV === 'development') {
//     // Mode développement
//     mainWindow.loadURL('http://localhost:5173');
//     mainWindow.webContents.openDevTools();
//   } else {
//     // Mode production
//     const indexPath = path.join(__dirname, '../frontend-dist/index.html');
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
let db;

// 🔧 GESTION PROPRE DE LA FERMETURE
function cleanup() {
  console.log('🔄 Nettoyage avant fermeture...');
  
  if (db) {
    try {
      db.close();
      console.log('✅ Base de données fermée proprement');
    } catch (error) {
      console.error('❌ Erreur fermeture DB:', error);
    }
  }
}

function createWindow() {
  try {
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1200,
      minHeight: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      icon: path.join(__dirname, '../assets/logograce.png'),
      title: 'Gestion Scolarité - Groupe Scolaire Bilingue La Grace De Dieu'
    });

    // En production, charger depuis le dossier frontend-dist
    mainWindow.loadFile(path.join(__dirname, '../../frontend-dist/index.html'));
    
    // Désactiver les DevTools en production
    // mainWindow.webContents.openDevTools();

  } catch (error) {
    console.error('❌ Erreur création fenêtre:', error);
    dialog.showErrorBox('Erreur', 'Impossible de démarrer l\'application: ' + error.message);
  }
}

// 🚨 GESTIONNAIRES D'ÉVÉNEMENTS CRITIQUES
app.on('before-quit', (event) => {
  console.log('🔴 Fermeture de l\'application demandée');
  cleanup();
});

app.on('window-all-closed', () => {
  console.log('📱 Toutes les fenêtres fermées');
  if (process.platform !== 'darwin') {
    // La fermeture se fait dans before-quit
    app.quit();
  }
});

app.on('will-quit', (event) => {
  console.log('👋 Application sur le point de quitter');
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 🚨 GESTION DES ERREURS GLOBALES
process.on('uncaughtException', (error) => {
  console.error('🚨 Erreur non capturée:', error);
  cleanup();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Promise rejetée:', reason);
});

// 🎯 DÉMARRAGE DE L'APPLICATION
app.whenReady().then(() => {
  try {
    console.log('🚀 Démarrage de l\'application...');
    
    // Initialiser la base de données
    db = new SchoolDB();
    console.log('✅ Base de données initialisée');
    
    createWindow();
    console.log('✅ Fenêtre principale créée');
    
  } catch (error) {
    console.error('❌ Erreur critique au démarrage:', error);
    dialog.showErrorBox('Erreur Critique', 'Impossible de démarrer l\'application: ' + error.message);
    app.quit();
  }
});

// 📡 HANDLERS IPC POUR LA BASE DE DONNÉES
ipcMain.handle('database-query', async (event, { method, params }) => {
  try {
    if (!db) {
      throw new Error('Base de données non initialisée');
    }
    
    const result = db[method](...params);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Erreur base de données:', error);
    return { success: false, error: error.message };
  }
});

// Handler pour les statistiques
ipcMain.handle('get-statistics', async () => {
  try {
    if (!db) return { totalStudents: 0, totalPayments: 0, totalAmount: 0 };
    
    const students = db.getStudents();
    const payments = db.getAllPayments ? db.getAllPayments() : [];
    
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.total_paid || 0), 0);
    
    return {
      totalStudents: students.length,
      totalPayments: payments.length,
      totalAmount: totalAmount
    };
  } catch (error) {
    console.error('Erreur statistiques:', error);
    return { totalStudents: 0, totalPayments: 0, totalAmount: 0 };
  }
});

