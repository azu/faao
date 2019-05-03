// MIT © 2017 azu

export abstract class Entity<Id extends Identifier<any>> {
    public readonly id: Id;

    constructor(id: Id) {
        this.id = id;
    }

    equals(object: Entity<Id>): boolean {
        if (object == null) {
            return false;
        }
        if (this === object) {
            return true;
        }
        return this.id.equals(object.id);
    }
}

/**
 * ## example
 *
 * type id = Identifier<GitHubSetting>
 */
export class Identifier<T> {
    entity?: T;

    constructor(private value: string) {
        this.value = value;
    }

    equals(id?: Identifier<T>): boolean {
        if (id === null || id === undefined) {
            return false;
        }
        if (!(id instanceof Identifier)) {
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

    toJSON() {
        return this.toValue();
    }
}
