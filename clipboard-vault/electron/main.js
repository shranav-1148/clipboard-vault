import path from "path";
import { fileURLToPath } from "url";
import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  clipboard,
  Tray,
  Menu,
} from "electron";
import { getHistory, saveHistory } from "./storage/clipboardStorage.js";
import {
  addClipboardEntry,
  deleteClipboardEntry,
  toggleFavorite,
} from "./services/clipboardService.js";

/**
 * ===================
 * Electron Main Page:
 * @author shranav
 *
 * This file holds the main electron window code. This file also interfaces with electron preload
 * and handles how electron API's function
 *===================
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mainWindow = null;
let tray = null;
let isQuitting = false;
let lastClipboardText = "";
const iconPath = path.join(__dirname, "assets", "app-logo.png");

// Creates the main window where the app will initialize
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

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
};

const showMainWindow = () => {
  if (mainWindow?.isMinimized()) {
    // mainWindow.show(): is for when window is hidden
    mainWindow.restore(); // specifically for when window is minimized
  }

  if (!mainWindow?.isVisible()) {
    mainWindow.show();
  }
  mainWindow?.focus();
};

const createTray = () => {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show Clipboard Vault",
      click: () => {
        // show/focus window
        showMainWindow();
      },
    },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray = new Tray(iconPath);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Clipboard Vault");
  tray.addListener("click", () => {
    showMainWindow();
  });
};

/**
 * ===================================================================================
 * Handling of APIs that the application makes available for frontend to interact with
 * ===================================================================================
 *
 */

// Handle getting contents of the clipboard
ipcMain.handle("get-clipboard", () => {
  return clipboard.readText();
});

// Handles copy of the contents of the item into the clipboard
ipcMain.handle("copy-clipboard-item", (_, item) => {
  clipboard.writeText(item.content);
});

// Handles deletion of clipboard item: the actual handling is separated into clipboardService
ipcMain.handle("delete-clipboard-item", (_, itemId) => {
  const history = getHistory();
  const updatedHistory = deleteClipboardEntry(history, itemId);
  saveHistory(updatedHistory);

  mainWindow.webContents.send("history-updated", updatedHistory);
});

// Handles toggle favorite of item: actual handling in clipboardService
ipcMain.handle("toggle-favorite", (_, itemId) => {
  const history = getHistory();
  const updatedHistory = toggleFavorite(history, itemId);
  saveHistory(updatedHistory);
  mainWindow.webContents.send("history-updated", updatedHistory);
});

function monitorClipboard() {
  /**
   * Function that constantly monitors the content of the clipboard
   * Adds a new clipboard entry when clipboard contents are changed
   */

  setInterval(() => {
    const currentClipboard = clipboard.readText();

    if (currentClipboard !== lastClipboardText) {
      // mainWindow.webContents.send("clipboard-updated", currentClipboard);

      lastClipboardText = currentClipboard;

      const history = getHistory();
      const updatedHistory = addClipboardEntry(history, currentClipboard);
      saveHistory(updatedHistory);
      mainWindow.webContents.send("history-updated", updatedHistory);
    }
  }, 500);
}

// We need to wait until the app initializes, when its ready we move ahead
app.whenReady().then(() => {
  // global shortcut of CTRL/CMD+SHIFT+C to focus on clipboard manager when app is running
  const globalFocus = globalShortcut.register(
    "CommandOrControl+Shift+C",
    () => {
      showMainWindow();
    },
  );

  createWindow();
  createTray();
  monitorClipboard();

  // Once app is initialized get the history
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

  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
  });
});
