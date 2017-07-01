// MIT © 2017 azu
import { Entity, Identifier } from "../Entity";
import { GitHubUser } from "../GitHubUser/GitHubUser";

export interface GitHubSettingJSON {
    id: string;
    token: string;
    apiHost: string;
    webHost: string;
    // relationship
    gitHubUserId?: string;
}

export interface GitHubSettingArgs {
    id: Identifier<GitHubSetting>;
    token: string;
    apiHost: string;
    webHost: string;
    // Relationship
    gitHubUserId?: Identifier<GitHubUser>;
}

export class GitHubSetting extends Entity<Identifier<GitHubSetting>> implements GitHubSettingArgs {
    id: Identifier<GitHubSetting>;
    token: string;
    apiHost: string;
    webHost: string;
    gitHubUserId?: Identifier<GitHubUser>;

    constructor(args: GitHubSettingArgs) {
        super(args.id);
        this.token = args.token;
        this.apiHost = args.apiHost;
        this.webHost = args.webHost;
        this.gitHubUserId = args.gitHubUserId;
    }

    static fromJSON(json: GitHubSettingJSON): GitHubSetting {
        return new GitHubSetting({
            id: new Identifier<GitHubSetting>(json.id),
            token: json.token,
            apiHost: json.apiHost,
            webHost: json.webHost,
            gitHubUserId: json.gitHubUserId
                ? new Identifier<GitHubUser>(json.gitHubUserId)
                : undefined
        });
    }

    toJSON(): GitHubSettingJSON {
        return Object.assign({}, this, {
            id: this.id.toValue(),
            gitHubUserId: this.gitHubUserId ? this.gitHubUserId.toValue() : undefined
        });
    }

    setRelationshipWithGitHubUser(gitHubUser: GitHubUser) {
        this.gitHubUserId = gitHubUser.id;
    }
}
