import { type } from "os";

const DEFAULT_INVALID_ETAG = "DEFAULT_INVALID_ETAG";

export class GitHubETag {
    private eTag: string;

    constructor(eTag: string = DEFAULT_INVALID_ETAG) {
        this.eTag = eTag;
    }

    valid() {
        return typeof this.eTag === "string" && this.eTag !== DEFAULT_INVALID_ETAG;
    }

    valueOf() {
        return this.eTag;
    }

    toJSON() {
        return {
            eTag: this.eTag
        };
    }

    static fromJSON(json: ReturnType<typeof GitHubETag.prototype.toJSON>): GitHubETag {
        return new GitHubETag(json.eTag);
    }
}
