/**
 * ViewPool is based on
 * https://github.com/pocke/korat/blob/master/src/mainProcess/ViewPool.ts
 * https://github.com/pocke/korat/blob/master/LICENSE
 */
import EventEmitter from "events";
import { BrowserView, BrowserWindow } from "electron";
import LRU from "lru-cache";

const times = (count: number, cb: (item: any) => any) => {
    return Array.from(new Array(count), (_, index) => cb(index));
};

interface Size {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class ViewPool {
    private pool: Array<Electron.BrowserView>;
    private openedIdx: number;
    private headIdx: number;
    private eventEmitter: EventEmitter;
    private currentSize!: Size;
    private visible: boolean;
    private lru: LRU.Cache<any, any>;

    constructor(private browerWindow: BrowserWindow, private length: number) {
        this.lru = new LRU({
            max: 30
        });
        this.visible = true;
        this.eventEmitter = new EventEmitter();
        this.pool = times(this.length, idx => {
            const browserView = new BrowserView({ webPreferences: { nodeIntegration: false } });
            browserView.webContents.on("will-navigate", (_event, url) => {
                if (this.openedIdx === idx) {
                    this.eventEmitter.emit("will-navigate", url);
                }
            });
            return browserView;
        });
        this.pool.forEach(view => {
            browerWindow.addBrowserView(view);
        });
        this.openedIdx = 0;
        this.headIdx = 0;
    }

    async prefetch(url: string): Promise<void> {
        const browserView = this.findByURL(url);
        if (browserView) {
            console.log("cache hit: ", url);
        }
        const idx = this.nextIdx();
        const view = this.pool[idx];
        return this.loadUrlIntoView(url, view).then(() => {
            console.log("prefetch url:", url);
        });
    }

    async loadUrlIntoView(url: string, browserView: BrowserView): Promise<void> {
        const wc = browserView.webContents;
        return new Promise(resolve => {
            wc.once("dom-ready", () => resolve());
            wc.loadURL(url);
        });
    }

    async open(url: string): Promise<BrowserView> {
        const cachedBrowserView = this.findByURL(url);
        if (cachedBrowserView) {
            console.log("Open view from cached", url);
            // update openedIdx with cachedView's idx
            this.openedIdx = this.pool.indexOf(cachedBrowserView);
            return cachedBrowserView;
        } else {
            // load url to current view
            console.log("Load and Open view", url);
            const currentView = this.pool[this.openedIdx];
            await this.loadUrlIntoView(url, currentView);
            return currentView;
        }
    }

    setBounds(size: Size, browserView?: BrowserView) {
        const floorSize = {
            x: Math.floor(size.x),
            y: Math.floor(size.y),
            width: Math.floor(size.width),
            height: Math.floor(size.height)
        };

        const openedView = browserView ? browserView : this.pool[this.openedIdx];
        this.pool.forEach(v => {
            if (openedView && v === openedView) {
                v.setBounds(floorSize);
                v.setAutoResize({ width: true, height: true });
            } else {
                v.setBounds({
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                });
            }
        });
        this.currentSize = floorSize;
    }

    on(key: string, f: (...args: any[]) => void) {
        this.eventEmitter.on(key, f);
    }

    private findByURL(url: string) {
        return this.pool.find(v => v.webContents.getURL() === url);
    }

    private nextIdx(): number {
        if (this.length === 1) {
            return this.headIdx;
        }
        const nextIdx = this.headIdx === this.length - 1 ? 0 : this.headIdx + 1;
        this.headIdx = nextIdx;
        if (nextIdx === this.openedIdx) {
            return this.nextIdx();
        } else {
            return nextIdx;
        }
    }

    /**
     * Show and Hide is workaround BrowserView
     * BrowserView can not to be hidden!
     */
    bringFrontBrowserView(browserView: BrowserView) {
        this.setBounds(this.currentSize, browserView);
    }

    show() {
        this.setBounds(this.currentSize);
        this.visible = true;
        // debug
        // this.pool.forEach((view, index) => {
        //     console.log(`id: ${index}, url: ${view.webContents.getURL()}`);
        // });
    }

    hide() {
        this.visible = false;
        this.pool.forEach(v => {
            v.setBounds({
                width: 0,
                height: 0,
                x: 0,
                y: 0
            });
        });
    }

    get currentBrowserView(): BrowserView | undefined {
        return this.pool[this.openedIdx];
    }

    reloadCurrentBrowserView() {
        const browserView = this.currentBrowserView;
        if (browserView) {
            browserView.webContents.reload();
        }
    }

    goBackCurrentBrowserView() {
        const browserView = this.currentBrowserView;
        if (browserView) {
            browserView.webContents.goBack();
        }
    }

    goForwardCurrentBrowserView() {
        const browserView = this.currentBrowserView;
        if (browserView) {
            browserView.webContents.goForward();
        }
    }
}
