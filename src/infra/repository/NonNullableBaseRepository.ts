// MIT © 2017 azu
import { EntityMap } from "./EntityMap";
import { Entity, EntityId } from "../../domain/Entity";

/**
 * It disallow that `Repository#get()` return null
 *    ---
 *
 * Difference with NullableBaseRepository
 *
 * - Should setup with `initialEntity`
 * - Repository#get() always return value
 */
export class NonNullableBaseRepository<T extends Entity> {
    map: EntityMap<T>;
    private lastUsed: T | null;

    constructor(protected initialEntity: T) {
        this.initialEntity = initialEntity;
        this.map = new EntityMap<T>();
    }

    get(): T {
        return this.lastUsed || this.initialEntity;
    }

    findById(entityId: string | EntityId<T>): T | undefined {
        return this.map.get(entityId);
    }

    save(entity: T): void {
        this.lastUsed = entity;
        this.map.set(entity.id, entity);
    }

    delete(entity: T) {
        this.map.delete(entity.id);
        if (this.lastUsed === entity) {
            this.lastUsed = null;
        }
    }

    clear(): void {
        this.lastUsed = null;
        this.map.clear();
    }
}
