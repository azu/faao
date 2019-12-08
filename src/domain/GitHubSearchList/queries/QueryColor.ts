// MIT © 2017 azu
export class QueryColor {
    hexCode: string;

    static createFromHexCode(hexCode: string) {
        return new this(hexCode);
    }

    constructor(hexCode: string) {
        this.hexCode = hexCode;
    }
}
