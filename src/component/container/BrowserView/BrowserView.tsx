import * as React from "react";
import isElectron from "is-electron";
import { IconButton, Link } from "office-ui-fabric-react";
import { BaseContainer } from "../BaseContainer";
import { createAddUrlToFaaoQueryUseCase } from "../../../use-case/GitHubSearchList/AddUrlToFaaoQueryUseCase";

const nope = () => {};
const ipcRenderer = isElectron() ? (window as any).require("electron").ipcRenderer : nope;
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

export class BrowserView extends BaseContainer<Props> {
    private el: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount() {
        ipcRenderer.on("faao-add-url-to-query", (_event: any, url: string, query: string) => {
            this.useCase(createAddUrlToFaaoQueryUseCase()).execute(url, query);
        });
        ipcRenderer.send("browser-view-load-url", this.props.url);
        const current = this.el.current;
        if (!current) {
            throw new Error("require this.el.current");
        }
        const resizeObserver = new window.ResizeObserver(entries => {
            entries.forEach(_entry => {
                // TODO: remove getBoundingClientRect
                const rect = current.getBoundingClientRect();
                this.onResize({
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height
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

    private reloadBrowserView = () => {
        ipcRenderer.send("browser-view-reload");
    };
    private goBackBrowserView = () => {
        ipcRenderer.send("browser-view-go-back");
    };

    private goForwardBrowserView = () => {
        ipcRenderer.send("browser-view-go-forward");
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
        const url = this.props.url;
        return (
            <div className="BrowserView">
                <div className="BrowserView-address" dir="ltr">
                    <div className="BrowserView-addressButtons">
                        <IconButton
                            title={"Go Back"}
                            iconProps={{
                                iconName: "Back"
                            }}
                            onClick={this.goBackBrowserView}
                        />
                        <IconButton
                            title={"Go Forward"}
                            iconProps={{
                                iconName: "Forward"
                            }}
                            onClick={this.goForwardBrowserView}
                        />
                        <IconButton
                            title={"Refresh Browser View"}
                            iconProps={{
                                iconName: "Refresh"
                            }}
                            onClick={this.reloadBrowserView}
                        />
                    </div>
                    <Link
                        className={"BrowserView-addressLink"}
                        title={"Open url in browser"}
                        href={url}
                    >
                        {url}
                    </Link>
                </div>
                {/* Workaround Electron https://github.com/electron/electron/issues/13468 */}
                <div className="BrowserView-content" style={{ marginTop: "20px" }} ref={this.el} />
            </div>
        );
    }
}
