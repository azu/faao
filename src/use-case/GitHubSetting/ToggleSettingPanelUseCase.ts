// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";

export class OpenSettingPanelUseCasePayload extends Payload {
    type = "OpenSettingPanelUseCasePayload";
    constructor(public setting?: GitHubSetting) {
        super();
    }
}

export class CloseSettingPanelUseCasePayload extends Payload {
    type = "CloseSettingPanelUseCasePayload";
}

export class OpenSettingPanelUseCase extends UseCase {
    execute(setting?: GitHubSetting) {
        this.dispatch(new OpenSettingPanelUseCasePayload(setting));
    }
}

export class CloseSettingPanelUseCase extends UseCase {
    execute() {
        this.dispatch(new CloseSettingPanelUseCasePayload());
    }
}
