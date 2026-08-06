const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getClipboard: () => {
    return ipcRenderer.invoke("get-clipboard");
  },
  onClipboardUpdated: (callback) => {
    ipcRenderer.on("clipboard-updated", (_, text) => {
      callback(text);
    });
  },
});
