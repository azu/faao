// MIT © 2017 azu
import {
    GitHubSearchResultItem,
    GitHubSearchResultItemJSON
} from "../../GitHubSearchStream/GitHubSearchResultItem";
import { Identifier } from "../../Entity";
import { GitHubSearchStream } from "../../GitHubSearchStream/GitHubSearchStream";

export interface OpenedGitHubStreamJSON {
    type: "OpenedGitHubStream";
    gitHubSearchStreamId: string;
    item?: GitHubSearchResultItemJSON;
}

export interface OpenedGitHubStreamArgs {
    gitHubSearchStreamId: Identifier<GitHubSearchStream>;
    item?: GitHubSearchResultItem;
}

export const isOpenedGitHubStream = (v: any): v is OpenedGitHubStream => {
    return v instanceof OpenedGitHubStream;
};

export class OpenedGitHubStream implements OpenedGitHubStreamArgs {
    gitHubSearchStreamId: Identifier<GitHubSearchStream>;
    item?: GitHubSearchResultItem;

    constructor(args: OpenedGitHubStreamArgs) {
        this.gitHubSearchStreamId = args.gitHubSearchStreamId;
        this.item = args.item;
    }

    openItem(item: GitHubSearchResultItem) {
        return new OpenedGitHubStream(
            Object.assign({}, this, {
                item
            })
        );
    }

    static fromJSON(json: OpenedGitHubStreamJSON): OpenedGitHubStream {
        return new OpenedGitHubStream({
            gitHubSearchStreamId: new Identifier<GitHubSearchStream>(json.gitHubSearchStreamId),
            item: json.item ? GitHubSearchResultItem.fromJSON(json.item) : undefined
        });
    }

    toJSON(): OpenedGitHubStreamJSON {
        return {
            type: "OpenedGitHubStream",
            gitHubSearchStreamId: this.gitHubSearchStreamId.toValue(),
            item: this.item ? this.item.toJSON() : undefined
        };
    }
}
