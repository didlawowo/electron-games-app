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
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

const games = [
  { id: 1, name: "Super Mario Bros", genre: "Platformer" },
  { id: 2, name: "The Legend of Zelda", genre: "Action-Adventure" },
  { id: 3, name: "Tetris", genre: "Puzzle" }
];

ipcMain.handle('login', async (_event, { username, password }) => {
  const user = users.find(u => u.username === username && u.password === password);
  return user ? { success: true } : { success: false, error: 'Invalid credentials' };
});

ipcMain.handle('getGames', async () => {
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