// MIT © 2017 azu
import { Entity, Identifier } from "../Entity";

export interface GitHubSettingJSON {
    id: string;
    token: string;
    apiHost: string;
    webHost: string;
}

export class GitHubSetting extends Entity<Identifier<GitHubSetting>> {
    id: Identifier<GitHubSetting>;
    token: string;
    apiHost: string;
    webHost: string;

    constructor(id: Identifier<GitHubSetting>, token: string, apiHost: string, webHost: string) {
        super(id);
        this.token = token;
        this.apiHost = apiHost;
        this.webHost = webHost;
    }

    static fromJSON(json: GitHubSettingJSON): GitHubSetting {
        const setting = Object.create(GitHubSetting.prototype);
        return Object.assign(setting, json, {
            id: new Identifier(json.id)
        });
    }

    toJSON(): GitHubSettingJSON {
        return Object.assign({}, this, {
            id: this.id.toValue()
        });
    }
}
