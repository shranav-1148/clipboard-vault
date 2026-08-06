export {}

declare global {
    interface Window {
        electronAPI: {
            getClipboard: () => Promise<string>;

            onClipboardUpdated: (
                callback: (text : string) => void
            ) => void;
        }
    }
}