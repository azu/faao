// MIT © 2017 azu
import { Entity, Identifier } from "../Entity";
import { GitHubUserActivity, GitHubUserActivityJSON } from "./GitHubUserActivity";

export interface GitHubUserJSON {
    id: string;
    activity: GitHubUserActivityJSON;
}

export interface GitHubUserArgs {
    id: Identifier<GitHubUser>;
    activity: GitHubUserActivity;
}

export class GitHubUser extends Entity<Identifier<GitHubUser>> {
    activity: GitHubUserActivity;

    constructor(args: GitHubUserArgs) {
        super(args.id);
        this.activity = args.activity;
    }

    static fromJSON(json: GitHubUserJSON): GitHubUser {
        return new GitHubUser({
            id: new Identifier<GitHubUser>(json.id),
            activity: GitHubUserActivity.fromJSON(json.activity)
        });
    }

    toJSON(): GitHubUserJSON {
        return {
            id: this.id.toValue(),
            activity: this.activity.toJSON()
        };
    }
}
