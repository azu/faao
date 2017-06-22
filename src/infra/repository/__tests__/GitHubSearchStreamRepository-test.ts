// MIT © 2017 azu
import { GitHubSearchStreamRepository } from "../GitHubSearchStreamRepository";
import { GitHubSearchStreamFactory } from "../../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";
import { GitHubSearchQuery } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchQueryColor } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQueryColor";
import localForage from "localforage";
import { Identifier } from "../../../domain/Entity";
import { GitHubSetting } from "../../../domain/GitHubSetting/GitHubSetting";
import { storageManger } from "../Storage";

const memoryStorageDriver = require("localforage-memoryStorageDriver");
describe("GitHubSearchStreamRepository", () => {
    beforeEach(async () => {
        await storageManger.useMemoryDriver();
    });
    afterEach(() => {
        return localForage.clear();
    });
    describe("#findByQuery", () => {
        test("should return undefined at first", async () => {
            const repository = new GitHubSearchStreamRepository(GitHubSearchStreamFactory.create());
            await repository.ready();
            const testQuery = new GitHubSearchQuery({
                name: "test",
                query: "test",
                color: new GitHubSearchQueryColor("#000000"),
                gitHubSettingId: new Identifier<GitHubSetting>("test@github.com")
            });
            const result = repository.findByQuery(testQuery);
            expect(result).toBeUndefined();
        });
        test("when exist stream json for query, it should return stream json", async () => {
            const searchResultJSON = require("./search_result.json");
            const streamJSON = {
                items: searchResultJSON.items
            };
            const stream = GitHubSearchStreamFactory.createFromStreamJSON(streamJSON);
            const repository = new GitHubSearchStreamRepository(stream);
            await repository.ready();
            const testQuery = new GitHubSearchQuery({
                name: "test",
                query: "test",
                color: new GitHubSearchQueryColor("#000000"),
                gitHubSettingId: new Identifier<GitHubSetting>("test@github.com")
            });
            await repository.saveWithQuery(stream, testQuery);
            const resultStream = repository.findByQuery(testQuery);
            expect(resultStream).not.toBeUndefined();
            const actualItems = stream.items.map(item => item.toJSON());
            expect(actualItems).toEqual(streamJSON.items);
        });
    });
});
