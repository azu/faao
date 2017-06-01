// MIT © 2017 azu
export class GitHubSettingId {
    constructor(private value: string) {
        this.value = value;
    }

    equals(id: GitHubSettingId) {
        return id.toValue() === this.value;
    }

    toValue() {
        return this.value;
    }
}