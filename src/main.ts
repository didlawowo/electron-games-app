// 📦 Imports principaux
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 🔧 Configuration du __dirname pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👥 Utilisateurs de test
const users = [{
  username: 'admin',
  password: 'admin'
}];

// 🖥️ Création de la fenêtre principale
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 📂 Charger les fichiers depuis le dossier dist/renderer
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

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
  console.log('👤 Login attempt:', username);
  const user = users.find(u => u.username === username && u.password === password);
  return user ? { success: true } : { success: false, error: 'Invalid credentials' };
});

// 📋 Gestionnaire des jeux
ipcMain.handle('getGames', async () => {
  console.log('🎮 Fetching games');
  return games;
});

// 🚀 Lancement de l'application
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 🔄 Gestion de la fermeture
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});