export function updateSetting(settings, settingName, value) {
  if (settingName === "startOnStartup") {
    settings.startOnStartup = value;
  }
  if (settingName === "hiddenOnTray") {
    settings.hiddenOnTray = value;
  }
  return settings;
}
