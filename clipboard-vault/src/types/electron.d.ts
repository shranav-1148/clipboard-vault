import type { ClipboardItem } from "./clipboard";
export {}
/**
 * Declare all the APIs that are made available to be used
 */
declare global {

    interface Window {
        electronAPI: {
            getClipboard: () => Promise<string>;

            onClipboardUpdated: (
                callback: (text: string) => void
            ) => void;

            getHistory: () => Promise<ClipboardItem[]>;

            onHistoryUpdated: (
                callback: (history: ClipboardItem[]) => void
            ) => void;

            copyClipboardItem: (
                item: ClipboardItem
            ) => Promise<void>;
        }
    }
}