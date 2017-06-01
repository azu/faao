// MIT © 2017 azu
export class GitHubSearchQueryColor {
    hexCode: string;

    constructor(hexCode: string) {
        this.hexCode = hexCode;
    }

    static createFromHexCode(hexCode: string) {
        return new this(hexCode);
    }
}