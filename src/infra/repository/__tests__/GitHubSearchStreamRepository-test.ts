// MIT © 2017 azu
import { GitHubSearchStreamRepository } from "../GitHubSearchStreamRepository";
import { GitHubSearchStreamFactory } from "../../../domain/GitHubSearchStream/GitHubSearchStreamFactory";
import { GitHubSearchQuery } from "../../../domain/GitHubSearchList/queries/GitHubSearchQuery";
import { QueryColor } from "../../../domain/GitHubSearchList/queries/QueryColor";
import localForage from "localforage";
import { Identifier } from "../../../domain/Entity";
import { GitHubSetting } from "../../../domain/GitHubSetting/GitHubSetting";
import { storageManger } from "../Storage";

describe("GitHubSearchStreamRepository", () => {
    beforeEach(async () => {
        await storageManger.useMemoryDriver();
    });
    afterEach(() => {
        return localForage.clear();
    });
    describe("#findByQuery", () => {
        it("should return undefined at first", async () => {
            const repository = new GitHubSearchStreamRepository(GitHubSearchStreamFactory.create());
            await repository.ready();
            const testQuery = new GitHubSearchQuery({
                name: "test",
                query: "test",
                color: new QueryColor("#000000"),
                gitHubSettingId: new Identifier<GitHubSetting>("test@github.com")
            });
            const result = repository.findByQuery(testQuery);
            expect(result).toBeUndefined();
        });
        it("when exist stream json for query, it should return stream json", async () => {
            const searchResultJSON = require("./search_result.json");
            const streamJSON = {
                id: "stream1",
                items: searchResultJSON.items
            };
            const stream = GitHubSearchStreamFactory.createFromSearchResultJSON(streamJSON);
            const repository = new GitHubSearchStreamRepository(stream);
            await repository.ready();
            const testQuery = new GitHubSearchQuery({
                name: "test",
                query: "test",
                color: new QueryColor("#000000"),
                gitHubSettingId: new Identifier<GitHubSetting>("test@github.com")
            });
            await repository.saveWithQuery(stream, testQuery);
            const resultStream = repository.findByQuery(testQuery);
            expect(resultStream).not.toBeUndefined();
        });
    });
});
