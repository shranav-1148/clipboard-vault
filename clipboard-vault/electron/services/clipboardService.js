/**
 * This function handles adding a new clipboard entry into the history list.
 * If there exists a clipboard entry that already exists being added it will be pushed
 * to the top of the list and the older entry will be removed.
 * @param {*} history array of all clipboard entries
 * @param {*} content the current clipbaord entry to be added
 * @returns
 */

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

export function deleteClipboardEntry(history, itemId) {
  return history.filter((item) => item.id !== itemId);
}
