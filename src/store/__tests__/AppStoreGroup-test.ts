// MIT © 2017 azu
import { AppStoreGroupState, createAppStoreGroup, createStoreMap } from "../AppStoreGroup";
import { storageManger } from "../../infra/repository/Storage";
import { Context, Dispatcher, StoreGroup } from "almin";
import { createReadyToAppUseCase } from "../../use-case/App/ReadyToAppUseCase";

describe("AppStoreGroup", () => {
    describe("when after initialized", () => {
        let appStoreGroup: StoreGroup<AppStoreGroupState>;
        beforeEach(async () => {
            await storageManger.useMemoryDriver();
            appStoreGroup = createAppStoreGroup(createStoreMap());
            // context connect dispatch with stores
            const context = new Context({
                dispatcher: new Dispatcher(),
                store: appStoreGroup
            });
            // initialized application
            return context
                .useCase(createReadyToAppUseCase())
                .executor(useCase => useCase.execute());
        });
        it("should not exist active items", () => {
            const state = appStoreGroup.getState();
            expect(state.app.activeQuery).toBeUndefined();
            expect(state.app.activeStream).toBeUndefined();
            expect(state.app.activeEvent).toBeUndefined();
            expect(state.app.activeSearchList).toBeUndefined();
        });
        it("should not exist default GitHubSetting", () => {
            expect(appStoreGroup.getState().gitHubSetting.settings).toHaveLength(0);
        });
        it("should not exist default Notice", () => {
            expect(appStoreGroup.getState().notice.hasNotice).toBe(false);
        });
        it("should exist default searchList", () => {
            expect(appStoreGroup.getState().gitHubSearchList.searchLists).toHaveLength(1);
        });
    });
});
