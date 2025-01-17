const { contextBridge, ipcRenderer } = require('electron');

// 🌉 Exposition des APIs sécurisées au renderer
contextBridge.exposeInMainWorld('api', {
    login: (credentials: { username: string, password: string }) => 
        ipcRenderer.invoke('login', credentials),
    
    getGames: () => ipcRenderer.invoke('getGames')
});