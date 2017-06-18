// MIT © 2017 azu
import { Payload, Store } from "almin";
import {
    CloseMobileMenuUseCasePayload,
    OpenMobileMenuUseCasePayload
} from "../../use-case/Mobile/ToggleMobileMenuUseCase";

export interface MobileStateObject {
    isMenuOpened: boolean;
}

export class MobileState implements MobileStateObject {
    isMenuOpened: boolean;

    constructor(state: MobileStateObject) {
        this.isMenuOpened = state.isMenuOpened;
    }

    reduce(payload: OpenMobileMenuUseCasePayload | CloseMobileMenuUseCasePayload) {
        if (payload instanceof OpenMobileMenuUseCasePayload) {
            return new MobileState({
                ...this as MobileState,
                isMenuOpened: true
            });
        } else if (payload instanceof CloseMobileMenuUseCasePayload) {
            return new MobileState({
                ...this as MobileState,
                isMenuOpened: false
            });
        }
        return this;
    }
}

export class MobileStore extends Store<MobileState> {
    state: MobileState;

    constructor() {
        super();
        this.state = new MobileState({
            isMenuOpened: false
        });
    }

    receivePayload(payload: Payload) {
        this.setState(this.state.reduce(payload));
    }

    getState() {
        return this.state;
    }
}
