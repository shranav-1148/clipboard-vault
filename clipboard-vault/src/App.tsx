import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import ClipboardCard from "./components/ClipboardCard";
import type { ClipboardItem } from "./types/clipboard";
import type { Setting } from "./types/settings";
/**
 * The main React App
 * @returns
 */
function App() {
  type View = "history" | "settings";
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<Setting>();
  const [currentView, setCurrentView] = useState<View>("history");

  // useRef wires a reference of type HTMLInputElement
  const inputRef = useRef<HTMLInputElement>(null); // initialized with null

  useEffect(() => {
    async function loadSettings() {
      const savedSettings = await window.electronAPI.getSettings();

      setSettings(savedSettings);
    }

    loadSettings();
  }, []);

  // Handling of ctrl+F/ cmd + F key
  useEffect(() => {
    // internal function to handle keydown
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "f" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    // handle key down
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // close the event listener once operation is done
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  // Load all the clipboard history
  useEffect(() => {
    async function loadHistory() {
      // Wait on getting history before setting a new one
      const savedHistory = await window.electronAPI.getHistory();

      setHistory(savedHistory);
    }

    loadHistory();
  }, []);

  // When history is updated set a new history
  useEffect(() => {
    window.electronAPI.onHistoryUpdated((updatedHistory) => {
      setHistory(updatedHistory);
    });
  }, []);

  // const handleReadClipboard = async () => {
  //   const text = await window.electronAPI.getClipboard();
  //   setClipboardText(text);
  // };
  let settingsLoaded = false;
  if (settings !== undefined) {
    settingsLoaded = true;
  }

  const filteredHistory = history.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="app">
      <div className="header">
        <h1>Clipboard Vault</h1>
        <div className="view-buttons">
          <button onClick={() => setCurrentView("history")}>History</button>
          <button onClick={() => setCurrentView("settings")}>Settings</button>
        </div>
      </div>
      {currentView === "history" ? (
        <div className="history-view">
          <input
            className="searchbar"
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search clipboard history..."
            ref={inputRef}
          />
          <div className="history-container">
            {history.length === 0 ? ( // First check if clipboard history exists
              <p>No clipboard history yet.</p>
            ) : filteredHistory.length === 0 ? ( // If it does, check for search results
              <p>No matching clipboard entries found</p>
            ) : (
              filteredHistory.map(
                //Display all matching results
                (item) => <ClipboardCard key={item.id} item={item} />,
              )
            )}
          </div>
        </div>
      ) : (
        <div className="settingsView">
          {settings !== undefined ? (
            <div className="settings">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <span>Start on Startup</span>
                <input
                  type="checkbox"
                  checked={settings.startOnStartup}
                  onChange={async (e) => {
                    const updatedSettings =
                      await window.electronAPI.updateSetting(
                        "startOnStartup",
                        e.target.checked,
                      );

                    setSettings(updatedSettings);
                  }}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <span>Start hidden in system tray</span>
                <input
                  type="checkbox"
                  checked={settings.hiddenOnTray}
                  onChange={async (e) => {
                    const updatedSettings =
                      await window.electronAPI.updateSetting(
                        "hiddenOnTray",
                        e.target.checked,
                      );

                    setSettings(updatedSettings);
                  }}
                  disabled={settings.startOnStartup ? false : true}
                />
              </label>
            </div>
          ) : (
            <p>Loading settings...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
