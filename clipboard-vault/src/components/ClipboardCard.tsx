import type { ClipboardItem } from "../types/clipboard";
import { formatTimestamp } from "../utils/formatTimeStamp";
import { useState } from "react";

type ClipboardCardProps = {
  item: ClipboardItem;
};

function ClipboardCard({ item }: ClipboardCardProps) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  const shouldTruncate = item.content.length > maxLength;
  const displayContent =
    shouldTruncate && !expanded
      ? item.content.substring(0, maxLength) + "..."
      : item.content;
  return (
    <div onClick={() => setExpanded(!expanded)}>
      <p>{displayContent}</p>

      <p>{formatTimestamp(item.timestamp)}</p>
      <button
        onClick={(event) => {
          event.stopPropagation();
          console.log("Copying item:", item);

          window.electronAPI.copyClipboardItem(item);
        }}
      >
        Copy
      </button>
    </div>
  );
}

export default ClipboardCard;
