// MIT © 2017 azu
import MapLike from "map-like";
import { Entity, EntityId } from "../../domain/Entity";

export const toKey = (entityId: string | EntityId<any>): string => {
    if (entityId instanceof EntityId) {
        return entityId.toValue();
    } else {
        return entityId;
    }
};

/**
 * MapLike wrapper class
 * It has convention EntityId<Entity> <-> string
 */
export class EntityMap<T extends Entity> extends MapLike<string | EntityId<T>, T> {
    get(entityId: string | EntityId<T>): T | undefined {
        return this.get(toKey(entityId));
    }

    has(entityId: string | EntityId<T>): boolean {
        return this.has(toKey(entityId));
    }

    set(entityId: string | EntityId<T>, value?: T): this {
        return this.set(toKey(entityId), value);
    }

    delete(entityId: string | EntityId<T>): boolean {
        return this.delete(toKey(entityId));
    }
}
