// MIT © 2017 azu
// global uuid
let id = 0;

/**
 * ## example
 *
 * type id = EntityId<GitHubSetting>
 */
export class EntityId<Entity> {
    entity?: Entity;

    constructor(private value?: string) {
        this.value = value || String(id++);
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
