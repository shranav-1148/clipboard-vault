const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getClipboard: () => {
    return ipcRenderer.invoke("get-clipboard");
  },
});
