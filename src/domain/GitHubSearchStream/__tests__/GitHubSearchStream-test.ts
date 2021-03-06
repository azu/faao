// MIT © 2017 azu
import { GitHubSearchStreamFactory } from "../GitHubSearchStreamFactory";
import { GitHubSearchStream } from "../GitHubSearchStream";
import { sortBy } from "lodash";

describe("GitHubSearchStream", () => {
    it("should be toJSON <-> fromJSON", () => {
        const fixture = require("./fixtures/search_result.json");
        const stream = GitHubSearchStreamFactory.createFromSearchResultJSON(fixture);
        const json = stream.toJSON();
        const reCreatedStream = GitHubSearchStream.fromJSON(json);
        expect(reCreatedStream).toBeInstanceOf(GitHubSearchStream);
        const reJSON = reCreatedStream.toJSON();
        // This items is sorted
        expect(reJSON.id).toEqual(json.id);
        expect(sortBy(reJSON.itemSortedCollection.rawItems, "id")).toEqual(
            sortBy(json.itemSortedCollection.rawItems, "id")
        );
    });
});
