// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import {
    GitHubSearchQuery,
    isGitHubSearchQuery
} from "../../domain/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchList, UnionQuery } from "../../domain/GitHubSearchList/GitHubSearchList";
import { QueryPanelType } from "../../store/GitHubSearchListStore/GitHubSearchListStore";

export class OpenQueryPanelUseCasePayload extends Payload {
    type = "OpenQueryPanelUseCasePayload";

    constructor(public searchList: GitHubSearchList, public panelType: QueryPanelType) {
        super();
    }
}

export class EditQueryPanelUseCasePayload extends Payload {
    type = "EditQueryPanelUseCasePayload";

    constructor(public query: UnionQuery, public panelType: QueryPanelType) {
        super();
    }
}

export class CloseQueryPanelUseCasePayload extends Payload {
    type = "CloseQueryPanelUseCasePayload";
}

export class EditQueryPanelUseCase extends UseCase {
    execute(query: UnionQuery) {
        const panelType: QueryPanelType = isGitHubSearchQuery(query) ? "github" : "faao";
        this.dispatch(new EditQueryPanelUseCasePayload(query, panelType));
    }
}

export class OpenQueryPanelUseCase extends UseCase {
    execute(searchList: GitHubSearchList, panelType: QueryPanelType) {
        this.dispatch(new OpenQueryPanelUseCasePayload(searchList, panelType));
    }
}

export class CloseQueryPanelUseCase extends UseCase {
    execute() {
        this.dispatch(new CloseQueryPanelUseCasePayload());
    }
}
