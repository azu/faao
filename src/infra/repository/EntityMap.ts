// MIT © 2017 azu
import { MapLike } from "map-like";
import { Entity, Identifier } from "../../domain/Entity";

export const toKey = (entityId: string | Identifier<any>): string => {
    if (entityId instanceof Identifier) {
        return entityId.toValue();
    } else {
        return entityId;
    }
};

/**
 * MapLike wrapper class
 * It has convention EntityId<Entity> <-> string
 */
export class EntityMap<T extends Entity<Identifier<T>>> extends MapLike<string | Identifier<T>, T> {
    get(entityId: string | Identifier<T>): T | undefined {
        return super.get(toKey(entityId));
    }

    has(entityId: string | Identifier<T>): boolean {
        return super.has(toKey(entityId));
    }

    set(entityId: string | Identifier<T>, value?: T): this {
        return super.set(toKey(entityId), value);
    }

    delete(entityId: string | Identifier<T>): boolean {
        return super.delete(toKey(entityId));
    }
}
