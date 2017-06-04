// MIT © 2017 azu
import { GitHubSearchStreamRepository } from "../GitHubSearchStreamRepository";
import { GitHubSearchStreamFactory } from "../../../domain/GitHubSearch/GitHubSearchStream/GitHubSearchStreamFactory";
import { GitHubSearchQuery } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQuery";
import { GitHubSearchQueryColor } from "../../../domain/GitHubSearch/GitHubSearchList/GitHubSearchQueryColor";
import localForage from "localforage";
import { EntityId } from "../../../domain/util/EntityId";
import { GitHubSetting } from "../../../domain/GitHubSetting/GitHubSetting";

const memoryStorageDriver = require("localforage-memoryStorageDriver");
describe("GitHubSearchStreamRepository", () => {
    beforeEach(() => {
        return localForage.defineDriver(memoryStorageDriver).then(() => {
            return localForage.setDriver(memoryStorageDriver._driver);
        });
    });
    afterEach(() => {
        return localForage.clear();
    });
    describe("#findByQuery", () => {
        test("should return undefined at first", () => {
            const repository = new GitHubSearchStreamRepository(GitHubSearchStreamFactory.create());
            const testQuery = new GitHubSearchQuery({
                name: "test",
                query: "test",
                color: new GitHubSearchQueryColor("#000000"),
                gitHubSettingId: new EntityId<GitHubSetting>("test@github.com")
            });
            return repository.findByQuery(testQuery).then((value) => {
                expect(value).toBeUndefined();
            });
        });
        test("when exist stream json for query, it should return stream json", async () => {
            const searchResultJSON = require("./search_result.json");
            const streamJSON = {
                items: searchResultJSON.items
            };
            const stream = GitHubSearchStreamFactory.createFromStreamJSON(streamJSON);
            const repository = new GitHubSearchStreamRepository(stream);
            const testQuery = new GitHubSearchQuery({
                name: "test",
                query: "test",
                color: new GitHubSearchQueryColor("#000000"),
                gitHubSettingId: new EntityId<GitHubSetting>("test@github.com")
            });
            await repository.saveWithQuery(stream, testQuery);
            return repository.findByQuery(testQuery).then((value) => {
                expect(value).not.toBeUndefined();
                const actualItems = value.items.map(item => item.toJSON());
                expect(actualItems).toEqual(streamJSON.items);
            });
        });
    });
});