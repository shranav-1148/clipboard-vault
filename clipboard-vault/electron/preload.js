const { contextBridge, ipcRenderer } = require("electron");

/**
 * ===============
 * This file is the interface between the main electron file and the react frontend
 * React doens't need to know how these APIs work only that they are available to use.
 * ==============
 */

// Exposing APIs to the react world
contextBridge.exposeInMainWorld("electronAPI", {
  getClipboard: () => {
    // invoke the get-clipboard from main: means the caller of this API gets something from the API
    return ipcRenderer.invoke("get-clipboard");
  },
  onClipboardUpdated: (callback) => {
    // Update on the API. The caller will send and receive data to and from the API
    ipcRenderer.on("clipboard-updated", (_, text) => {
      callback(text);
    });
  },

  getHistory: () => {
    // invoke
    return ipcRenderer.invoke("get-history");
  },

  onHistoryUpdated: (callback) => {
    // on
    ipcRenderer.on("history-updated", (_, history) => callback(history));
  },

  copyClipboardItem: (item) => {
    // invoke
    return ipcRenderer.invoke("copy-clipboard-item", item);
  },
});
