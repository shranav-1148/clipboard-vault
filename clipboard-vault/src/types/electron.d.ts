import type { ClipboardItem } from "./clipboard";
import type {Setting } from "./settings";
export {}
/**
 * API typings
 * Declare all the APIs that are made available to be used
 */
declare global {

    interface Window {
        electronAPI: {
            getClipboard: () => Promise<string>;

            getSettings: () => Promise<Setting>

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

            deleteClipboardItem: (itemId) => Promise<void>;

            toggleFavorite: (itemId) => Promise<void>;

            updateSetting: (settingName: string, value: boolean) => Promise<Settings>;
        }
    }
}