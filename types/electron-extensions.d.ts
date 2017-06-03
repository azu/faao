// MIT © 2017 azu
interface ElectronNavigation {
    newTab(url: string, options: object);
}

interface Window {
    electronNavigation?: ElectronNavigation
}
