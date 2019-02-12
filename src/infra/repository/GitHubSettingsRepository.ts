import { GitHubSetting, GitHubSettingJSON } from "../../domain/GitHubSetting/GitHubSetting";
import { Identifier } from "../../domain/Entity";
import { createStorageInstance } from "./Storage";
import { NullableBaseRepository } from "./NullableBaseRepository";
import { GitHubUser } from "../../domain/GitHubUser/GitHubUser";

const debug = require("debug")("faao:GitHubSettingRepository");

export class GitHubSettingRepository extends NullableBaseRepository<GitHubSetting> {
    storage!: LocalForage;

    /**
     * Please call this before find* API
     * @returns {Promise<any>}
     */
    async ready(): Promise<this> {
        if (this.map.size > 0) {
            return Promise.resolve(this);
        }
        this.storage = createStorageInstance({
            name: "GitHubSettingRepository"
        });
        await this.storage.ready();
        const values: GitHubSettingJSON[] = [];
        await this.storage.iterate(value => {
            values.push(value);
        });
        values
            .map(json => {
                return GitHubSetting.fromJSON(json);
            })
            .forEach(gitHubSetting => {
                this.map.set(gitHubSetting.id.toValue(), gitHubSetting);
            });
        return this;
    }

    findGitHubSettingById(id: Identifier<GitHubSetting>): GitHubSetting | undefined {
        return this.findById(id);
    }

    save(entity: GitHubSetting): Promise<void> {
        super.save(entity);
        return this.storage.setItem(entity.id.toValue(), entity.toJSON()).then(() => {
            debug("Save entity");
        });
    }

    replace(prevSetting: GitHubSetting, newSetting: GitHubSetting): Promise<void> {
        newSetting.id = prevSetting.id;
        return this.save(newSetting);
    }

    delete(setting: GitHubSetting): Promise<void> {
        super.delete(setting);
        return this.storage.removeItem(setting.id.toValue());
    }

    clear() {
        super.clear();
        return this.storage.clear();
    }

    findByGitHubUserId(openedUserId: Identifier<GitHubUser>) {
        return this.map.values().find(setting => {
            return openedUserId.equals(setting.gitHubUserId);
        });
    }
}

export const gitHubSettingRepository = new GitHubSettingRepository();
