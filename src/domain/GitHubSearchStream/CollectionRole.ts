import { SearchFilter } from "./SearchFilter/SearchFilter";
import { GitHubSearchResultItem } from "./GitHubSearchResultItem";

// share collection interface between normal and sorted
// sorted collection wont to inherit collection class
export type CollectionRole<T> = {
    rawItemCount: number;
    itemCount: number;
    applyFilter(filter: SearchFilter): T[];
    filterBySearchFilter(filter: SearchFilter): T[];
    includes(aItem: T): boolean;
    mergeItems(items: T[]): CollectionRole<T>;
    clear(): CollectionRole<T>;
    getFirstItem(): T | undefined;
    getItemAtIndex(index: number): T | undefined;
    getNextItem(currentItem: T): T | undefined;
    getPrevItem(currentItem: T): T | undefined;
    findItemByPredicate(predicate: (item: GitHubSearchResultItem) => boolean): T | undefined;
    removeItem(item: T): CollectionRole<T>;
    sliceItemsFromCurrentItem(currentItem: T, length: number): T[];
};
