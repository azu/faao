import EventEmitter from "events";
import { BrowserWindow, BrowserView } from "electron";

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
    private ev: EventEmitter;

    constructor(private length: number) {
        this.ev = new EventEmitter();
        this.pool = times(this.length, idx => {
            const v = new BrowserView({ webPreferences: { nodeIntegration: false } });
            v.webContents.on("will-navigate", (_event, url) => {
                if (this.openedIdx === idx) {
                    this.ev.emit("will-navigate", url);
                }
            });
            return v;
        });
        this.wins = times(this.length, idx => {
            const w = new BrowserWindow({ width: 100, height: 100, show: false });
            w.setBrowserView(this.pool[idx]);
            return w;
        });

        this.openedIdx = 0;
        this.headIdx = 0;
    }

    async prefetch(url: string): Promise<BrowserView> {
        const v = this.findByURL(url);
        if (v) {
            console.log("cache hit: ", url);
            return v;
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
        this.ev.emit("will-navigate", url);
        return view;
    }

    setBounds(size: Size) {
        this.pool.forEach(v => {
            v.setBounds(size);
        });
    }

    on(key: string, f: (...args: any[]) => void) {
        this.ev.on(key, f);
    }

    private findByURL(url: string) {
        const view = this.pool.find(v => v.webContents.getURL() === url);
        return view;
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
