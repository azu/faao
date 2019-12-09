// MIT © 2017 azu
import {
    GitHubSearchQuery,
    isGitHubSearchQueryJSON
} from "../../GitHubSearchList/queries/GitHubSearchQuery";
import { Identifier } from "../../Entity";
import { GitHubSearchList } from "../../GitHubSearchList/GitHubSearchList";
import { ValueObject } from "../../ValueObject";
import {
    FaaoSearchQuery,
    isFaaoSearchQueryJSON
} from "../../GitHubSearchList/queries/FaaoSearchQuery";
import { UnionQuery, UnionQueryJSON } from "../../GitHubSearchList/queries/QueryRole";
import { createQueryFromUnionQueryJSON } from "../../GitHubSearchList/queries/QueryService";

export interface OpenedGitHubSearchListJSON {
    type: "OpenedGitHubSearchList";
    gitHubSearchListId: string;
    query?: UnionQueryJSON;
}

export interface OpenedGitHubSearchListArgs {
    gitHubSearchListId: Identifier<GitHubSearchList>;
    query?: UnionQuery;
}

export const isOpenedGitHubSearchList = (v: any): v is OpenedGitHubSearchList => {
    return v instanceof OpenedGitHubSearchList && v.type === "OpenedGitHubStream";
};

export class OpenedGitHubSearchList extends ValueObject implements OpenedGitHubSearchListArgs {
    type = "OpenedGitHubStream";
    gitHubSearchListId: Identifier<GitHubSearchList>;
    query?: UnionQuery;

    constructor(args: OpenedGitHubSearchListArgs) {
        super();
        this.gitHubSearchListId = args.gitHubSearchListId;
        this.query = args.query;
    }

    openItem(query: GitHubSearchQuery) {
        return new OpenedGitHubSearchList(Object.assign({}, this, { query }));
    }

    static fromJSON(json: OpenedGitHubSearchListJSON): OpenedGitHubSearchList {
        return new OpenedGitHubSearchList({
            gitHubSearchListId: new Identifier<GitHubSearchList>(json.gitHubSearchListId),
            query: json.query ? createQueryFromUnionQueryJSON(json.query) : undefined
        });
    }

    toJSON(): OpenedGitHubSearchListJSON {
        return {
            type: "OpenedGitHubSearchList",
            gitHubSearchListId: this.gitHubSearchListId.toValue(),
            query: this.query ? this.query.toJSON() : undefined
        };
    }
}
