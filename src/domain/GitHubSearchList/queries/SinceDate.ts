export class SinceDate {
    private unixTime: number;

    constructor(unixTime: number = Date.now()) {
        if (typeof unixTime !== "number" || Number.isNaN(unixTime) || unixTime < 0) {
            throw new Error("Invalid SinceDate: " + unixTime);
        }
        this.unixTime = unixTime;
    }

    static fromJSON(json: ReturnType<typeof SinceDate.prototype.toJSON>): SinceDate {
        return new SinceDate(json.unixTime);
    }

    toISODate() {
        return new Date(this.unixTime).toISOString();
    }

    toJSON() {
        return {
            unixTime: this.unixTime
        };
    }
}
