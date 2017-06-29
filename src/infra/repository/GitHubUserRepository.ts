// MIT © 2017 azu
import { createStorageInstance } from "./Storage";
import { GitHubUser, GitHubUserJSON } from "../../domain/GitHubUser/GitHubUser";
import { NullableBaseRepository } from "./NullableBaseRepository";
import { GitHubSetting } from "../../domain/GitHubSetting/GitHubSetting";
import { Identifier } from "../../domain/Entity";

const debug = require("debug")("faao:GitHubUserRepository");

export class GitHubUserRepository extends NullableBaseRepository<GitHubUser> {
    storage: LocalForage;

    /**
     * Please call this before find* API
     * @returns {Promise<any>}
     */
    async ready(): Promise<this> {
        if (this.map.size > 0) {
            return Promise.resolve(this);
        }
        this.storage = createStorageInstance({
            name: "GitHubUserRepository"
        });
        await this.storage.ready();
        const values: GitHubUserJSON[] = [];
        await this.storage.iterate(value => {
            values.push(value);
        });
        values
            .map(json => {
                return GitHubUser.fromJSON(json);
            })
            .forEach(user => {
                this.map.set(user.id, user);
            });
        return this;
    }

    save(entity: GitHubUser): Promise<void> {
        super.save(entity);
        return this.storage.setItem(entity.id.toValue(), entity.toJSON()).then(() => {
            debug("Save entity to GitHubUserRepository");
        });
    }

    clear() {
        super.clear();
        return this.storage.clear();
    }

    findBySettingId(id?: Identifier<GitHubSetting>): GitHubUser | undefined {
        if (!id) {
            return undefined;
        }
        return this.map.get(id.toValue());
    }
}

export const gitHubUserRepository = new GitHubUserRepository();
