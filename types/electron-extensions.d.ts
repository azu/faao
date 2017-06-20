// MIT © 2017 azu
export interface ElectronNavigation {
    newTab(url: string, options?: object): void;

    changeTab(url: string, options?: object): void;

    stop(): void;
}

// extends
declare global {
    interface Window {
        electronNavigation?: ElectronNavigation;
    }
}
