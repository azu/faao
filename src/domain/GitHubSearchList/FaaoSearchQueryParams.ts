import { FaaoSearchQueryParam, FaaoSearchQueryParamJSON } from "./FaaoSearchQueryParam";

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
}
