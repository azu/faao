// MIT © 2017 azu
import { SearchFilterItem, SearchFilterItemJSON } from "./SearchFilterItem";

const filterable = require("filterable");

export interface FilterableItem {
    includes(v: any): boolean;
}

export class SearchFilter {
    filterText: string;
    items: SearchFilterItem[];

    constructor(filterText: string) {
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
                    return item.includes(filterItem.value) === false;
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
}
