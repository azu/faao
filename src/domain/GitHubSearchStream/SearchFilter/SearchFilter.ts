// MIT © 2017 azu
import { SearchFilterItem, SearchFilterItemJSON } from "./SearchFilterItem";

const filterable = require("filterable");

export interface FilterableItem {
    includes(v: any): boolean;
}

export interface SearchFilterJSON {
    filterText: string;
    items: SearchFilterItemJSON[];
}

export class SearchFilter {
    filterText: string;
    items: SearchFilterItem[];

    constructor(filterText: string = "") {
        this.filterText = filterText;
        this.items = filterable
            .Query(filterText)
            .parse()
            .toJSON()
            .map((json: SearchFilterItemJSON) => new SearchFilterItem(json));
    }

    /**
     * return true if match the own filter pattern.
     * @param item
     * @returns {boolean}
     */
    isMatch(item: FilterableItem) {
        return this.items.every(
            (filterItem): boolean => {
                const itemValue: any = (item as any)[filterItem.field];
                if (filterItem.type === "in") {
                    return item.includes(filterItem.value);
                } else if (filterItem.type === "nin") {
                    return !item.includes(filterItem.value);
                } else if (filterItem.type === "=") {
                    return itemValue === filterItem.value;
                } else if (filterItem.type === ">") {
                    return itemValue > filterItem.value;
                } else if (filterItem.type === ">=") {
                    return itemValue >= filterItem.value;
                } else if (filterItem.type === "<") {
                    return itemValue < filterItem.value;
                } else if (filterItem.type === "<=") {
                    return itemValue <= filterItem.value;
                }
                return false;
            }
        );
    }

    static fromJSON(json: SearchFilterJSON): SearchFilter {
        const setting = Object.create(SearchFilter.prototype);
        return Object.assign(setting, json, {
            items: json.items.map(item => SearchFilterItem.fromJSON(item))
        });
    }

    toJSON(): SearchFilterJSON {
        return Object.assign({}, this, {
            items: this.items.map(item => item.toJSON())
        });
    }
}
