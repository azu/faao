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

    equals(id: EntityId<Entity>) {
        return id.toValue() === this.value;
    }

    toValue() {
        return this.value;
    }
}