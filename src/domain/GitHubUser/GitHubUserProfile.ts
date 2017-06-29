// MIT © 2017 azu
import { ValueObject } from "../ValueObject";

export interface GitHubUserProfileJSON {
    loginName: string;
    avatarURL: string;
}

export class GitHubUserProfile extends ValueObject {
    loginName: string;
    avatarURL: string;

    constructor(args: GitHubUserProfileJSON) {
        super();
        this.loginName = args.loginName;
        this.avatarURL = args.avatarURL;
    }

    static fromJSON(profile: GitHubUserProfileJSON) {
        return new GitHubUserProfile({
            loginName: profile.loginName,
            avatarURL: profile.avatarURL
        });
    }

    toJSON(): GitHubUserProfileJSON {
        return {
            loginName: this.loginName,
            avatarURL: this.avatarURL
        };
    }
}
