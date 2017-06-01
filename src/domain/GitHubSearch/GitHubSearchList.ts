// MIT © 2017 azu
import { GitHubSearchQuery } from "./GitHubSearchQuery";

export type TO_JSON<T> = {
    [P in keyof T]: T[P];
    };

export interface GitHubSearchListJSON {
    queries: TO_JSON<GitHubSearchQuery>[]
}

let GitHubSearchListID = 0;

export class GitHubSearchList {
    id: string;
    queries: GitHubSearchQuery[];

    constructor(queries: GitHubSearchQuery[]) {
        this.id = `GitHubSearchList${GitHubSearchListID++}`;
        this.queries = queries;
    }

    static fromJSON(json: GitHubSearchListJSON) {
        return new GitHubSearchList(json.queries);
    }

    toJSON(): GitHubSearchListJSON {
        return {
            queries: this.queries
        }
    }
}