// MIT © 2017 azu
export type GitHubSettingJSON = {
    [P in keyof GitHubSetting]: GitHubSetting[P];
    }

export class GitHubSetting {
    token: string;
    apiHost: string;
    webHost: string;

    constructor(token: string, apiHost: string, webHost: string) {
        this.token = token;
        this.apiHost = apiHost;
        this.webHost = webHost;
    }
}