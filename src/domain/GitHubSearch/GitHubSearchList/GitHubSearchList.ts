// MIT © 2017 azu
import { GitHubSearchQuery, GitHubSearchQueryJSON } from "./GitHubSearchQuery";

export interface GitHubSearchListJSON {
    queries: GitHubSearchQueryJSON[];
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
        const list = Object.create(GitHubSearchList.prototype);
        return Object.assign(list, json, {
            queries: json.queries.map(query => GitHubSearchQuery.fromJSON(query))
        });
    }

    toJSON(): GitHubSearchListJSON {
        return Object.assign({}, this, {
            queries: this.queries.map(query => query.toJSON())
        });
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

    deleteQuery(aQuery: GitHubSearchQuery) {
        const index = this.queries.indexOf(aQuery);
        if (index === -1) {
            return;
        }
        this.queries.splice(index, 1);
        this.queries = this.queries.slice();
    }
}
