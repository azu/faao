import { FaaoSearchQueryParam, FaaoSearchQueryParamJSON } from "./FaaoSearchQueryParam";
import { splice } from "@immutable-array/prototype";

export interface FaaoSearchQueryParamsJSON {
    params: FaaoSearchQueryParamJSON[];
}

export interface FaaoSearchQueryParamsArgs {
    params: FaaoSearchQueryParam[];
}

export class FaaoSearchQueryParams {
    params: FaaoSearchQueryParam[];

    constructor(args: FaaoSearchQueryParamsArgs) {
        this.params = args.params;
    }

    get hasAtLeastOne() {
        return this.params.length > 0;
    }

    static fromJSON(json: FaaoSearchQueryParamsJSON) {
        const setting = Object.create(FaaoSearchQueryParams.prototype);
        return Object.assign(setting, json, {
            params: json.params.map(param => FaaoSearchQueryParam.fromJSON(param))
        });
    }

    toJSON(): FaaoSearchQueryParamsJSON {
        return Object.assign({}, this, {
            params: this.params.map(param => param.toJSON())
        });
    }

    hasParam(param: FaaoSearchQueryParam) {
        return this.params.some(inParam => inParam.equals(param));
    }

    /**
     * No duplicated param
     * @param param
     */
    add(param: FaaoSearchQueryParam) {
        if (this.hasParam(param)) {
            return this;
        }
        return new FaaoSearchQueryParams({
            ...this,
            params: this.params.concat(param)
        });
    }

    remove(param: FaaoSearchQueryParam) {
        const index = this.params.findIndex(inParam => inParam.equals(param));
        if (index === -1) {
            return this;
        }
        return new FaaoSearchQueryParams({
            ...this,
            params: splice(this.params, index, 1)
        });
    }

    includesURL(url: string) {
        return this.params.some(param => param.url === url);
    }
}
