// MIT © 2017 azu
import MapLike from "map-like";
import * as assert from "assert";

export interface Entity {
    id: string;
}

const key = "__lastUsed__";

export class BaseRepository<T extends Entity> {
    private initialEntity: T;

    map: MapLike<Entity["id"], T>;

    constructor(initialEntity: T) {
        this.initialEntity = initialEntity;
        this.map = new MapLike<Entity["id"], T>();
    }

    get(): T {
        return this.map.get(key) || this.initialEntity;
    }

    findById(entityId: Entity["id"]): T | undefined {
        return this.map.get(entityId);
    }

    save(entity: T): void {
        this.map.set(key, entity);
        assert.ok(typeof entity.id !== "undefined", "Entity should have id property for key");
        this.map.set(entity.id, entity);
    }

    clear(): void {
        this.map.clear();
    }
}