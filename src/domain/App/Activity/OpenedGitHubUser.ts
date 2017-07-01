// MIT © 2017 azu
import {
    GitHubSearchResultItem,
    GitHubSearchResultItemJSON
} from "../../GitHubSearchStream/GitHubSearchResultItem";
import { Identifier } from "../../Entity";
import { GitHubUser } from "../../GitHubUser/GitHubUser";

export interface OpenedGitHubUserJSON {
    type: "OpenedGitHubUser";
    gitHubUserId: string;
    item?: GitHubSearchResultItemJSON;
}

export interface OpenedGitHubUserArgs {
    gitHubUserId: Identifier<GitHubUser>;
    item?: GitHubSearchResultItem;
}

export const isOpenedGitHubUser = (v: any): v is OpenedGitHubUser => {
    return v instanceof OpenedGitHubUser;
};
export class OpenedGitHubUser implements OpenedGitHubUserArgs {
    gitHubUserId: Identifier<GitHubUser>;
    item?: GitHubSearchResultItem;

    constructor(args: OpenedGitHubUserArgs) {
        this.gitHubUserId = args.gitHubUserId;
        this.item = args.item;
    }

    openItem(item: GitHubSearchResultItem) {
        return new OpenedGitHubUser(
            Object.assign({}, this, {
                item
            })
        );
    }

    static fromJSON(json: OpenedGitHubUserJSON): OpenedGitHubUser {
        return new OpenedGitHubUser({
            gitHubUserId: new Identifier<GitHubUser>(json.gitHubUserId),
            item: json.item ? GitHubSearchResultItem.fromJSON(json.item) : undefined
        });
    }

    toJSON(): OpenedGitHubUserJSON {
        return {
            type: "OpenedGitHubUser",
            gitHubUserId: this.gitHubUserId.toValue(),
            item: this.item ? this.item.toJSON() : undefined
        };
    }
}
