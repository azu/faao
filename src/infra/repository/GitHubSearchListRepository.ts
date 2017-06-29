// MIT © 2017 azu
import {
    GitHubSearchList,
    GitHubSearchListJSON
} from "../../domain/GitHubSearchList/GitHubSearchList";
import { GitHubSearchListFactory } from "../../domain/GitHubSearchList/GitHubSearchListFactory";
import { NonNullableBaseRepository } from "./NonNullableBaseRepository";
import { GitHubSearchQuery } from "../../domain/GitHubSearchList/GitHubSearchQuery";
import { createStorageInstance } from "./Storage";
import sortBy from "lodash.sortby";

const debug = require("debug")("faao:GitHubSearchListRepository");

export class GitHubSearchListRepository extends NonNullableBaseRepository<GitHubSearchList> {
    storage: LocalForage;

    constructor(protected initialEntity: GitHubSearchList) {
        super(initialEntity);
    }

    /**
     * Please call this before find* API
     * @returns {Promise<any>}
     */
    async ready(): Promise<this> {
        if (this.map.size > 0) {
            return Promise.resolve(this);
        }
        this.storage = createStorageInstance({
            name: "GitHubSearchListRepository"
        });
        await this.storage.ready();
        const values: GitHubSearchListJSON[] = [];
        await this.storage.iterate(value => {
            values.push(value);
        });
        if (values.length === 0) {
            await this.save(this.initialEntity);
        }
        values
            .map(json => {
                return GitHubSearchList.fromJSON(json);
            })
            .forEach(searchList => {
                this.map.set(searchList.id, searchList);
                this.lastUsed = searchList;
            });
        return this;
    }

    findAll(): GitHubSearchList[] {
        return this.map.values();
    }

    findAllSortBy(predicate: (searchList: GitHubSearchList) => any): GitHubSearchList[] {
        return sortBy(this.findAll(), predicate);
    }

    findByQuery(aQuery: GitHubSearchQuery): GitHubSearchList | undefined {
        return this.map.values().find(searchList => searchList.includesQuery(aQuery));
    }

    save(entity: GitHubSearchList): Promise<void> {
        super.save(entity);
        return this.storage.setItem(entity.id.toValue(), entity.toJSON()).then(() => {
            debug("Save entity");
        });
    }

    clear() {
        super.clear();
        return this.storage.clear();
    }
}

export const gitHubSearchListRepository = new GitHubSearchListRepository(
    GitHubSearchListFactory.createDefaultSearchList()
);
