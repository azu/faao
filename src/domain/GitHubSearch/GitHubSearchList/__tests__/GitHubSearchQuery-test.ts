// MIT © 2017 azu
import { GitHubSearchQuery, GitHubSearchQueryJSON } from "../GitHubSearchQuery";
import { GitHubSearchQueryColor } from "../GitHubSearchQueryColor";

describe("GitHubSearchQuery", () => {
    it("json <-> model", () => {
        const json: GitHubSearchQueryJSON = {
            name: "name",
            query: "query",
            color: "#ffffff",
            gitHubSettingId: "1"
        };
        const model = GitHubSearchQuery.fromJSON(json);
        expect(model).toBeInstanceOf(GitHubSearchQuery);
        expect(model.color).toBeInstanceOf(GitHubSearchQueryColor);
        const jsonResult = model.toJSON();
        expect(jsonResult).toEqual(json);
    });
});
