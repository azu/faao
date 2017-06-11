// MIT © 2017 azu
import { GitHubSearchQuery, GitHubSearchQueryJSON } from "./GitHubSearchQuery";

export interface GitHubSearchListJSON {
    name: string;
    queries: GitHubSearchQueryJSON[];
}

let GitHubSearchListID = 0;

export interface GitHubSearchListArgs {
    name: string;
    queries: GitHubSearchQuery[];
}

export class GitHubSearchList {
    id: string;
    name: string;
    queries: GitHubSearchQuery[];

    constructor(args: GitHubSearchListArgs) {
        this.id = `GitHubSearchList${GitHubSearchListID++}`;
        this.name = args.name;
        this.queries = args.queries;
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

    includesQuery(aQuery: GitHubSearchQuery): boolean {
        return this.queries.some(query => {
            return query.equals(aQuery);
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
