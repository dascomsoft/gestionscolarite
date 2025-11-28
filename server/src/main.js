









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

    // CORRECTION DU CHEMIN
    mainWindow.loadFile(path.join(__dirname, '../frontend-dist/index.html'));
    
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
    
    const result = await db[method](...params);
    
    // FORCER LA SÉRIALISATION AVEC JSON
    const serializedResult = JSON.parse(JSON.stringify(result || null));
    
    return { success: true, result: serializedResult };
  } catch (error) {
    console.error('❌ Erreur base de données:', error);
    return { success: false, error: error.message };
  }
});

// Handler pour les statistiques
ipcMain.handle('get-statistics', async () => {
  try {
    if (!db) return { totalStudents: 0, totalPayments: 0, totalAmount: 0 };
    
    const students = await db.getStudents();
    const payments = await db.getAllPayments();
    
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.totalPaid || payment.total_paid || 0), 0);
    
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