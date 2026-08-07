import { app } from "electron";
import fs from "fs";
import path from "path";

function getStoragePath() {
  const userDataPath = app.getPath("userData");

  const storageDirectory = path.join(userDataPath, "Clipboard Vault");

  if (!fs.existsSync(storageDirectory)) {
    fs.mkdirSync(storageDirectory, { recursive: true });
  }

  const filepath = path.join(storageDirectory, "clipboard-history.json");

  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify([]));
  }

  return filepath;
}

export function getHistory() {
  const filePath = getStoragePath();
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

export function saveHistory(history) {
  const filePath = getStoragePath();
  fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
}

export default getStoragePath;
