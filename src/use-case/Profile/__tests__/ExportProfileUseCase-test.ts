// MIT © 2017 azu
import { createStubContext } from "../../../test/AlminUseCaseStub";
import { ExportProfileUseCase, ExportProfileUseCasePayload } from "../ExportProfileUseCase";
import { GitHubSettingRepository } from "../../../infra/repository/GitHubSettingsRepository";
import { GitHubSearchListRepository } from "../../../infra/repository/GitHubSearchListRepository";
import { GitHubSearchListFactory } from "../../../domain/GitHubSearchList/GitHubSearchListFactory";
import { ProfileJSON } from "../../../domain/Profile/Profile";
import { GitHubUserRepository } from "../../../infra/repository/GitHubUserRepository";

describe("ExportProfileUseCase", () => {
    it("should dispatch ExportProfileUseCasePayload", () => {
        const { context, dispatchedPayloads } = createStubContext(ExportProfileUseCase);
        const gitHubSettingRepository = new GitHubSettingRepository();
        const gitHubSearchListRepository = new GitHubSearchListRepository(
            GitHubSearchListFactory.createDefaultSearchList()
        );
        const gitHubUserRepository = new GitHubUserRepository();
        return context
            .useCase(
                new ExportProfileUseCase({
                    gitHubSearchListRepository,
                    gitHubSettingRepository,
                    gitHubUserRepository
                })
            )
            .executor(useCase => {
                return useCase.execute();
            })
            .then(() => {
                expect(dispatchedPayloads).toHaveLength(1);
                const payload: any = dispatchedPayloads[0];
                expect(payload).toBeInstanceOf(ExportProfileUseCasePayload);
                const profile: ProfileJSON = payload.json;
                expect(profile).toHaveProperty("GitHubSearchLists");
                expect(profile).toHaveProperty("GitHubSettings");
                expect(profile).toHaveProperty("GitHubUsers");
            });
    });
});
