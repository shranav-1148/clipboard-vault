import { app, BrowserWindow } from "electron";

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // Development Mode: Loading the vite server url
  mainWindow.loadURL("http://localhost:5173");

  // Production Mode: loading the index.html file
  // mainWindow.loadFile("index.html")
};

app.whenReady().then(() => {
  createWindow();
});
