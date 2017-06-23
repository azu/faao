// MIT © 2017 azu

export interface Entity {
    id: string | Identifier<any>;
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

    equals(id: Identifier<T>): boolean {
        if (id === null) {
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
}
