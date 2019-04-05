import * as React from "react";

const { ipcRenderer } = (window as any).require("electron");

declare global {
    interface Window {
        ResizeObserver: ResizeObserver;
    }
}

/**
 * The ResizeObserver interface is used to observe changes to Element's content
 * rect.
 *
 * It is modeled after MutationObserver and IntersectionObserver.
 */
interface ResizeObserver {
    new (callback: ResizeObserverCallback): ResizeObserver;

    /**
     * Adds target to the list of observed elements.
     */
    observe: (target: Element) => void;

    /**
     * Removes target from the list of observed elements.
     */
    unobserve: (target: Element) => void;

    /**
     * Clears both the observationTargets and activeTargets lists.
     */
    disconnect: () => void;
}

/**
 * This callback delivers ResizeObserver's notifications. It is invoked by a
 * broadcast active observations algorithm.
 */
interface ResizeObserverCallback {
    (entries: ResizeObserverEntry[], observer: ResizeObserver): void;
}

interface ResizeObserverEntry {
    /**
     * @param target The Element whose size has changed.
     */
    new (target: Element): ResizeObserverEntry;

    /**
     * The Element whose size has changed.
     */
    readonly target: Element;

    /**
     * Element's content rect when ResizeObserverCallback is invoked.
     */
    readonly contentRect: DOMRectReadOnly;
}

interface DOMRectReadOnly {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly left: number;

    toJSON: () => any;
}

interface Props {
    url: string;
    // BrowserView can not to be overlay/
    // Workaround for visible BrowserView
    visible: boolean;
}

export class BrowserView extends React.Component<Props> {
    private el: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.el = React.createRef();
    }

    componentDidMount() {
        ipcRenderer.send("browser-view-load-url", this.props.url);
        const current = this.el.current;
        if (!current) {
            throw new Error("require this.el.current");
        }
        const resizeObserver = new window.ResizeObserver(entries => {
            entries.forEach(entry => {
                // TODO: remove getBoundingClientRect
                const rect = current.getBoundingClientRect();
                this.onResize({
                    x: rect.left,
                    y: rect.top,
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            });
        });
        setTimeout(() => {
            this.onResize();
            resizeObserver.observe(current);
        }, 16);
    }

    private onResize = (size?: { x: number; y: number; width: number; height: number }) => {
        const current = this.el.current;
        if (!current) {
            return;
        }
        const { x, y, width, height } = size ? size : (current.getBoundingClientRect() as DOMRect);
        ipcRenderer.send("browser-view-change-size", { x, y, width, height });
    };

    componentDidUpdate(prevProps: Props, _prevState: any, __: any) {
        if (prevProps.visible !== this.props.visible) {
            if (this.props.visible) {
                ipcRenderer.send("browser-view-show");
            } else {
                ipcRenderer.send("browser-view-hide");
            }
        }
    }

    render() {
        return <div className="BrowserView" ref={this.el} />;
    }
}
