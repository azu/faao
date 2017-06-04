// MIT © 2017 azu
import MapLike from "map-like";
import * as assert from "assert";
import { EntityId } from "../../domain/util/EntityId";

export interface Entity {
    id: string | EntityId<any>;
}

const LAST_USED = "__lastUsed__";

export class BaseRepository<T extends Entity> {
    private initialEntity: T;

    map: MapLike<Entity["id"], T>;

    constructor(initialEntity: T) {
        this.initialEntity = initialEntity;
        this.map = new MapLike<Entity["id"], T>();
        this.save(initialEntity);
    }

    get(): T {
        return this.map.get(LAST_USED) || this.initialEntity;
    }

    findById(entityId: Entity["id"]): T | undefined {
        if (entityId instanceof EntityId) {
            return this.map.get(entityId.toValue());
        } else {
            return this.map.get(entityId);
        }
    }

    save(entity: T): void {
        this.map.set(LAST_USED, entity);
        assert.ok(typeof entity.id !== "undefined", "Entity should have id property for key");
        if (entity.id instanceof EntityId) {
            this.map.set(entity.id.toValue(), entity);
        } else {
            this.map.set(entity.id, entity);
        }
    }

    clear(): void {
        this.map.clear();
    }
}