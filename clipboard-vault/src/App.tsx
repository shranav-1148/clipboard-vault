import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import ClipboardCard from "./components/ClipboardCard";
import type { ClipboardItem } from "./types/clipboard";

/**
 * The main React App
 * @returns
 */
function App() {
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredHistory = history.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="app">
      <div className="header">
        <h1>Clipboard Vault</h1>
        <input
          className="searchbar"
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search clipboard history..."
        />
      </div>
      <div className="history-container">
        {filteredHistory.map((item) => (
          <ClipboardCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default App;
