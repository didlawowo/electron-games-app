import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  login: (credentials: { username: string, password: string }) => 
    ipcRenderer.invoke('login', credentials),
  
  getGames: () => ipcRenderer.invoke('getGames')
});