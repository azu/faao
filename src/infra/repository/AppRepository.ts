// MIT © 2017 azu

import { App } from "../../domain/App/App";
import { AppFactory } from "../../domain/App/AppFactory";
import { NonNullableBaseRepository } from "./NonNullableBaseRepository";
import { createStorageInstance } from "./Storage";

export class AppRepository extends NonNullableBaseRepository<App> {
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
            name: "AppRepository"
        });
        await this.storage.ready();
        const values: GitHubSettingJSON[] = [];
        await this.storage.iterate(value => {
            values.push(value);
        });
        values
            .map(json => {
                return App.fromJSON(json);
            })
            .forEach(gitHubSetting => {
                this.map.set(gitHubSetting.id.toValue(), gitHubSetting);
            });
        return this;
    }
}

export const appRepository = new AppRepository(
    AppFactory.create({
        itemHistoryItems: []
    })
);
