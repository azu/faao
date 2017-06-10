// MIT © 2017 azu
import { EntityId } from "../util/EntityId";

export interface GitHubSettingJSON {
    id: string;
    token: string;
    apiHost: string;
    webHost: string;
}

export class GitHubSetting {
    id: EntityId<GitHubSetting>;
    token: string;
    apiHost: string;
    webHost: string;

    constructor(id: EntityId<GitHubSetting>, token: string, apiHost: string, webHost: string) {
        this.id = id; // unique
        this.token = token;
        this.apiHost = apiHost;
        this.webHost = webHost;
    }

    static fromJSON(json: GitHubSettingJSON): GitHubSetting {
        const setting = Object.create(GitHubSetting.prototype);
        return Object.assign(setting, json, {
            id: new EntityId(json.id)
        });
    }

    toJSON(): GitHubSettingJSON {
        return Object.assign({}, this, {
            id: this.id.toValue()
        });
    }
}
