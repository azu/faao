// MIT © 2017 azu
import { Payload, UseCase } from "almin";
import { isGitHubSearchQuery } from "../../domain/GitHubSearchList/queries/GitHubSearchQuery";
import { GitHubSearchList } from "../../domain/GitHubSearchList/GitHubSearchList";
import { QueryPanelType } from "../../store/GitHubSearchListStore/GitHubSearchListStore";
import { UnionQuery, UnionQueryJSON } from "../../domain/GitHubSearchList/queries/QueryRole";
import { isGitHubReceivedEventsForUserQuery } from "../../domain/GitHubSearchList/queries/GitHubReceivedEventsForUserQuery";
import { isGitHubNotificationQuery } from "../../domain/GitHubSearchList/queries/GitHubNotificationQuery";
import { isFaaoSearchQuery } from "../../domain/GitHubSearchList/queries/FaaoSearchQuery";
import * as assert from "assert";

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

export const getPanelType = (query: UnionQuery): QueryPanelType => {
    if (isGitHubReceivedEventsForUserQuery(query)) {
        return "github";
    } else if (isGitHubNotificationQuery(query)) {
        return "github";
    } else if (isGitHubSearchQuery(query)) {
        return "github";
    } else if (isFaaoSearchQuery(query)) {
        return "faao";
    } else {
        return assert.fail(query);
    }
};

export class EditQueryPanelUseCase extends UseCase {
    execute(query: UnionQuery) {
        const panelType = getPanelType(query);
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
