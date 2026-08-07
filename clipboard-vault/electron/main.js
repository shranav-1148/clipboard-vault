import path from "path";
import { fileURLToPath } from "url";
import { app, BrowserWindow, ipcMain, clipboard } from "electron";
import { getHistory, saveHistory } from "./storage/clipboardStorage.js";
import { addClipboardEntry } from "./services/clipboardService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mainWindow = null;
let internalCopy = false;

let lastClipboardText = "";

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

ipcMain.handle("copy-clipboard-item", (_, item) => {
  internalCopy = true;
  clipboard.writeText(item.content);
});

function monitorClipboard() {
  setInterval(() => {
    const currentClipboard = clipboard.readText();

    if (currentClipboard !== lastClipboardText) {
      // mainWindow.webContents.send("clipboard-updated", currentClipboard);

      lastClipboardText = currentClipboard;

      if (internalCopy) {
        internalCopy = false;
        return;
      }

      const history = getHistory();
      const updatedHistory = addClipboardEntry(history, currentClipboard);
      saveHistory(updatedHistory);
      mainWindow.webContents.send("history-updated", updatedHistory);
    }
  }, 500);
}

app.whenReady().then(() => {
  createWindow();
  monitorClipboard();

  ipcMain.handle("get-history", () => {
    return getHistory();
  });

  // console.log(getHistory());

  // saveHistory([
  //   {
  //     id: "123",
  //     content: "Testing Storage",
  //     timestamp: new Date().toISOString(),
  //     favorite: false,
  //   },
  // ]);

  // console.log(getHistory());
});
