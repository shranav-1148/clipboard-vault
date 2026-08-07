export function addClipboardEntry(history, content) {
  const existingIndex = history.findIndex((item) => item.content === content);

  if (existingIndex !== -1) {
    const existingItem = history[existingIndex];

    existingItem.timestamp = new Date().toISOString();

    history.splice(existingIndex, 1);

    history.unshift(existingItem);

    return history;
  }

  const newEntry = {
    id: crypto.randomUUID(),
    content,
    timestamp: new Date().toISOString(),
    favorite: false,
  };

  history.unshift(newEntry);

  return history;
}
