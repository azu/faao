// MIT © 2017 azu
import { GitHubSearchQueryColor } from "./GitHubSearchQueryColor";

export type GitHubSearchQueryJSON = {
    [P in keyof GitHubSearchQuery]: GitHubSearchQuery[P];
    }

export class GitHubSearchQuery {
    name: string;
    query: string;
    color: GitHubSearchQueryColor;
    apiHost: string;

    constructor(object: GitHubSearchQueryJSON) {
        this.name = object.name;
        this.query = object.query;
        this.color = object.color;
        this.apiHost = object.apiHost;
    }

    /**
     * unique hash value
     * @returns {string}
     */
    get hash() {
        return `${this.name}-${this.query}-${this.apiHost}`;
    }
}