// MIT © 2017 azu
import { GitHubSearchQuery } from "./GitHubSearchQuery";
import uniquBy from "lodash.uniqby";

export type TO_JSON<T> = { [P in keyof T]: T[P] };

export interface GitHubSearchListJSON {
    queries: TO_JSON<GitHubSearchQuery>[];
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
        };
    }

    saveQuery(aQuery: GitHubSearchQuery) {
        this.queries = this.queries.concat(aQuery);
    }

    updateQuery(query: GitHubSearchQuery, index: number) {
        if (!this.queries[index]) {
            return;
        }
        this.queries[index] = query;
        this.queries = this.queries.slice();
    }
}
