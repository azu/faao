// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { GitHubSearchQuery } from "../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";

export class OpenQueryPanelUseCasePayload extends Payload {
    constructor(public query?: GitHubSearchQuery) {
        super({ type: "OpenQueryPanelUseCasePayload" });
    }
}

export class CloseQueryPanelUseCasePayload extends Payload {
    constructor() {
        super({ type: "CloseQueryPanelUseCasePayload" });
    }
}

export class OpenQueryPanelUseCase extends UseCase {
    execute(query?: GitHubSearchQuery) {
        this.dispatch(new OpenQueryPanelUseCasePayload(query));
    }
}

export class CloseQueryPanelUseCase extends UseCase {
    execute() {
        this.dispatch(new CloseQueryPanelUseCasePayload());
    }
}
