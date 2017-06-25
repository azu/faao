// MIT © 2017 azu
import { BaseContainer } from "../BaseContainer";
import Combokeys from "combokeys";
import { createAppUserSelectNextItemUseCase } from "../../../use-case/App/AppUserSelectNextItemUseCase";
import { createAppUserSelectPrevItemUseCase } from "../../../use-case/App/AppUserSelectPrevItemUseCase";

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
            "move-next-item": (event: Event) => {
                if (isIgnoreNode(event)) {
                    return;
                }
                this.useCase(createAppUserSelectNextItemUseCase()).executor(useCase =>
                    useCase.execute()
                );
            },
            "move-prev-item": (event: Event) => {
                if (isIgnoreNode(event)) {
                    return;
                }
                this.useCase(createAppUserSelectPrevItemUseCase()).executor(useCase =>
                    useCase.execute()
                );
            }
        };
        const keyMap: { [index: string]: keyof typeof actionMap } = {
            j: "move-next-item",
            k: "move-prev-item"
        };
        Object.keys(keyMap).forEach(key => {
            this.combokeys.bind(key, (event: Event) => {
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
