// MIT © 2017 azu
import React from "react";
import { BaseContainer } from "../BaseContainer";
import Combokeys from "combokeys"
import { createAppUserSelectNextItemUseCase } from "../../../use-case/App/AppUserSelectNextItemUseCase";
import { createAppUserSelectPrevItemUseCase } from "../../../use-case/App/AppUserSelectPrevItemUseCase";

export class ShortcutKeyContainer extends BaseContainer<{}, {}> {
    combokeys: any;

    componentDidMount() {
        this.combokeys = new Combokeys(document.documentElement);
        const actionMap = {
            "move-next-item": (_event: Event) => {
                this.useCase(createAppUserSelectNextItemUseCase()).executor(useCase => useCase.execute());
            },
            "move-prev-item": (_event: Event) => {
                this.useCase(createAppUserSelectPrevItemUseCase()).executor(useCase => useCase.execute())
            }
        };
        const keyMap: { [index: string]: keyof typeof actionMap } = {
            "j": "move-next-item",
            "k": "move-prev-item"
        };
        Object.keys(keyMap).forEach(key => {
            console.log(key);
            this.combokeys.bind(key, (event: Event) => {
                actionMap[keyMap[key]](event);
            });
        })
    }

    componentWillUnmount() {
        this.combokeys.detach();
    }

    render() {
        return null;
    }
}