// MIT © 2017 azu
import { EntityId } from "../util/EntityId";

export type GitHubSettingJSON = {
    [P in keyof GitHubSetting]: GitHubSetting[P];
    }

export class GitHubSetting {
    id: EntityId<GitHubSetting>;
    token: string;
    apiHost: string;
    webHost: string;

    constructor(id: EntityId<GitHubSetting>, token: string, apiHost: string, webHost: string) {
        this.id = id;// unique
        this.token = token;
        this.apiHost = apiHost;
        this.webHost = webHost;
    }

    toJSON() {
        return {
            id: this.id.toValue(),
            token: this.token,
            apiHost: this.apiHost,
            webHost: this.webHost
        }
    }
}