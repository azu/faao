import EventEmitter from "events";
import { BrowserView, BrowserWindow } from "electron";

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
    private wins: Array<Electron.BrowserWindow>;
    private openedIdx: number;
    private headIdx: number;
    private eventEmitter: EventEmitter;

    constructor(private length: number) {
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
        this.wins = times(this.length, idx => {
            const browserWindow = new BrowserWindow({ width: 100, height: 100, show: false });
            browserWindow.setBrowserView(this.pool[idx]);
            return browserWindow;
        });

        this.openedIdx = 0;
        this.headIdx = 0;
    }

    async prefetch(url: string): Promise<BrowserView> {
        const browserView = this.findByURL(url);
        if (browserView) {
            console.log("cache hit: ", url);
            return browserView;
        }
        const idx = this.nextIdx();
        const view = this.pool[idx];
        const wc = view.webContents;
        return new Promise((resolve, _reject) => {
            wc.once("dom-ready", () => resolve(view));
            wc.loadURL(url);
        });
    }

    async open(url: string) {
        const view = await this.prefetch(url);
        this.openedIdx = this.pool.indexOf(view);
        this.eventEmitter.emit("will-navigate", url);
        return view;
    }

    setBounds(size: Size) {
        this.pool.forEach(v => {
            v.setBounds(size);
            v.setAutoResize({ width: true, height: true });
        });
    }

    on(key: string, f: (...args: any[]) => void) {
        this.eventEmitter.on(key, f);
    }

    private findByURL(url: string) {
        return this.pool.find(v => v.webContents.getURL() === url);
    }

    private nextIdx(): number {
        if (this.length === 1) return this.headIdx;

        const nextIdx = this.headIdx === this.length - 1 ? 0 : this.headIdx + 1;
        this.headIdx = nextIdx;
        if (nextIdx === this.openedIdx) {
            return this.nextIdx();
        } else {
            return nextIdx;
        }
    }

    debug() {
        // HACK: to avoid unused field error of this.wins
        console.log(this.wins);
    }
}
