// MIT © 2017 azu
import { GitHubSearchList, GitHubSearchListJSON } from "../GitHubSearchList";

describe("GitHubSearchList", () => {
    it("json <-> model", () => {
        const json: GitHubSearchListJSON = {
            id: "id1",
            name: "Queries",
            queries: [
                {
                    name: "name",
                    query: "query",
                    color: "#ffffff",
                    gitHubSettingId: "1"
                }
            ]
        };
        const model = GitHubSearchList.fromJSON(json);
        expect(model).toBeInstanceOf(GitHubSearchList);
        expect(model.queries).toHaveLength(1);
        const jsonResult = model.toJSON();
        expect(jsonResult).toEqual(json);
    });
});
