export {}

declare global {
    interface Window {
        electronAPI: {
            getClipboard: () => Promise<string>;
        }
    }
}