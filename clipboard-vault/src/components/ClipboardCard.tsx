import type { ClipboardItem } from "../types/clipboard";
import { formatTimestamp } from "../utils/formatTimeStamp";
import { useState } from "react";
import clipboardLogo from "../assets/clipboard-regular-full.svg";
import starLogo from "../assets/star-regular-full.svg";
import starFilledLogo from "../assets/star-solid-full.svg";
import deleteLogo from "../assets/trash-solid-full.svg";
import "./ClipboardCard.css";
type ClipboardCardProps = {
  item: ClipboardItem;
};
/**
 * The ClipboardCard React component function
 * Holds all logic inside the Component card including truncation of clipboard content
 * and expansion logic.
 * @param param0
 * @returns
 */
function ClipboardCard({ item }: ClipboardCardProps) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  const shouldTruncate = item.content.length > maxLength;
  const displayContent =
    shouldTruncate && !expanded
      ? item.content.substring(0, maxLength) + "..."
      : item.content;
  return (
    <div onClick={() => setExpanded(!expanded)} className="card-container">
      <p className="card-title">{displayContent}</p>
      <div className="container">
        <p className="card-timestamp">{formatTimestamp(item.timestamp)}</p>
        <div className="button-container">
          <button
            className="btn-copy"
            onClick={(event) => {
              event.stopPropagation();
              console.log("Copying item:", item);

              window.electronAPI.copyClipboardItem(item);
            }}
          >
            <img src={clipboardLogo} alt="Copy"></img>
          </button>
          <button
            className="btn-star"
            onClick={(event) => {
              event.stopPropagation();
              console.log("Toggled entry", item.id);
              window.electronAPI.toggleFavorite(item.id);
            }}
          >
            <img
              src={item.favorite ? starFilledLogo : starLogo}
              alt="Star"
            ></img>
          </button>
          <button
            className="btn-delete"
            onClick={(event) => {
              event.stopPropagation();
              window.electronAPI.deleteClipboardItem(item.id);
            }}
          >
            <img src={deleteLogo} alt="Delete"></img>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClipboardCard;
