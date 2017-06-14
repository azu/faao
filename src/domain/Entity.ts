// MIT © 2017 azu
const ulid = require("ulid");

export interface Entity {
    id: string | EntityId<any>;
}

/**
 * ## example
 *
 * type id = EntityId<GitHubSetting>
 */
export class EntityId<Entity> {
    entity?: Entity;

    constructor(private value?: string) {
        this.value = value || ulid();
    }

    equals(id: EntityId<Entity>): boolean {
        if (id === null) {
            return false;
        }
        if (!(id instanceof EntityId)) {
            return false;
        }
        return id.toValue() === this.value;
    }

    toString() {
        return this.value;
    }

    toValue(): string {
        return this.value!;
    }
}
