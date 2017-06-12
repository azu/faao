import { NonNullableBaseRepository } from "./NonNullableBaseRepository";
import { GitHubSettingFactory } from "../../domain/GitHubSetting/GitHubSettingsFactory";
import { GitHubSetting, GitHubSettingJSON } from "../../domain/GitHubSetting/GitHubSetting";
import { EntityId } from "../../domain/Entity";
import { createStorageInstance } from "./Storage";

const debug = require("debug")("faao:GitHubSettingRepository");

export class GitHubSettingRepository extends NonNullableBaseRepository<GitHubSetting> {
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

    findAll(): GitHubSetting[] {
        return this.map.values();
    }

    findGitHubSettingById(id: EntityId<GitHubSetting>): GitHubSetting | undefined {
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
}

export const gitHubSettingRepository = new GitHubSettingRepository(GitHubSettingFactory.create());
