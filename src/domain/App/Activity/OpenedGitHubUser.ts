// MIT © 2017 azu
import { Identifier } from "../../Entity";
import { GitHubUser } from "../../GitHubUser/GitHubUser";
import {
    GitHubUserActivityEvent,
    GitHubUserActivityEventJSON
} from "../../GitHubUser/GitHubUserActivityEvent";

export interface OpenedGitHubUserJSON {
    type: "OpenedGitHubUser";
    gitHubUserId: string;
    event?: GitHubUserActivityEventJSON;
}

export interface OpenedGitHubUserArgs {
    gitHubUserId: Identifier<GitHubUser>;
    event?: GitHubUserActivityEvent;
}

export const isOpenedGitHubUser = (v: any): v is OpenedGitHubUser => {
    return v instanceof OpenedGitHubUser && v.type === "OpenedGitHubUser";
};

export class OpenedGitHubUser implements OpenedGitHubUserArgs {
    readonly type = "OpenedGitHubUser";
    gitHubUserId: Identifier<GitHubUser>;
    event?: GitHubUserActivityEvent;

    constructor(args: OpenedGitHubUserArgs) {
        this.gitHubUserId = args.gitHubUserId;
        this.event = args.event;
    }

    openEvent(event: GitHubUserActivityEvent) {
        return new OpenedGitHubUser({
            ...this as OpenedGitHubUserArgs,
            event
        });
    }

    static fromJSON(json: OpenedGitHubUserJSON): OpenedGitHubUser {
        return new OpenedGitHubUser({
            gitHubUserId: new Identifier<GitHubUser>(json.gitHubUserId),
            event: json.event ? GitHubUserActivityEvent.fromJSON(json.event) : undefined
        });
    }

    toJSON(): OpenedGitHubUserJSON {
        return {
            type: "OpenedGitHubUser",
            gitHubUserId: this.gitHubUserId.toValue(),
            event: this.event ? this.event.toJSON() : undefined
        };
    }
}
