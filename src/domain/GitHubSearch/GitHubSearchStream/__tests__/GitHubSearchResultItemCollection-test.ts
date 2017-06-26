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
describe("GitHubSearchResultItemCollection", () => {
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
