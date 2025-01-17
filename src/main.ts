import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

const users = [{
  username: 'admin',
  password: 'password123'
}];

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 🔐 Chemin correct vers le preload
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 📂 Chemin correct vers le fichier HTML source (non compilé)
  mainWindow.loadFile(path.join(__dirname, '..', 'src', 'renderer', 'index.html'));
  
  // 🛠️ Ouvrir les outils de développement en mode développement
  mainWindow.webContents.openDevTools();
}

// 🎮 Liste des jeux simulée
const games = [
  { id: 1, name: "Super Mario Bros", genre: "Platformer" },
  { id: 2, name: "The Legend of Zelda", genre: "Action-Adventure" },
  { id: 3, name: "Tetris", genre: "Puzzle" }
];

// 👥 Gestionnaire de connexion
ipcMain.handle('login', async (_event, { username, password }) => {
  console.log('Login attempt:', username); // 🐛 Debug log
  const user = users.find(u => u.username === username && u.password === password);
  return user ? { success: true } : { success: false, error: 'Invalid credentials' };
});

// 📋 Gestionnaire des jeux
ipcMain.handle('getGames', async () => {
  console.log('Fetching games'); // 🐛 Debug log
  return games;
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});