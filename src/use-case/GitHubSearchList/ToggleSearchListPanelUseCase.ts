// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { GitHubSearchList } from "../../domain/GitHubSearchList/GitHubSearchList";

export class OpenSearchListPanelUseCasePayload extends Payload {
    type = "OpenSearchListPanelUseCasePayload";
}

export class EditSearchListPanelUseCasePayload extends Payload {
    type = "EditSearchListPanelUseCasePayload";
    constructor(public gitHubSearchList: GitHubSearchList) {
        super();
    }
}

export class CloseSearchListPanelUseCasePayload extends Payload {
    type = "CloseSearchListPanelUseCasePayload";
}

export class EditSearchListPanelUseCase extends UseCase {
    execute(gitHubSearchList: GitHubSearchList) {
        this.dispatch(new EditSearchListPanelUseCasePayload(gitHubSearchList));
    }
}

export class OpenSearchListPanelUseCase extends UseCase {
    execute() {
        this.dispatch(new OpenSearchListPanelUseCasePayload());
    }
}

export class CloseSearchListPanelUseCase extends UseCase {
    execute() {
        this.dispatch(new CloseSearchListPanelUseCasePayload());
    }
}
