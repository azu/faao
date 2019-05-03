// MIT © 2017 azu
import { BaseContainer } from "../BaseContainer";
import Combokeys from "combokeys";
import { createAppUserSelectNextItemUseCase } from "../../../use-case/App/AppUserSelectNextItemUseCase";
import { createAppUserSelectPrevItemUseCase } from "../../../use-case/App/AppUserSelectPrevItemUseCase";
import { createClearCacheDataUseCase } from "../../../use-case/System/ClearCacheDataUseCase";

const IGNORE_NODE_NAME_PATTERN = /webview/i;
const isIgnoreNode = (event: Event): boolean => {
    const target = event.target as HTMLElement;
    if (!target.nodeName) {
        return false;
    }
    return IGNORE_NODE_NAME_PATTERN.test(target.nodeName);
};

export class ShortcutKeyContainer extends BaseContainer<{}, {}> {
    combokeys: any;

    componentDidMount() {
        this.combokeys = new Combokeys(document.documentElement);
        const actionMap = {
            "move-next-item": (_event: Event) => {
                this.useCase(createAppUserSelectNextItemUseCase()).execute();
            },
            "move-prev-item": (_event: Event) => {
                this.useCase(createAppUserSelectPrevItemUseCase()).execute();
            },
            "clear-cache-and-reload": (_event: Event) => {
                if (window.confirm("Can clear cache data?")) {
                    this.useCase(createClearCacheDataUseCase())
                        .execute()
                        .then(() => {
                            window.location.reload(true);
                        });
                }
            }
        };
        const keyMap: { [index: string]: keyof typeof actionMap } = {
            j: "move-next-item",
            k: "move-prev-item",
            "command+shift+r": "clear-cache-and-reload",
            "ctrl+shift+r": "clear-cache-and-reload"
        };
        Object.keys(keyMap).forEach(key => {
            this.combokeys.bind(key, (event: Event) => {
                if (isIgnoreNode(event)) {
                    return;
                }
                actionMap[keyMap[key]](event);
            });
        });
    }

    componentWillUnmount() {
        this.combokeys.detach();
    }

    render() {
        return null;
    }
}
