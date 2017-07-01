// MIT © 2017 azu
import { ActivityHistory, ActivityHistoryItem } from "../ActivityHistory";
import { Identifier } from "../../Entity";
import { GitHubSearchResultItem } from "../../GitHubSearchStream/GitHubSearchResultItem";

describe("ActivityHistory", () => {
    it("#readItem", () => {
        it("when reach limit, remove oldest item and add new item", () => {
            const limit = 3;
            const history = new ActivityHistory([], limit);
            const items = Array.from(new Array(4)).map((_, index) => {
                return new ActivityHistoryItem({
                    id: new Identifier<GitHubSearchResultItem>(String(index)),
                    timeStamp: Date.now()
                });
            });
            for (let i = 0; i < limit; i++) {
                history.readItem(items[i]);
            }
            // reach limit
            history.readItem(items[3]);
            expect(history.items).toHaveLength(limit);
            expect(history.findById(items[0].id)).toEqual(items[0]);
            expect(history.findById(items[3].id)).toEqual(items[3]);
        });
    });
});
