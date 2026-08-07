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

  getHistory: () => {
    return ipcRenderer.invoke("get-history");
  },

  onHistoryUpdated: (callback) => {
    ipcRenderer.on("history-updated", (_, history) => callback(history));
  },

  copyClipboardItem: (item) => {
    return ipcRenderer.invoke("copy-clipboard-item", item);
  },
});
