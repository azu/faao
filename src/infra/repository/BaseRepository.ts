// MIT © 2017 azu
import MapLike from "map-like";
import * as assert from "assert";
import { EntityId } from "../../domain/util/EntityId";

export interface Entity {
    id: string | EntityId<any>;
}

export class BaseRepository<T extends Entity> {
    private initialEntity: T;

    private lastUsed: T | null;
    map: MapLike<Entity["id"], T>;

    constructor(initialEntity: T) {
        this.initialEntity = initialEntity;
        this.map = new MapLike<Entity["id"], T>();
        this.save(initialEntity);
    }

    get(): T {
        return this.lastUsed || this.initialEntity;
    }

    findById(entityId: Entity["id"]): T | undefined {
        if (entityId instanceof EntityId) {
            return this.map.get(entityId.toValue());
        } else {
            return this.map.get(entityId);
        }
    }

    save(entity: T): void {
        this.lastUsed = entity;
        assert.ok(typeof entity.id !== "undefined", "Entity should have id property for key");
        if (entity.id instanceof EntityId) {
            this.map.set(entity.id.toValue(), entity);
        } else {
            this.map.set(entity.id, entity);
        }
    }

    clear(): void {
        this.lastUsed = null;
        this.map.clear();
    }
}
