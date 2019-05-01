import ghUrlToObject from "github-url-to-object";

export interface FaaoSearchQueryParamJSON {
    url: string;
}

export interface FaaoSearchQueryParamArgs {
    url: string;
}

export class FaaoSearchQueryParam {
    url: string;

    constructor(args: FaaoSearchQueryParamArgs) {
        this.url = args.url;
    }

    /**
     * return parsed parameter
     */
    parsed() {
        // https://github.com/zeke/github-url-to-object#github-enterprise
        const isEnterprise = !this.url.startsWith("https://github.com/");
        const object = ghUrlToObject(this.url, { enterprise: isEnterprise });
        if (!object) {
            return null;
        }
        const match = this.url.match(/(?:issues|pull)\/(\d+)/);
        if (!match) {
            return null;
        }
        const type = /issues/.test(this.url) ? "issue" : "pull";
        const no = match[1];
        return {
            user: object.user,
            repo: object.repo,
            type,
            no,
            https_url: object.https_url
        };
    }

    static fromJSON(json: FaaoSearchQueryParamJSON): FaaoSearchQueryParam {
        const setting = Object.create(FaaoSearchQueryParam.prototype);
        return Object.assign(setting, json, {});
    }

    toJSON(): FaaoSearchQueryParamJSON {
        return Object.assign({}, this, {
            url: this.url
        });
    }
}
