// MIT © 2017 azu
import { GitHubSearchQuery, GitHubSearchQueryJSON } from "../../GitHubSearchList/GitHubSearchQuery";
import { Identifier } from "../../Entity";
import { GitHubSearchList } from "../../GitHubSearchList/GitHubSearchList";
import { ValueObject } from "../../ValueObject";

export interface OpenedGitHubSearchListJSON {
    type: "OpenedGitHubSearchList";
    gitHubSearchListId: string;
    query?: GitHubSearchQueryJSON;
}

export interface OpenedGitHubSearchListArgs {
    gitHubSearchListId: Identifier<GitHubSearchList>;
    query?: GitHubSearchQuery;
}

export const isOpenedGitHubSearchList = (v: any): v is OpenedGitHubSearchList => {
    return v instanceof OpenedGitHubSearchList && v.type === "OpenedGitHubStream";
};

export class OpenedGitHubSearchList extends ValueObject implements OpenedGitHubSearchListArgs {
    type = "OpenedGitHubStream";
    gitHubSearchListId: Identifier<GitHubSearchList>;
    query?: GitHubSearchQuery;

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
            query: json.query ? GitHubSearchQuery.fromJSON(json.query) : undefined
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
