// MIT © 2017 azu
import { Entity, Identifier } from "../../domain/Entity";
import { EntityMap } from "./EntityMap";

export class NullableBaseRepository<T extends Entity<Identifier<T>>> {
    map: EntityMap<T>;
    private lastUsed: T | null = null;
    private initialEntity: T | undefined;

    constructor(initialEntity?: T) {
        this.initialEntity = initialEntity;
        this.map = new EntityMap<T>();
    }

    get(): T | undefined {
        return this.lastUsed || this.initialEntity;
    }

    findById(entityId?: string | Identifier<T>): T | undefined {
        if (!entityId) {
            return;
        }
        return this.map.get(entityId);
    }

    findAll(): T[] {
        return this.map.values();
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
