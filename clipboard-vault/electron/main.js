import path from "path";
import { fileURLToPath } from "url";
import { app, BrowserWindow, ipcMain, clipboard } from "electron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    title: "Clipboard Vault",
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Development Mode: Loading the vite server url
  mainWindow.loadURL("http://localhost:5173");

  // Production Mode: loading the index.html file
  // mainWindow.loadFile("index.html")
};

ipcMain.handle("get-clipboard", () => {
  return clipboard.readText();
});

app.whenReady().then(() => {
  createWindow();
});
