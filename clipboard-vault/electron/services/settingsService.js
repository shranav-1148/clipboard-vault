export function updateSetting(settings, settingName, value) {
  if (settingName === "startOnStartup") {
    settings.startOnStartup = value;
    if (settings.startOnStartup === false) {
      settings.hiddenOnTray = false;
    }
  }
  if (settingName === "hiddenOnTray") {
    if (settings.startOnStartup === true) {
      settings.hiddenOnTray = value;
    }
  }
  return settings;
}
