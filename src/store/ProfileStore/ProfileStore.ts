// MIT © 2017 azu
import { Payload, Store } from "almin";
import { ProfileJSON } from "../../domain/Profile/Profile";
import { ExportProfileUseCasePayload } from "../../use-case/Profile/ExportProfileUseCase";
import {
    CloseProfileWindowUseCasePayload,
    OpenProfileWindowUseCasePayload
} from "../../use-case/Profile/ToggleProfileWindowUseCase";

export interface ProfileStateArgs {
    isShow: boolean;
    exportedJSON?: ProfileJSON;
}

export class ProfileState {
    isShow: boolean;
    exportedJSON?: ProfileJSON;

    constructor(args: ProfileStateArgs) {
        this.isShow = args.isShow;
        this.exportedJSON = args.exportedJSON;
    }

    reduce(
        payload:
            | ExportProfileUseCasePayload
            | OpenProfileWindowUseCasePayload
            | CloseProfileWindowUseCasePayload
    ) {
        if (payload instanceof ExportProfileUseCasePayload) {
            return new ProfileState({
                ...this as ProfileState,
                exportedJSON: payload.json
            });
        } else if (payload instanceof OpenProfileWindowUseCasePayload) {
            return new ProfileState({
                ...this as ProfileState,
                isShow: true
            });
        } else if (payload instanceof CloseProfileWindowUseCasePayload) {
            return new ProfileState({
                ...this as ProfileState,
                isShow: false
            });
        }

        return this;
    }
}

export class ProfileStore extends Store<ProfileState> {
    state: ProfileState;

    constructor() {
        super();
        this.state = new ProfileState({
            isShow: false
        });
    }

    receivePayload(payload: Payload) {
        this.setState(this.state.reduce(payload));
    }

    getState(): ProfileState {
        return this.state;
    }
}
