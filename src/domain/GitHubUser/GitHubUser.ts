// MIT © 2017 azu
import { Entity, Identifier } from "../Entity";
import { GitHubUserActivity, GitHubUserActivityJSON } from "./GitHubUserActivity";
import { GitHubUserProfile, GitHubUserProfileJSON } from "./GitHubUserProfile";
import { GitHubUserActivityEvent } from "./GitHubUserActivityEvent";

export interface GitHubUserJSON {
    id: string;
    profile?: GitHubUserProfileJSON;
    activity: GitHubUserActivityJSON;
}

export interface GitHubUserArgs {
    id: Identifier<GitHubUser>;
    profile?: GitHubUserProfile;
    activity: GitHubUserActivity;
}

export class GitHubUser extends Entity<Identifier<GitHubUser>> implements GitHubUserArgs {
    profile?: GitHubUserProfile;
    activity: GitHubUserActivity;

    constructor(args: GitHubUserArgs) {
        super(args.id);
        this.activity = args.activity;
        this.profile = args.profile;
    }

    updateProfile(profile: GitHubUserProfile): void {
        this.profile = profile;
    }

    /**
     * return true If need more previous events
     */
    needMorePreviousEvents(events: GitHubUserActivityEvent[]): boolean {
        return events.some(event => !this.activity.hasRecordedEvent(event));
    }

    static fromJSON(json: GitHubUserJSON): GitHubUser {
        return new GitHubUser({
            id: new Identifier<GitHubUser>(json.id),
            activity: GitHubUserActivity.fromJSON(json.activity),
            profile: json.profile ? GitHubUserProfile.fromJSON(json.profile) : undefined
        });
    }

    toJSON(): GitHubUserJSON {
        return {
            id: this.id.toValue(),
            activity: this.activity.toJSON(),
            profile: this.profile ? this.profile.toJSON() : undefined
        };
    }
}
