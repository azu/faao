// MIT © 2017 azu
import {
    GitHubSearchQuery,
    GitHubSearchQueryJSON,
    isGitHubSearchQuery,
    isGitHubSearchQueryJSON
} from "./GitHubSearchQuery";
import { Entity, Identifier } from "../Entity";
import { splice } from "@immutable-array/prototype";
import {
    FaaoSearchQuery,
    FaaoSearchQueryJSON,
    isFaaoSearchQuery,
    isFaaoSearchQueryJSON
} from "./FaaoSearchQuery";
import { FaaoSearchQueryParam } from "./FaaoSearchQueryParam";

export type UnionQuery = FaaoSearchQuery | GitHubSearchQuery;
export type UnionQueryJSON = FaaoSearchQueryJSON | GitHubSearchQueryJSON;

export interface GitHubSearchListJSON {
    id: string;
    name: string;
    queries: UnionQueryJSON[];
}

export interface GitHubSearchListArgs {
    id: Identifier<GitHubSearchList>;
    name: string;
    queries: UnionQuery[];
}

export class GitHubSearchList extends Entity<Identifier<GitHubSearchList>> {
    readonly id: Identifier<GitHubSearchList>;
    readonly name: string;
    queries: UnionQuery[];

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
                if (isGitHubSearchQueryJSON(query)) {
                    return GitHubSearchQuery.fromJSON(query);
                } else if (isFaaoSearchQueryJSON(query)) {
                    return FaaoSearchQuery.fromJSON(query);
                }
                console.error("Unknown query type", query);
                throw new Error("Unknown query type");
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

    get faaoSearchQueries(): FaaoSearchQuery[] {
        return this.queries.filter(query => isFaaoSearchQuery(query)) as FaaoSearchQuery[];
    }

    addNewUrlToFaaoQuery(url: string, queryName: string) {
        const query = this.queries.find(query => {
            return query.name === queryName;
        });
        if (!query || !isFaaoSearchQuery(query)) {
            return this;
        }
        const newQuery = query.addParam(new FaaoSearchQueryParam({ url }));
        return this.replaceQuery(query, newQuery);
    }

    includesQuery(aQuery: UnionQuery): boolean {
        return this.queries.some(query => {
            return query.equals(aQuery);
        });
    }

    findQueryByName(queryName: string): UnionQuery | undefined {
        return this.queries.find(query => {
            return query.name === queryName;
        });
    }
    // prefer to use includesQuery
    includesQueryName(queryName: string): boolean {
        return this.queries.some(query => {
            return query.name === queryName;
        });
    }

    saveQuery(aQuery: UnionQuery) {
        return new GitHubSearchList({
            ...this,
            queries: this.queries.concat(aQuery)
        });
    }

    replaceQuery(oldQuery: UnionQuery, newQuery: UnionQuery) {
        const index = this.queries.indexOf(oldQuery);
        if (!this.queries[index]) {
            return this;
        }
        return new GitHubSearchList({
            ...this,
            queries: splice(this.queries, index, 1, newQuery)
        });
    }

    deleteQuery(aQuery: UnionQuery) {
        const index = this.queries.indexOf(aQuery);
        if (index === -1) {
            return this;
        }
        return new GitHubSearchList({
            ...this,
            queries: splice(this.queries, index, 1)
        });
    }
}
