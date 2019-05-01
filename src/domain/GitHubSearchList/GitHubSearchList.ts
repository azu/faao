// MIT © 2017 azu
import { GitHubSearchQuery, GitHubSearchQueryJSON, isGitHubSearchQuery } from "./GitHubSearchQuery";
import { Entity, Identifier } from "../Entity";
import { splice } from "@immutable-array/prototype";
import { FaaoSearchQuery, FaaoSearchQueryJSON } from "./FaaoSearchQuery";

export interface GitHubSearchListJSON {
    id: string;
    name: string;
    queries: (GitHubSearchQueryJSON | FaaoSearchQueryJSON)[];
}

export interface GitHubSearchListArgs {
    id: Identifier<GitHubSearchList>;
    name: string;
    queries: (GitHubSearchQuery | FaaoSearchQuery)[];
}

export const isSearchQueryJSON = (query: any): query is GitHubSearchQueryJSON => {
    return query.query !== undefined;
};

export class GitHubSearchList extends Entity<Identifier<GitHubSearchList>> {
    readonly id: Identifier<GitHubSearchList>;
    readonly name: string;
    queries: (GitHubSearchQuery | FaaoSearchQuery)[];

    constructor(args: GitHubSearchListArgs) {
        super(args.id);
        this.id = args.id;
        this.name = args.name;
        this.queries = args.queries;
    }

    static fromJSON(json: GitHubSearchListJSON) {
        const list = Object.create(GitHubSearchList.prototype);
        return Object.assign(list, json, {
            id: new Identifier<GitHubSearchList>(json.id),
            queries: json.queries.map(query => {
                if (isSearchQueryJSON(query)) {
                    return GitHubSearchQuery.fromJSON(query);
                } else {
                    return FaaoSearchQuery.fromJSON(query);
                }
            })
        });
    }

    toJSON(): GitHubSearchListJSON {
        return Object.assign({}, this, {
            id: this.id.toValue(),
            queries: this.queries.map(query => query.toJSON())
        });
    }

    get githubSearchQueries(): GitHubSearchQuery[] {
        return this.queries.filter(query => isGitHubSearchQuery(query)) as GitHubSearchQuery[];
    }

    includesQuery(aQuery: GitHubSearchQuery | FaaoSearchQuery): boolean {
        return this.queries.some(query => {
            return query.equals(aQuery);
        });
    }

    saveQuery(aQuery: GitHubSearchQuery) {
        this.queries = this.queries.concat(aQuery);
    }

    replaceQuery(oldQuery: GitHubSearchQuery, newQuery: GitHubSearchQuery) {
        const index = this.queries.indexOf(oldQuery);
        if (!this.queries[index]) {
            return;
        }
        this.queries = splice(this.queries, index, 1, newQuery);
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
