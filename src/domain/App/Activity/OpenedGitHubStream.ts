// MIT © 2017 azu
import { Identifier } from "../../Entity";
import { GitHubSearchStream } from "../../GitHubSearchStream/GitHubSearchStream";
import { GitHubActiveItem, GitHubActiveItemJSON } from "./GitHubActiveItem";

export interface OpenedGitHubStreamJSON {
    type: "OpenedGitHubStream";
    gitHubSearchStreamId: string;
    item?: GitHubActiveItemJSON;
}

export interface OpenedGitHubStreamArgs {
    gitHubSearchStreamId: Identifier<GitHubSearchStream>;
    item?: GitHubActiveItem;
}

export const isOpenedGitHubStream = (v: any): v is OpenedGitHubStream => {
    return v instanceof OpenedGitHubStream && v.type === "OpenedGitHubStream";
};

export class OpenedGitHubStream implements OpenedGitHubStreamArgs {
    readonly type = "OpenedGitHubStream";
    gitHubSearchStreamId: Identifier<GitHubSearchStream>;
    item?: GitHubActiveItem;

    constructor(args: OpenedGitHubStreamArgs) {
        this.gitHubSearchStreamId = args.gitHubSearchStreamId;
        this.item = args.item;
    }

    openItem(item: GitHubActiveItem) {
        return new OpenedGitHubStream(
            Object.assign({}, this, {
                item
            })
        );
    }

    static fromJSON(json: OpenedGitHubStreamJSON): OpenedGitHubStream {
        return new OpenedGitHubStream({
            gitHubSearchStreamId: new Identifier<GitHubSearchStream>(json.gitHubSearchStreamId),
            item: json.item ? GitHubActiveItem.fromJSON(json.item) : undefined
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
