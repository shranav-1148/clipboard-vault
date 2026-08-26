import { app } from "electron";
import fs from "fs";
import path from "path";

/**
 * Gets storage path to userData that holds the data file for the application
 * @returns
 */
function getStoragePath() {
  const userDataPath = app.getPath("userData");

  const storageDirectory = path.join(userDataPath, "Clipboard Vault");

  if (!fs.existsSync(storageDirectory)) {
    fs.mkdirSync(storageDirectory, { recursive: true });
  }

  const filepath = path.join(storageDirectory, "app-config.json");

  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(
      filepath,
      JSON.stringify({
        startOnStartup: false,
        hiddenOnTray: false,
      }),
    );
  }

  return filepath;
}

export function getSettings() {
  const filePath = getStoragePath();
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

export function saveSettings(settings) {
  const filePath = getStoragePath();
  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
}
