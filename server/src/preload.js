const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Base de données
  database: {
    invoke: (method, ...params) =>
      ipcRenderer.invoke('database-query', { method, params })
  },

  // Application (fenêtre)
  app: {
    getVersion: () => ipcRenderer.invoke('get-app-version'),
    minimize: () => ipcRenderer.invoke('minimize-window'),
    maximize: () => ipcRenderer.invoke('maximize-window'),
    close: () => ipcRenderer.invoke('close-window')
  },

  // Dialogues système
  fs: {
    showSaveDialog: (options) =>
      ipcRenderer.invoke('show-save-dialog', options),
    showOpenDialog: (options) =>
      ipcRenderer.invoke('show-open-dialog', options)
  }
});