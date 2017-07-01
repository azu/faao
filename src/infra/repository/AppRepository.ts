// MIT © 2017 azu

import { App, AppJSON } from "../../domain/App/App";
import { AppFactory } from "../../domain/App/AppFactory";
import { NonNullableBaseRepository } from "./NonNullableBaseRepository";
import { createStorageInstance } from "./Storage";

const debug = require("debug")("faao:AppRepository");

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
        const values: AppJSON[] = [];
        await this.storage.iterate(value => {
            values.push(value);
        });
        values
            .map(json => {
                try {
                    return App.fromJSON(json);
                } catch (error) {
                    // TODO: ???
                    this.storage.removeItem(json.id);
                    return this.initialEntity;
                }
            })
            .forEach(app => {
                this.map.set(app.id, app);
                this.lastUsed = app;
            });
        return this;
    }

    save(entity: App): Promise<void> {
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

export const appRepository = new AppRepository(AppFactory.create());
