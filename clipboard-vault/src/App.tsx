import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import ClipboardCard from "./components/ClipboardCard";
import type { ClipboardItem } from "./types/clipboard";

function App() {
  const [history, setHistory] = useState<ClipboardItem[]>([]);

  useEffect(() => {
    async function loadHistory() {
      const savedHistory = await window.electronAPI.getHistory();

      setHistory(savedHistory);
    }

    loadHistory();
  }, []);

  useEffect(() => {
    window.electronAPI.onHistoryUpdated((updatedHistory) => {
      setHistory(updatedHistory);
    });
  }, []);

  // const handleReadClipboard = async () => {
  //   const text = await window.electronAPI.getClipboard();
  //   setClipboardText(text);
  // };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Clipboard Vault</h1>
      {history.map((item) => (
        <ClipboardCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default App;
