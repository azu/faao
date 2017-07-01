// MIT © 2017 azu
import { GitHubSearchQuery, GitHubSearchQueryJSON } from "./GitHubSearchQuery";
import { Entity, Identifier } from "../Entity";
import { splice } from "@immutable-array/prototype";

export interface GitHubSearchListJSON {
    id: string;
    name: string;
    queries: GitHubSearchQueryJSON[];
}

export interface GitHubSearchListArgs {
    id: Identifier<GitHubSearchList>;
    name: string;
    queries: GitHubSearchQuery[];
}

export class GitHubSearchList extends Entity<Identifier<GitHubSearchList>> {
    id: Identifier<GitHubSearchList>;
    name: string;
    queries: GitHubSearchQuery[];

    constructor(args: GitHubSearchListArgs) {
        super(args.id);
        this.name = args.name;
        this.queries = args.queries;
    }

    static fromJSON(json: GitHubSearchListJSON) {
        const list = Object.create(GitHubSearchList.prototype);
        return Object.assign(list, json, {
            id: new Identifier<GitHubSearchList>(json.id),
            queries: json.queries.map(query => GitHubSearchQuery.fromJSON(query))
        });
    }

    toJSON(): GitHubSearchListJSON {
        return Object.assign({}, this, {
            id: this.id.toValue(),
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
