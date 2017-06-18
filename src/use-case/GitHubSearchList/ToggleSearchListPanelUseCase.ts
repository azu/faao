// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { GitHubSearchList } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchList";

export class OpenSearchListPanelUseCasePayload extends Payload {
    constructor() {
        super({ type: "OpenSearchListPanelUseCasePayload" });
    }
}

export class EditSearchListPanelUseCasePayload extends Payload {
    constructor(public gitHubSearchList: GitHubSearchList) {
        super({ type: "EditSearchListPanelUseCasePayload" });
    }
}

export class CloseSearchListPanelUseCasePayload extends Payload {
    constructor() {
        super({ type: "CloseSearchListPanelUseCasePayload" });
    }
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
