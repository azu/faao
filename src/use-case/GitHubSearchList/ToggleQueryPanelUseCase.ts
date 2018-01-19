// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { GitHubSearchQuery } from "../../domain/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList } from "../../domain/GitHubSearchList/GitHubSearchList";

export class OpenQueryPanelUseCasePayload extends Payload {
    type = "OpenQueryPanelUseCasePayload";

    constructor(public searchList: GitHubSearchList) {
        super();
    }
}

export class EditQueryPanelUseCasePayload extends Payload {
    type = "EditQueryPanelUseCasePayload";

    constructor(public query: GitHubSearchQuery) {
        super();
    }
}

export class CloseQueryPanelUseCasePayload extends Payload {
    type = "CloseQueryPanelUseCasePayload";
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
