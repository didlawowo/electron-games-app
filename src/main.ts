import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
const path = require('path');

const users = [{
  username: 'admin',
  password: 'admin'
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

  mainWindow.webContents.openDevTools();

  console.log('📂 Loading from:', path.join(__dirname, 'renderer', 'index.html'));
  console.log('🔌 Preload script:', path.join(__dirname, 'preload.js'));
}

const games = [
  { id: 1, name: "Super Mario Bros", genre: "Platformer" },
  { id: 2, name: "The Legend of Zelda", genre: "Action-Adventure" },
  { id: 3, name: "Tetris", genre: "Puzzle" }
];

ipcMain.handle('login', async (_event: IpcMainInvokeEvent, { username, password }) => {
  console.log('👤 Login attempt:', username);
  const user = users.find(u => u.username === username && u.password === password);
  return user ? { success: true } : { success: false, error: 'Invalid credentials' };
});

ipcMain.handle('getGames', async () => {
  console.log('🎮 Fetching games');
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