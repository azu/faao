// MIT © 2017 azu
/**
 * @jest-environment null
 */
import { GitHubSearchStreamFactory } from "../GitHubSearchStreamFactory";
import { GitHubSearchResultItemSortedCollection } from "../GitHubSearchResultItemSortedCollection";
import { SearchFilterFactory } from "../SearchFilter/SearchFilterFactory";
import { GitHubSearchResultItem } from "../GitHubSearchResultItem";
import { RawGitHubSearchResultJSON } from "../GitHubSearchResultFactory";

const createCollection = (
    json: RawGitHubSearchResultJSON
): GitHubSearchResultItemSortedCollection => {
    const stream = GitHubSearchStreamFactory.createFromSearchResultJSON(json);
    return stream.itemSortedCollection as GitHubSearchResultItemSortedCollection;
};
const createItems = (json: RawGitHubSearchResultJSON): GitHubSearchResultItem[] => {
    return json.items.map(rawItem => {
        return GitHubSearchResultItem.fromJSON(rawItem);
    });
};
describe("GitHubSearchResultItemCollection", () => {
    describe("#mergeItems", () => {
        it("should return GitHubSearchResultItemCollection that merged items", () => {
            const collection = createCollection(require("./fixtures/2017-06-25-result.json"));
            expect(collection.items).toHaveLength(1);
            const newItems = createItems(require("./fixtures/2017-06-26-new-result.json"));
            const newCollection = collection.mergeItems(newItems);
            expect(newCollection.items).toHaveLength(2);
        });
        it("should prefer to use updated newer item", () => {
            // old -> new
            const collection = createCollection(require("./fixtures/2017-06-25-result.json"));
            const newItems = createItems(require("./fixtures/2017-06-26-updated-result.json"));
            const newCollection = collection.mergeItems(newItems);
            expect(newCollection.items).toHaveLength(1);
            const item = newCollection.getFirstItem();
            expect(item).toEqual(newItems[0]);
        });
    });
    describe("#differenceCollection", () => {
        it("should return a collection has 5 - 3 items", () => {
            const sourceCollection = createCollection(require("./fixtures/diff/3-items.json"));
            const newCollection = createCollection(require("./fixtures/diff/5-items.json"));
            const results = newCollection.differenceCollection(sourceCollection);
            expect(results.itemCount).toBe(2);
        });
    });
    describe("#sliceItemsFromCurrentItem", () => {
        it("should slice +1", () => {
            const collection = createCollection(require("./fixtures/2017-06-25-result.json"));
            const newItems = createItems(require("./fixtures/2017-06-26-new-result.json"));
            const newCollection = collection.mergeItems(newItems);
            const slicedItems = newCollection.sliceItemsFromCurrentItem(newItems[0], 1);
            expect(slicedItems).toHaveLength(1);
        });
        it("should slice -1", () => {
            const collection = createCollection(require("./fixtures/2017-06-25-result.json"));
            const newItems = createItems(require("./fixtures/2017-06-26-new-result.json"));
            // unshift
            const newCollection = collection.mergeItems(newItems);
            const oldItem = collection.items[0];
            const slicedItems = newCollection.sliceItemsFromCurrentItem(oldItem, -1);
            expect(slicedItems).toHaveLength(1);
        });
    });
    describe("#filterBySearchFilter", () => {
        describe("in", () => {
            it("should filter by text", () => {
                const searchFilter = SearchFilterFactory.create("NVDA prevents");
                const collection = createCollection(require("./fixtures/search_result.json"));
                const results = collection.filterBySearchFilter(searchFilter);
                expect(results).toHaveLength(1);
            });
        });
        describe("NOT", () => {
            it("should filter by NOT operator", () => {
                const searchFilter = SearchFilterFactory.create("AAAAA NOT BBBBB");
                const collection = createCollection(require("./fixtures/A_is_2_not_b.json"));
                const results = collection.filterBySearchFilter(searchFilter);
                expect(results).toHaveLength(1);
            });
        });
        describe("=", () => {
            it("should filter by = operator", () => {
                const searchFilter = SearchFilterFactory.create("state:open");
                const collection = createCollection(require("./fixtures/state-open-have-1.json"));
                const results = collection.filterBySearchFilter(searchFilter);
                expect(results).toHaveLength(1);
            });
            it("should filter by = operator AND in operator", () => {
                const searchFilter = SearchFilterFactory.create("UNKNOWN_MATCH_TEXT state:open");
                const collection = createCollection(require("./fixtures/state-open-have-1.json"));
                const results = collection.filterBySearchFilter(searchFilter);
                expect(results).toHaveLength(0);
            });
        });
        describe(">", () => {
            it("should filter by > operator", () => {
                // comments 100 is 1
                {
                    const searchFilter = SearchFilterFactory.create("comments:>99");
                    const collection = createCollection(
                        require("./fixtures/comments-100-is-1.json")
                    );
                    const results = collection.filterBySearchFilter(searchFilter);
                    expect(results).toHaveLength(1);
                }
                // comments 100> is 0
                {
                    const searchFilter = SearchFilterFactory.create("comments:>100");
                    const collection = createCollection(
                        require("./fixtures/comments-100-is-1.json")
                    );
                    const results = collection.filterBySearchFilter(searchFilter);
                    expect(results).toHaveLength(0);
                }
            });
        });
        describe(">=", () => {
            it("should filter by > operator", () => {
                const searchFilter = SearchFilterFactory.create("comments:>=100");
                const collection = createCollection(require("./fixtures/comments-100-is-1.json"));
                const results = collection.filterBySearchFilter(searchFilter);
                expect(results).toHaveLength(1);
            });
        });
    });
});
