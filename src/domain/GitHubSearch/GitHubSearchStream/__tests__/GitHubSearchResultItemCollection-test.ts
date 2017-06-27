// MIT © 2017 azu
/**
 * @jest-environment null
 */
import { GitHubSearchResultItemCollection } from "../GitHubSearchResultItemCollection";
import { GitHubSearchStreamFactory } from "../GitHubSearchStreamFactory";
import { GitHubSearchResultItemSortedCollection } from "../GitHubSearchResultItemSortedCollection";
import { GitHubSearchStreamJSON } from "../GitHubSearchStream";
import { SearchFilterFactory } from "../SearchFilter/SearchFilterFactory";
import { GitHubSearchResultItem } from "../GitHubSearchResultItem";

const createCollection = (
    json: GitHubSearchStreamJSON
): GitHubSearchResultItemSortedCollection<GitHubSearchResultItem> => {
    const stream = GitHubSearchStreamFactory.createFromStreamJSON(json);
    return stream.itemSortedCollection;
};
const createItems = (json: GitHubSearchStreamJSON): GitHubSearchResultItem[] => {
    return json.items.map(rawItem => {
        return new GitHubSearchResultItem(rawItem);
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
