// MIT © 2017 azu
import { Entity, EntityId } from "../../domain/Entity";
import { EntityMap } from "./EntityMap";

export class NullableBaseRepository<T extends Entity> {
    map: EntityMap<T>;
    private lastUsed: T | null;

    constructor(protected initialEntity?: T) {
        this.initialEntity = initialEntity;
        this.map = new EntityMap<T>();
    }

    get(): T | undefined {
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
