// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { GitHubSearchQuery } from "../../domain/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../../domain/GitHubSearchList/GitHubSearchList";

export class OpenQueryPanelUseCasePayload extends Payload {
    constructor(public searchList: GitHubSearchList) {
        super({ type: "OpenQueryPanelUseCasePayload" });
    }
}

export class EditQueryPanelUseCasePayload extends Payload {
    constructor(public query: GitHubSearchQuery) {
        super({ type: "EditQueryPanelUseCasePayload" });
    }
}

export class CloseQueryPanelUseCasePayload extends Payload {
    constructor() {
        super({ type: "CloseQueryPanelUseCasePayload" });
    }
}

export class EditQueryPanelUseCase extends UseCase {
    execute(query: GitHubSearchQuery) {
        this.dispatch(new EditQueryPanelUseCasePayload(query));
    }
}

export class OpenQueryPanelUseCase extends UseCase {
    execute(searchList: GitHubSearchList) {
        this.dispatch(new OpenQueryPanelUseCasePayload(searchList));
    }
}

export class CloseQueryPanelUseCase extends UseCase {
    execute() {
        this.dispatch(new CloseQueryPanelUseCasePayload());
    }
}
