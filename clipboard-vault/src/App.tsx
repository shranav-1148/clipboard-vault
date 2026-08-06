import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [clipboardText, setClipboardText] = useState("");

  useEffect(() => {
    window.electronAPI.onClipboardUpdated((text) => {
      setClipboardText(text);
    });
  }, []);

  // const handleReadClipboard = async () => {
  //   const text = await window.electronAPI.getClipboard();
  //   setClipboardText(text);
  // };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Clipboard Vault</h1>
      <h2>Current Clipboard:</h2>
      <p>{clipboardText}</p>
    </div>
  );
}

export default App;
